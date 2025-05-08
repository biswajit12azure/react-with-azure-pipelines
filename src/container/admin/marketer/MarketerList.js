import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box,  TextField, Tooltip ,Typography } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline,FilterListOff} from '@mui/icons-material';
import { ModalPopup, MultiSelectMenu } from '_components';
import { MarketerDetails } from "container/admin";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MarketerList = ({ marketerData, rowSelection, handleChange,isActivate, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
    setRowSelection, handleToggleActiveStatus, handleRefresh }) => {

    const uetFiles = marketerData?.UETFileDate?.map(uet => ({ value: uet.UETFileID.toString(), label: uet.UETFileName })) || [];
    const data = marketerData?.Marketers || [];
    const [selectedRow, setSelectedRow] = useState(null);
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
    const [openRowId, setOpenRowId] = useState(null);
    const handleMultiSelectChange = (newValue, row, columnKey) => {
        handleChange(newValue, row.original, columnKey);
        setIsConfirmEnabled(true);
        console.log(isConfirmEnabled);
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
                Cell: ({ row }) => (
                    <span onClick={() => handleAddEdit(row)} >
                        {row.original.PortalID}
                    </span>
                ),
            },
            {
                accessorKey: 'MarketerName',
                header: 'Marketer Name',
                Cell: ({ cell, row }) => (
                    <TextField
                        className='ServiceProvider'
                        value={cell.getValue()}
                        onChange={(e) => handleInputChange(e.target.value, row, 'MarketerName')}
                    />
                ),
            },
            // {
            //     accessorKey: 'StartDate',
            //     header: 'Start Date',
            //     //filterVariant: 'date',
            //     filterFn: (row, columnId, filterValue) => {
            //         const dateValue = row.getValue(columnId);
            //         return dayjs(dateValue).format('MM/DD/YYYY').toLowerCase().includes(filterValue.toLowerCase());
            //       //  return dayjs(dateValue).isSame(dayjs(filterValue), 'day');
            //     },
            //     Cell: ({ cell, row }) => {
            //         const dateValue = cell.getValue();
            //         const currentDate = dayjs();
            //         const minDate = currentDate.subtract(3, 'month');
            //         const maxDate = currentDate.add(3, 'month');
            //         const marketerStartDate = dayjs(row.original.MarketerStartDate);

            //         return (
            //             <LocalizationProvider dateAdapter={AdapterDayjs}>
            //                 <DatePicker
            //                     className='SelectedDate'
            //                     views={['year', 'month', 'day']}
            //                     value={dayjs(dateValue)}
            //                     onChange={(newValue) => handleInputChange(newValue.toISOString(), row, 'StartDate')}
            //                     minDate={marketerStartDate.isAfter(minDate) ? marketerStartDate : minDate}
            //                     maxDate={maxDate}
            //                     slotProps={{
            //                         textField: (params) => <TextField {...params} />
            //                     }}
            //                 />
            //             </LocalizationProvider>
            //         );
            //     },
            // },
            {
                accessorKey: 'StartDate',
                header: 'Start Date',
                filterFn: (row, columnId, filterValue) => {
                    const dateValue = row.getValue(columnId);
                    return dayjs(dateValue).format('MM/DD/YYYY').toLowerCase().includes(filterValue.toLowerCase());
                },
                Cell: ({ cell, row }) => {
                    const dateValue = dayjs(cell.getValue());
                    const currentDate = dayjs().startOf('day'); // Ensure time portion does not affect comparison
                    const minDate = currentDate;
                    const maxDate = currentDate.add(3, 'month');
                    const marketerStartDate = dayjs(row.original.MarketerStartDate);
            
                    const isPastDate = dateValue.isBefore(currentDate, 'day'); // Check if StartDate is in the past
                    const effectiveMinDate = marketerStartDate.isAfter(minDate) ? marketerStartDate : minDate;
            
                    return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className='SelectedDate'
                                views={['year', 'month', 'day']}
                                value={dateValue}
                                onChange={(newValue) => handleInputChange(newValue?.toISOString(), row, 'StartDate')}
                                minDate={effectiveMinDate}
                                maxDate={maxDate}
                                disabled={isPastDate} // Disable if the StartDate is in the past
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
                //     return selectedValues.some(value => {
                //       const file = uetFiles.find(file => file.value === value);
                //       return file?.label.toLowerCase().includes(filterValue.toLowerCase());
                //     });
                // },
                Cell: ({ row, column }) => {
                    const columnKey = column.id || column.accessorKey;
                    const selectedValues = row.original[columnKey]?.split(',') || [];
                    return (
                        <Typography component="div" className='marbottom0 selecticon margintop10'>
                        <MultiSelectMenu
                            options={uetFiles}
                            onChange={(newValue) => handleMultiSelectChange(newValue, row, columnKey)}
                            label="UET File Type"
                            value={selectedValues.join(',')}
                            style={{
                                height: '48px'}}
                        />
                        </Typography>
                    );
                }
            }
        ];

        return baseColumns;
    }, [handleChange, uetFiles]);
    useEffect(() => {
        // Reset openRowId when new data is loaded
        setOpenRowId(null);
      }, [data]);
    const handleAddEdit = (row) => {
        if (openRowId === row.id) {
            setOpenRowId(null); 
            // Collapse if clicked again
          } else {
            
            setOpenRowId(row.id); // Expand the clicked row
            row.toggleExpanded(row.id); 
          }
        // row.toggleExpanded();
    };

    const table = useMaterialReactTable({
        columns,
        data,
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
        getRowId: (row) => row.UserId, // Ensure unique IDs for rows
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
                'PortalID',
                'MarketerName',
                'StartDate',
                'ServiceProvider',
                "UETFileID",
                'mrt-row-actions'
            ],
            sorting: [
                {
                  id: 'PortalID', 
                  desc: false, 
                },
                {
                  id: 'MarketerName', 
                  desc: false, 
                },
                {
                  id: 'StartDate', 
                  desc: false, 
                },
              {
                  id: 'ServiceProvider', 
                  desc: false, 
                },
              {
                  id: 'UETFileID', 
                  desc: false, 
                },
              
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
                <Tooltip title="Clear Filter" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleRefresh} >
                            <FilterListOff variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title={isActivate?"Deactivate":"Activate"} className='Deactivate'>
                    <div>
                        <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows?.length === 0}>
                           {isActivate ? <PauseCircleOutline variant="contained" color="secondary"/> : <PlayCircleOutline variant="contained" color="secondary"/> }
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => {
            return (
                <div  className='tableicons'>
                    <Tooltip title={row.original.IsActive ? "Deactivate" : "Activate" } arrow>
                    <IconButton onClick={() => handleOpenModal(row)} className='lock'>
                        {row.original.IsActive ?<PauseCircleOutline /> : <PlayCircleOutline /> }
                    </IconButton>
                    </Tooltip>
                    {isModalOpen && <ModalPopup
                        header="Marketer"
                        message1={selectedRow?.original.IsActive ? "Are you sure you want to deactivate marketer?" : "Are you sure you want to activate marketer?"}
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
            openRowId === row.id && (  <Box sx={{ padding: 2 }}>
                <MarketerDetails marketer={row.original} uetFileData={marketerData?.UETFileDate} />
            </Box>
            )
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