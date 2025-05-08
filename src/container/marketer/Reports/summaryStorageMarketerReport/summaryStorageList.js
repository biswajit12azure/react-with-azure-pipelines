import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const SummaryStorageList = ({ data = {}, ref }) => {
    const mainData = useMemo(() => {
        return (data && data.storageSummaryReportResponses) ? data.storageSummaryReportResponses : [];
    }, [data]);

    const totalRow = useMemo(() => {
        if (mainData.length === 0) return null;

        const { TotalSumInventoryBalance, TotalSumInjection, TotalSumWithdrawal } = (data && data.totalSum) || {};

        if (
            TotalSumInventoryBalance !== undefined && 
            TotalSumInjection !== undefined && 
            TotalSumWithdrawal !== undefined &&
            (TotalSumInventoryBalance !== 0 || TotalSumInjection !== 0 || TotalSumWithdrawal !== 0)
        ) {
            return {
                ShortName: 'Total',
                isTotal: true,
                Injection: TotalSumInjection,
                Withdrawl: TotalSumWithdrawal,
                InventoryBalance: TotalSumInventoryBalance,
            };
        }
        return null;
    }, [mainData, data]);

    const transformedData = totalRow ? [...mainData, totalRow] : mainData;

    const columns = useMemo(() => [
        {
            accessorKey: 'ShortName',
            header: 'Marketer',
            muiTableHeadCellProps: {
                sx: { textAlign: 'left' },
            },
            Cell: ({ row }) => (
                <Typography
                    sx={{
                        padding: '8px',
                        textAlign: 'left',
                        color: row.original.isTotal ? 'white' : '#1976d2',
                        fontWeight: row.original.isTotal ? 'bold' : 'normal',
                        backgroundColor: row.original.isTotal ? '#1976d2' : 'inherit',
                        pointerEvents: row.original.isTotal ? 'none' : 'auto',
                    }}
                >
                    {row.original.ShortName}
                </Typography>
            ),
        },
        {
            accessorKey: 'Injection',
            header: 'Injections',
            muiTableHeadCellProps: {
                sx: { textAlign: 'left' },
            },
            Cell: ({ row }) => (
                <Typography
                    sx={{
                        padding: '8px',
                        textAlign: 'left',
                        color: row.original.isTotal ? 'white' : '#1976d2',
                        fontWeight: row.original.isTotal ? 'bold' : 'normal',
                        backgroundColor: row.original.isTotal ? '#1976d2' : 'inherit',
                        pointerEvents: row.original.isTotal ? 'none' : 'auto',
                    }}
                >
                    {row.original.Injection}
                </Typography>
            ),
        },
        {
            accessorKey: 'Withdrawl',
            header: 'Withdrawals',
            muiTableHeadCellProps: {
                sx: { textAlign: 'left' },
            },
            Cell: ({ row }) => (
                <Typography
                    sx={{
                        padding: '8px',
                        textAlign: 'left',
                        color: row.original.isTotal ? 'white' : '#1976d2',
                        fontWeight: row.original.isTotal ? 'bold' : 'normal',
                        backgroundColor: row.original.isTotal ? '#1976d2' : 'inherit',
                        pointerEvents: row.original.isTotal ? 'none' : 'auto',
                    }}
                >
                    {row.original.Withdrawl}
                </Typography>
            ),
        },
        {
            accessorKey: 'InventoryBalance',
            header: 'Inventory Balance',
            muiTableHeadCellProps: {
                sx: { textAlign: 'left' },
            },
            Cell: ({ row }) => (
                <Typography
                    sx={{
                        padding: '8px',
                        textAlign: 'left',
                        color: row.original.isTotal ? 'white' : '#1976d2',
                        fontWeight: row.original.isTotal ? 'bold' : 'normal',
                        backgroundColor: row.original.isTotal ? '#1976d2' : 'inherit',
                        pointerEvents: row.original.isTotal ? 'none' : 'auto',
                    }}
                >
                    {row.original.InventoryBalance}
                </Typography>
            ),
        },
    ], []);

    const table = useMaterialReactTable({
        columns,
        data: transformedData,
        getRowId: (row) => row.ShortName + (row.isTotal ? '_total' : ''),
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
            columnOrder: [],
        },

        muiTableBodyRowProps: ({ row }) => (
            row.original.isTotal
                ? {
                    sx: {
                        backgroundColor: '#1976d2 !important',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 2,
                        pointerEvents: 'none',
                        '&:hover': {
                            backgroundColor: '#1976d2 !important',
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                            backgroundColor: '#1976d2 !important',
                        },
                        '& td': {
                            fontWeight: 'bold !important',
                            color: 'white !important',
                            backgroundColor: '#1976d2 !important',
                        },
                    },
                }
                : {}
        ),

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
        <Box
            id="table-container"
            ref={ref}
            sx={{
                height: '500px',
                overflow: 'auto',
            }}
        >
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SummaryStorageList;
