import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const ForecastReportList = ({ forecastData, subtotal, ref }) => {
    const authUser = useSelector(x => x.auth?.value);
    const user = authUser?.Data;

    const dateKeys = useMemo(() => {
        const dates = Array.from(new Set(forecastData.map(item =>
            dayjs(item.ShipmentDate).format('YYYY-MM-DD')
        )));
        return dates.sort().slice(0, 5);
    }, [forecastData]);

    const mainData = useMemo(() => {
        const grouped = {};
        forecastData.forEach(item => {
            const name = item.Name;
            const dateKey = dayjs(item.ShipmentDate).format('YYYY-MM-DD');
            if (!grouped[name]) {
                grouped[name] = { Name: name };
            }
            grouped[name][dateKey] = item.DailyRequiredVolume;
        });
        return Object.values(grouped);
    }, [forecastData, dateKeys]);

    const generateSubTotals = (subTotalData) => {
        const targetDates = subTotalData.map(item =>
            item.SubTotalDate.split("T")[0]
        );

        const subTotalByFirm = {
            Name: "SubTotal by Firm",
            isSubTotalByFirm: true,
        };

        const subTotalByInterruptible = {
            Name: "SubTotal by Interruptible",
            isSubTotalByInterruptible: true,
        };

        const totalsRow = {
            Name: "Totals",
            isTotal: true,
        };

        targetDates.forEach(date => {
            const data = subTotalData.find(item => item.SubTotalDate.startsWith(date));
            subTotalByFirm[date] = data ? data.SubTotalByFirm : 0;
            subTotalByInterruptible[date] = data ? data.SubToatlByInterruptible : 0;
            totalsRow[date] = data ? data.BothSubTotal : 0;
        });

        return { subTotalByFirm, subTotalByInterruptible, totalsRow };
    };

    const { subTotalByFirm, subTotalByInterruptible, totalsRow } = generateSubTotals(subtotal);

    const transformedData = useMemo(() => {
        const rows = [...mainData];

        if (subtotal && subtotal.length > 0) {
            rows.push(subTotalByFirm, subTotalByInterruptible, totalsRow);
        }

        return rows;
    }, [mainData, subtotal, subTotalByFirm, subTotalByInterruptible, totalsRow]);

    const columns = useMemo(() => {
        const base = [
            {
                accessorKey: 'Name',
                header: 'Group',
                muiTableHeadCellProps: {
                    sx: { textAlign: 'left' },
                },
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            padding: '8px',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            color:
                                row.original.isTotal ||
                                row.original.isSubTotalByFirm ||
                                row.original.isSubTotalByInterruptible
                                    ? 'white'
                                    : '#1976d2',
                            backgroundColor:
                                row.original.isTotal ||
                                row.original.isSubTotalByFirm ||
                                row.original.isSubTotalByInterruptible
                                    ? '#1976d2'
                                    : 'inherit',
                        }}
                    >
                        {row.original.Name}
                    </Typography>
                ),
            },
        ];

        const dateCols = dateKeys.map(dateKey => ({
            accessorKey: dateKey,
            header: dayjs(dateKey).format('MM/DD'),
            muiTableHeadCellProps: {
                sx: { textAlign: 'left' },
            },
            Cell: ({ row }) => (
                <Typography
                    sx={{
                        padding: '8px',
                        fontWeight:
                            row.original.isTotal ||
                            row.original.isSubTotalByFirm ||
                            row.original.isSubTotalByInterruptible
                                ? 'bold'
                                : 'normal',
                        textAlign: 'left',
                        color:
                            row.original.isTotal ||
                            row.original.isSubTotalByFirm ||
                            row.original.isSubTotalByInterruptible
                                ? 'white'
                                : 'inherit',
                        backgroundColor:
                            row.original.isTotal ||
                            row.original.isSubTotalByFirm ||
                            row.original.isSubTotalByInterruptible
                                ? '#1976d2'
                                : 'inherit',
                    }}
                >
                    {row.original[dateKey] ?? 0}
                </Typography>
            ),
        }));

        return [...base, ...dateCols];
    }, [dateKeys]);

    const table = useMaterialReactTable({
        columns,
        data: transformedData,
        getRowId: (row) => row.Name,
        enableHiding: false,
        enableExpandAll: false,
        enableRowActions: false,
        enableRowSelection: false,
        enableColumnActions: false,
        enableFullScreenToggle: false,
        autoResetPageIndex: false,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionActionsColumn: 'last',
        positionToolbarAlertBanner: 'none',
        initialState: {
            columnOrder: ['Name', ...dateKeys],
        },

        muiTableBodyRowProps: ({ row }) => {
            const isSpecialRow =
                row.original.isTotal ||
                row.original.isSubTotalByFirm ||
                row.original.isSubTotalByInterruptible;

            if (isSpecialRow) {
                return {
                    sx: {
                        backgroundColor: '#1976d2 !important',
                        pointerEvents: 'none',
                        '& td': {
                            color: 'white !important',
                            fontWeight: 'bold !important',
                            backgroundColor: '#1976d2 !important',
                        },
                        '&:hover': {
                            backgroundColor: '#1976d2 !important',
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                            backgroundColor: '#1976d2 !important',
                        },
                    },
                };
            }

            return {};
        },

        muiTableBodyProps: {
            sx: {
                '& .MuiTableBody-root .MuiTableRow-root:only-child td': {
                    textAlign: 'left',
                    fontStyle: 'italic',
                },
            },
        },

        renderEmptyRowsFallback: () => (
            <Typography sx={{ p: 3, textAlign: 'center', fontStyle: 'italic' }}>
                No results found for the provided search criteria.
            </Typography>
        ),
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box id="table-container" ref={ref}>
                <MaterialReactTable table={table} />
            </Box>
        </LocalizationProvider>
    );
};

export default ForecastReportList;
