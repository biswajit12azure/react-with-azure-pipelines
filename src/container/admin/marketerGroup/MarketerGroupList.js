import React, { useState, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { FilterListOff } from '@mui/icons-material';
import { ModalPopup } from '_components';
import { Delete, Deletewhite } from 'images';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MarketerGroupDetails from './MarketerGroupDetails';
import BalancingModel from './BalancingModel';
import { alertActions } from '_store';
import { useDispatch } from 'react-redux';

const MarketerGroupList = ({
    marketerGroupData,
    rowSelection,
    handleChange,
    isModalOpen,
    setIsModalOpen,
    selectedRows,
    setSelectedRows,
    setRowSelection,
    handleDelete,
    handleToggleActiveStatus,
    handleRefresh
}) => {
    const dispatch = useDispatch();
    const header = " Marketer Group";

    // Ensure stable data reference to avoid re-renders
    const data = useMemo(() => marketerGroupData?.MarketerGroups || [], [marketerGroupData?.MarketerGroups]);
    const marketerDate = marketerGroupData?.MarketerStartDate || new Date();
    const interruptibleBalancingModel = useMemo(() => marketerGroupData?.BalancingModel?.map(bal => ({
        value: bal.BalancingModelID,
        label: bal.BalancingModelName
    })) || [], [marketerGroupData?.BalancingModel]);

    const allBalancingModel = useMemo(() => [
        ...interruptibleBalancingModel,
        { value: 4, label: "Storage Balancing" }
    ], [interruptibleBalancingModel]);

    const [selectedRow, setSelectedRow] = useState(null);

    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleRowDelete = async (row) => {
        dispatch(alertActions.clear());
        await handleDelete(row);
        setIsModalOpen(false);
        setSelectedRows([]);
        setRowSelection({});
        dispatch(alertActions.success({ message: "Marketer group deleted successfully", header }));
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'GroupName',
            header: 'Group Name',
            Cell: ({ cell, row }) => (
                <TextField
                    className='ServiceProvider'
                    value={cell.getValue()}
                    onChange={(e) => handleChange(e.target.value, row.original, 'GroupName')}
                    onClick={() => handleAddEdit(row)}
                />
            ),
        },
        {
            accessorKey: 'GroupType',
            header: 'Group Type',
        },
        {
            accessorKey: 'JurisdictionName',
            header: 'Jurisdiction',
        },
        {
            accessorKey: 'StartMonth',
            header: 'Start Month',
            filterFn: (row, columnId, filterValue) => {
                const dateValue = row.getValue(columnId);
                return dayjs(dateValue).format('MMMM YYYY').toLowerCase().includes(filterValue.toLowerCase());
            },
            Cell: ({ cell, row }) => {
                const dateValue = cell.getValue();
                const currentDate = dayjs();
                const minDate = currentDate.subtract(3, 'month');
                const maxDate = currentDate.add(3, 'month');
                const marketerStartDate = dayjs(marketerDate);
                const isDisabled = dayjs(dateValue).isBefore(currentDate, 'month') || dayjs(dateValue).isSame(currentDate, 'month');

                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='SelectedDate '
                            views={['year', 'month']}
                            value={dayjs(dateValue)}
                            inputFormat="MMM yyyy"
                            onChange={(newValue) => handleChange(newValue.toISOString(), row.original, 'StartMonth')}
                            minDate={marketerStartDate.isAfter(minDate) ? marketerStartDate : minDate}
                            maxDate={maxDate}
                            disabled={isDisabled}
                            slotProps={{
                                textField: (params) => <TextField {...params} />
                            }}
                        />
                    </LocalizationProvider>
                );
            },
        },
        {
            accessorKey: 'EndMonth',
            header: 'End Month',
            filterFn: (row, columnId, filterValue) => {
                const dateValue = row.getValue(columnId);
                return dayjs(dateValue).format('MMMM YYYY').toLowerCase().includes(filterValue.toLowerCase());
            },
            Cell: ({ cell, row }) => {
                const dateValue = cell.getValue();
                const startMonth = dayjs(row.original.StartMonth);
                const currentDate = dayjs();
                const minDate = startMonth.isAfter(currentDate) ? startMonth : currentDate;
                const maxDate = currentDate.add(4, 'month');

                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='SelectedDate '
                            views={['year', 'month']}
                            value={dayjs(dateValue)}
                            inputFormat="MMM yyyy"
                            onChange={(newValue) => {
                                if (newValue.isAfter(startMonth)) {
                                    handleChange(newValue.toISOString(), row.original, 'EndMonth');
                                }
                            }}
                            minDate={minDate}
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
            accessorKey: 'BalancingModelID',
            header: 'Balancing Model',
            filterFn: (row, columnId, filterValue) => {
                const balancingModelID = row.getValue(columnId);
                const model = allBalancingModel.find(m => m.value === balancingModelID);
                return model?.label?.toLowerCase().includes(filterValue.toLowerCase()) || false;
            },
            Cell: ({ row, column }) => {
                const columnKey = column.id || column.accessorKey;
                const isFirm = row.original.GroupType?.toLowerCase() === "firm";
                const options = isFirm ? [{ value: 4, label: "Storage Balancing" }] : interruptibleBalancingModel;
                const defaultValue = isFirm ? 4 : row.original.BalancingModelID;

                return (
                    <BalancingModel
                        marketerGroupID={row.original.ID}
                        value={defaultValue}
                        label={`Select ${column.columnDef.header}`}
                        onChange={(value) => handleChange(value, row.original, columnKey)}
                        options={options}
                        handleRefresh={handleRefresh}
                    />
                );
            },
        },
    ], [handleChange, interruptibleBalancingModel, allBalancingModel, marketerDate]);

    const handleAddEdit = (row) => {
        row.toggleExpanded();
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
        positionExpandColumn: 'first',
        positionActionsColumn: "last",
        positionToolbarAlertBanner: 'none',
        autoResetPageIndex: false,
        getRowId: (row) => row.ID, // ✅ Stable unique ID
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10,
                muiTableHeadCellProps: { sx: { display: 'none' } },
                muiTableBodyCellProps: { sx: { display: 'none' } },
            },
        },
        initialState: {
            columnOrder: [
                'mrt-row-select',
                'GroupName',
                'GroupType',
                'JurisdictionName',
                'StartMonth',
                'EndMonth',
                'BalancingModelID',
                'mrt-row-actions'
            ],
            sorting: [],
        },
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <Tooltip title="Clear Filter" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleRefresh}>
                            <FilterListOff variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="Delete Selected" className='DeleteSelected'>
                    <div>
                        <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows?.length === 0}>
                            <img src={Deletewhite} alt="Delete" />
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => (
            <div className='tableicons'>
                <IconButton className='delete'>
                    <img src={Delete} alt="Delete" onClick={() => handleOpenModal(row.original)} />
                </IconButton>
                {isModalOpen && selectedRow?.ID === row.original.ID && (
                    <ModalPopup
                        header={header}
                        message1="Are you sure, you want to delete this marketer group?"
                        btnPrimaryText="Confirm"
                        btnSecondaryText="Cancel"
                        handlePrimaryClick={() => handleRowDelete(row.original)}
                        handleSecondaryClick={handleCloseModal}
                    />
                )}
            </div>
        ),
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <MarketerGroupDetails marketerGroup={row.original} balancingModels={allBalancingModel} />
            </Box>
        ),
        muiExpandButtonProps: { sx: { display: 'none' } },
    });

    // ✅ Preserve selected row data on render
    useMemo(() => {
        const selectedFlatRows = table.getSelectedRowModel().flatRows;
        setSelectedRows(selectedFlatRows.map((row) => row.original));
    }, [table.getSelectedRowModel().flatRows, setSelectedRows]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
        </LocalizationProvider>
    );
};

export default MarketerGroupList;
