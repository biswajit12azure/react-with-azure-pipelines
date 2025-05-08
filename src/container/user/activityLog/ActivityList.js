import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en'; // ✅ Import default localization
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { activityLogAction, alertActions } from '_store';
import Grid from "@mui/material/Grid2";
import { useDispatch } from 'react-redux';
import ActivityDetails from './ActivityDetails';
import { useParams } from 'react-router-dom';
import { Download } from '_components';
import ActivityFilter from './ActivityFilter';

const ActivityList = () => {
    const header = " Activity Log";
    const dispatch = useDispatch();
    const { portalID } = useParams();
    const [data, setData] = useState([]);
    const [openComponent, setOpenComponent] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const supportedFiles = ['PDF', 'XLS'];

    const updateData = (data) => {
        return data.map(record => ({
            ...record,
            StatusText: record.Status ? 'Success' : 'Failed'
        }));
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(activityLogAction.get(portalID)).unwrap();
                const data = result?.Data;
                const updatedData = updateData(data);
                setData(updatedData);
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: `${header} Failed`
                }));
            }
        };
        fetchData();
    }, [dispatch]);

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'CreatedOn',
                header: 'Timestamp',
                filterFn: (row, columnId, filterValue) => {
                    const dateValue = row.getValue(columnId);
                    return dayjs(dateValue).format('MM/DD/YYYY HH:mm').toLowerCase().includes(filterValue.toLowerCase());
                },
                Cell: ({ row, cell }) => (
                    <span onClick={() => handleAddEdit(row)} >
                        {dayjs(cell.getValue()).format('MM/DD/YYYY HH:mm')}
                    </span>
                ),
            },
            {
                accessorKey: 'UserName',
                header: 'User email address',
            },
            {
                accessorKey: 'Organization',
                header: 'Organization',
            },
            {
                accessorKey: 'Activity',
                header: 'Activity',
            },
            {
                accessorKey: 'ActivityDetails',
                header: 'Details',
                Cell: ({ cell }) => {
                    const details = cell.getValue();
                    return details.length > 15 ? `${details.substring(0, 15)}...` : details;
                },
            },
            {
                accessorKey: 'StatusText',
                header: 'Status',
                Cell: ({ row, cell }) => {
                    const status = cell.getValue();
                    const backgroundColor = row.original.Status ? 'green' : 'red';
                    return (
                        <span style={{ backgroundColor, color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                            {status}
                        </span>
                    );
                },
            },
        ];
    }, []);

    const handleAddEdit = (row) => {
        row.toggleExpanded();
    };

    const handleOpenComponent = (component) => {
        setOpenComponent(prev => prev === component ? null : component);
        setBackdropOpen(prev => prev === component ? false : true);
    };

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
        setOpenComponent(null);
    };

    const handleFilterSubmit = async (newData) => {
        const updatedData = updateData(newData);
        setData(updatedData);
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableHiding: false,
        columnFilterDisplayMode: 'popover',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableRowActions: false,
        enableRowSelection: false,
        enableExpandAll: false,
        positionExpandColumn: 'first',
        positionActionsColumn: "last",
        positionToolbarAlertBanner: 'none',
        autoResetPageIndex: false,
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10,
                muiTableHeadCellProps: {
                    sx: {
                        display: 'none',
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        display: 'none',
                    },
                },
            },
        },
        initialState: {
            columnOrder: [
                'mrt-row-expand',
                'CreatedOn',
                'UserName',
                'Organization',
                'Activity',
                "ActivityDetails",
                "Status"
            ]
        },
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <ActivityDetails data={row.original} />
            </Box>
        ),
        muiExpandButtonProps: {
            sx: {
                display: 'none',
            },
        },
        // ✅ Custom empty message
        localization: {
            ...MRT_Localization_EN,
            noRecordsToDisplay: 'No results found for the provided search criteria.',
        },
        renderEmptyRowsFallback: () => (
            <Box sx={{ padding: 4, textAlign: 'center', color: 'gray' }}>
                🔍 <Typography>No results found for the provided search criteria.</Typography>
            </Box>
        ),
    });

    return (
        <>
            <Typography component="div" className='userprofilelist '>
                <Grid container direction="row" spacing={2}>
                    <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                        <Grid container>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Typography variant="h2" className='userprofilelistcontent'>Activity Log</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                        <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                            <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                        <ActivityFilter
                                            portalID={portalID}
                                            handleFilterSubmit={handleFilterSubmit}
                                            isOpen={openComponent === 'filter'}
                                            onClose={handleCloseBackdrop}
                                            onOpen={() => handleOpenComponent('filter')}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                        <Download rows={data} headers={columns} filename={header} supportedFiles={supportedFiles} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box className="ActivityList">
                    <MaterialReactTable table={table} />
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default ActivityList;
