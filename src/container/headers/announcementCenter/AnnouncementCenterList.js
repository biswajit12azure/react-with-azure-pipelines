import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { FilterListOff } from '@mui/icons-material';
import { ModalPopup } from '_components';
import AnnouncementCenterDetails from './AnnouncementCenterDetails';
import { Delete, Deletewhite, materialsymbolsdownload } from 'images';
import { base64ToFile } from '_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertActions } from '_store';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
const AnnouncementCenterList = ({ announcementData, rowSelection, isModalOpen, setIsModalOpen, selectedRows, setSelectedRows, setRowSelection, handleDelete, handleToggleActiveStatus, handleRefresh }) => {
    const header = "Announcement";
    const dispatch = useDispatch();
    const data = announcementData || [];

    const [rowToDelete, setRowToDelete] = useState(null); // State to store the row to be deleted

    const handleOpenModal = (row) => {
        setRowToDelete(row); // Set the row to be deleted
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRowToDelete(null); // Clear the row to be deleted
    };

    const handleRowDelete = async () => {
        if (rowToDelete) {
            dispatch(alertActions.clear());
            await handleDelete(rowToDelete);
            handleRefresh();
            setIsModalOpen(false);
            setSelectedRows([]);
            setRowSelection({});
            dispatch(alertActions.success({ message: "Announcement deleted successfully", header: header }));
            setRowToDelete(null); // Clear the row to be deleted
        }
    };


    const handleDownload = (fileData) => {
        if (fileData && fileData.File) {
            base64ToFile(fileData.File, fileData.FileName);
        }
    };

    const columns = [
        {
            accessorKey: "Title",
            header: "TITLE",
            Cell: ({ row }) => {
                const startDate = dayjs(row.original.StartDate);
                const isTodayOrFuture = startDate.isSame(dayjs(), 'day') || startDate.isAfter(dayjs());
                return (<span onClick={() => handleAddEdit(row)} >
                    <Typography sx={{ ml: 1, color: isTodayOrFuture ? 'red !important' : 'inherit' }}>{row.original.Title}</Typography>
                </span>
            )
        }
        },
        { accessorKey: "PortalName", header: "Portal Name"},
        {
            accessorKey: "StartDate",
            header: "START DATE",
            Cell: ({ row }) => (
                <Typography>{dayjs(row.original.StartDate).format('MM/DD/YYYY hh:mm:ss A')}</Typography>
            ),
        },
    ];

    const handleAddEdit = (row) => {
        row.toggleExpanded();
    };

    const table = useMaterialReactTable({
        columns,
        data: data,
        enableHiding: false,
        columnFilterDisplayMode: 'popover',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableRowActions: true,
        enableRowSelection: true,
        enableExpandAll: false,
        positionExpandColumn: 'first',
        positionActionsColumn: "last",
        positionToolbarAlertBanner: 'none',
        autoResetPageIndex: false,
        state: {
            rowSelection,
        },
        getRowId: (row) => row.ID, // Ensure unique IDs for rows
        onRowSelectionChange: (newRowSelection) => {
            setRowSelection(newRowSelection); // Update row selection state
        },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10, // make the expand column wider
                muiTableHeadCellProps: {
                    sx: {
                        display: 'none', // Hide the expand column
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        display: 'none', // Hide the expand column
                    },
                },
            },
        },
        initialState: {
            columnOrder: [
                'mrt-row-expand',
                'mrt-row-select',
                'Title',
                'PortalName',
                'StartDate',
                'FileData',
                'mrt-row-actions'
            ]
        },
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Tooltip title="Refresh" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleRefresh}>
                            <FilterListOff variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="Delete Selected" className='DeleteSelected'>
                    <div>
                        <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows?.length === 0}>
                            <img src={Deletewhite} alt="Delete"  ></img>
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => {
            return (
                <div className='tableicons'>
                    <IconButton className='delete' onClick={() => handleOpenModal(row.original)}>
                        <img src={Delete} alt="Delete"></img>
                    </IconButton>
                    {isModalOpen && rowToDelete && (
                        <ModalPopup
                            header="Announcement"
                            message1="Are you sure you want to delete this Announcement?"
                            btnPrimaryText="Confirm"
                            btnSecondaryText="Cancel"
                            handlePrimaryClick={handleRowDelete}
                            handleSecondaryClick={handleCloseModal}
                        />
                    )}
                    {row.original?.FileData && 
                    <IconButton onClick={() => handleDownload(row.original?.FileData)}>
                        <img src={materialsymbolsdownload} alt='download'></img>
                    </IconButton>
                    }
                </div>
            )
        },
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <AnnouncementCenterDetails row={row.original} />
            </Box>
        ),
        muiExpandButtonProps: {
            sx: {
                display: 'none',
            },
        },
    });

    useEffect(() => {
        const selectedFlatRows = table.getSelectedRowModel().flatRows;
        setSelectedRows(selectedFlatRows.map((row) => row.original)); // Extract original row data
    }, [rowSelection, table]); // Re-run when rowSelection changes

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider>
        </>
    );
};

export default AnnouncementCenterList;
