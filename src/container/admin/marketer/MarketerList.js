import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box, InputAdornment, TextField, Tooltip } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline, Clear, DeleteForever, Sync } from '@mui/icons-material';
import { ModalPopup, MultiSelectAutocomplete } from '_components';
import { MarketerDetails } from "container/admin";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MarketerList = ({ marketerData, rowSelection, handleChange, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
    setRowSelection, handleToggleActiveStatus, handleRefresh }) => {

    const uetFiles = marketerData?.UETFileDate?.map(uet => ({ value: uet.UETFileID, label: uet.UETFileName })) || [];
    const data = marketerData?.Marketers || [];
    const [selectedRow, setSelectedRow] = useState(null);

    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

    const handleMultiSelectChange = (newValue, row, columnKey) => {
        handleChange(newValue, row.original, columnKey);
        setIsConfirmEnabled(true);
    };

    const handleInputChange = (value, row, columnKey) => {
        handleChange(value, row.original, columnKey);
        setIsConfirmEnabled(true);
    };

    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleLockToggle = (selectedRow) => {
        onLockToggle(selectedRow);
        setIsModalOpen(false);
    }

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: 'PortalID', header: 'Portal ID',
                enableEditing: false,
                enableSorting: true,
                Cell: ({ row }) => (
                    <span onClick={() => handleAddEdit(row)} >
                        {row.original.PortalID}
                    </span>
                ),
            },
            {
                accessorKey: 'MarketerName',
                header: 'Marketer Name',
                enableEditing: true,
                enableSorting: true,
                Cell: ({ cell, row }) => (
                    <TextField
                        className='ServiceProvider'
                        value={cell.getValue()}
                        onChange={(e) => handleInputChange(e.target.value, row, 'MarketerName')}
                    />
                ),
            },
            {
                accessorKey: 'StartDate',
                header: 'Start Date',
                enableEditing: true,
                enableSorting: true,
                //filterVariant: 'date',
                filterFn: (row, columnId, filterValue) => {
                    const dateValue = row.getValue(columnId);
                    return dayjs(dateValue).format('MM/DD/YYYY').toLowerCase().includes(filterValue.toLowerCase());
                  //  return dayjs(dateValue).isSame(dayjs(filterValue), 'day');
                },
                Cell: ({ cell, row }) => {
                    const dateValue = cell.getValue();
                    const currentDate = dayjs();
                    const minDate = currentDate.subtract(3, 'month');
                    const maxDate = currentDate.add(3, 'month');
                    const marketerStartDate = dayjs(row.original.MarketerStartDate);

                    return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className='SelectedDate'
                                views={['year', 'month', 'day']}
                                value={dayjs(dateValue)}
                                onChange={(newValue) => handleInputChange(newValue.toISOString(), row, 'StartDate')}
                                minDate={marketerStartDate.isAfter(minDate) ? marketerStartDate : minDate}
                                maxDate={maxDate}
                                slotProps={{
                                    textField: (params) => <TextField {...params} />
                                }}
                            />
                        </LocalizationProvider>
                    );
                },
            },
            {
                accessorKey: 'ServiceProvider',
                header: 'Service Provider',
                enableEditing: true,
                enableSorting: true,
                Cell: ({ cell, row }) => (
                    <TextField
                        className='ServiceProvider'
                        type="number"
                        value={cell.getValue()}
                        onChange={(e) => handleInputChange(e.target.value, row, 'ServiceProvider')}
                        error={isNaN(cell.getValue())}
                        helperText={isNaN(cell.getValue()) ? "Only numeric values allowed" : ""}
                    />
                ),
            },
            {
                accessorKey: 'UETFileID',
                header: 'UET File Type',
                id: 'UETFileID',
                enableSorting: true,
                filterVariant: 'multi-select',
                filterSelectOptions: uetFiles,
                // filterFn: (row, columnId, filterValue) => {
                //     const rowValue = row.getValue(columnId);
                //     const selectedValues = rowValue.split(','); // Split the comma-separated values
                //     return selectedValues.some(value => filterValue.toLowerCase().includes(value.toLowerCase())); // Check if any selected value matches the filter value
                // },
                Cell: ({ row, column }) => {
                    const columnKey = column.id || column.accessorKey;
                    const selectedValues = row.original[columnKey]?.split(',') || [];
                    return (
                        <MultiSelectAutocomplete
                            options={uetFiles}
                            onChange={(newValue) => handleMultiSelectChange(newValue, row, columnKey)}
                            label="UET File Type"
                            value={selectedValues.join(',')}
                        />
                    );
                }
            }
        ];

        return baseColumns;
    }, [handleChange, uetFiles]);

    const handleAddEdit = (row) => {
        row.toggleExpanded();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableHiding: false,
        enableGlobalFilter: true,
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableRowActions: true,
        enableRowSelection: true,
        enableExpandAll: false,
        positionExpandColumn: 'first',
        positionActionsColumn: "last",
        positionToolbarAlertBanner: 'none',
        state: {
            rowSelection,
        },
        getRowId: (row) => row.UserId, // Ensure unique IDs for rows
        onRowSelectionChange: (newRowSelection) => {
            setRowSelection(newRowSelection); // Update row selection state
        },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10,//make the expand column wider
            }
        },
        initialState: {
            columnOrder: [
                'mrt-row-expand',
                'mrt-row-select',
                'PortalID',
                'MarketerName',
                'StartDate',
                'ServiceProvider',
                "UETFileID",
                'mrt-row-actions'
            ],
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
                        <IconButton onClick={handleRefresh} >
                            <Sync variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="Deactivate" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows?.length === 0}>
                            <PauseCircleOutline variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => {
            return (
                <div style={{ display: 'flex', gap: '0.5rem' }} className='tableicons'>
                    <IconButton onClick={() => handleOpenModal(row)} className='lock'>
                        {row.original.IsActive ? <PlayCircleOutline /> : <PauseCircleOutline />}
                    </IconButton>
                    {isModalOpen && <ModalPopup
                        header="Marketer"
                        message1={selectedRow?.original.IsActive ? "Are you sure you want to deactivate marketer?" : "Are you sure you want to activate marketers?"}
                        btnPrimaryText="Confirm"
                        btnSecondaryText="Cancel"
                        handlePrimaryClick={() => handleLockToggle(selectedRow)}
                        handleSecondaryClick={() => handleCloseModal()}
                    />
                    }
                </div>
            )
        },
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <MarketerDetails marketer={row.original} uetFileData={marketerData?.UETFileDate} />
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

export default MarketerList;