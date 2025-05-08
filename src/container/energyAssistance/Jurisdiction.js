import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import { labels } from '_utils/labels';
import Download from '_components/Download';

const Jurisdiction = () => {
    const filename = 'Jurisdiction';
    const [rows, setRow] = useState([
        { id: 1, jurisdiction: "John Doe", seasonStart: null, seasonEnd: null },
        // other data...
    ]);

    const data = useMemo(() => {
        return rows ? rows : [];
    }, [rows]);

    const columns = useMemo(() => [
        {
            accessorKey: 'jurisdiction',
            header: labels.jurisdictionLabel,
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'seasonStart',
            header: labels.seasonStartLabel,
            enableSorting: true,
            enableColumnFilter: true,
            Filter: ({ column }) => (
                <DatePicker
                    value={column.getFilterValue() ? dayjs(column.getFilterValue()) : null}
                    onChange={(newValue) => {
                        column.setFilterValue(newValue ? newValue.toISOString() : undefined);
                    }}
                    inputFormat="MM/DD/YYYY"
                    slotProps={{ textField: { variant: 'outlined', placeholder: "MM/DD/YYYY" } }}
                />
            ),
            Cell: ({ cell }) => (
                <DatePicker
                    value={cell.getValue() ? dayjs(cell.getValue()) : null}
                    onChange={(newValue) => {
                        const updatedData = data.map(item =>
                            item.id === cell.row.original.id ? { ...item, seasonStart: newValue ? newValue.toISOString() : null } : item
                        );
                        setRow(updatedData);
                    }}
                    inputFormat="MM/DD/YYYY"
                    slotProps={{ textField: { variant: 'outlined', placeholder: "MM/DD/YYYY" } }}
                />
            ),
        },
        {
            accessorKey: 'seasonEnd',
            header: labels.seasonEndLabel,
            enableSorting: true,
            enableColumnFilter: true,
            Filter: ({ column }) => (
                <DatePicker
                    value={column.getFilterValue() ? dayjs(column.getFilterValue()) : null}
                    onChange={(newValue) => {
                        column.setFilterValue(newValue ? newValue.toISOString() : undefined);
                    }}
                    inputFormat="MM/DD/YYYY"
                    slotProps={{ textField: { variant: 'outlined', placeholder: "MM/DD/YYYY" } }}
                />
            ),
            Cell: ({ cell }) => (
                <DatePicker
                    value={cell.getValue() ? dayjs(cell.getValue()) : null}
                    onChange={(newValue) => {
                        const updatedData = data.map(item => {
                            if (item.id === cell.row.original.id) {
                                return {
                                    ...item,
                                    seasonEnd: newValue ? newValue.toISOString() : null,
                                };
                            }
                            return item;
                        });
                        setRow(updatedData);
                    }}
                    inputFormat="MM/DD/YYYY"
                    slotProps={{ textField: { variant: 'outlined', placeholder: "MM/DD/YYYY" } }}
                />
            ),
        }
        // other columns...
    ], [data]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnFilters: true,
        enableSorting: true,
        enableHiding: false,
        enableGlobalFilter: false,
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        muiTablePaginationProps: {
            className: 'custom-pager',
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
                <Download rows={data} headers={columns} filename={filename} />
            </Box>
        ),
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
        </LocalizationProvider>
    );
};

export default Jurisdiction;
