import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import { Lock, LockOpen, Sync, FilterListOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Tooltip, TextField } from '@mui/material';
import { Delete, Deletewhite } from 'images';
import { LoadingOverlay, ModalPopup } from '_components';
import { alertActions } from '_store';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

const PipelineNominationList = ({ data = [],setData,setIsDataChanged, fromDate, toDate, selectedRows, setSelectedRows,
  handleChange, handleDelete, handleClearFilter, handleToggleActiveStatus, isModalOpen, setIsModalOpen,
  rowSelection, setRowSelection, pipelineID }) => {
  const tableContainerRef = useRef(null);
  const dispatch = useDispatch();
  const header = "Nomination By Pipeline";  
  const [tableData, setTableData] = useState([]);
  const [pinnedRow, setPinnedRow] = useState([]);
  const [localData, setLocalData] = useState({});

  const pipelineName = useMemo(() => data?.PipelineData?.find(p => p.PipelineID === pipelineID)?.Name, [data, pipelineID]);

  const generateDateRange = useCallback((start, end) => {
    const dates = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      dates.push(currentDate.format('MM/DD/YYYY'));
      currentDate = currentDate.add(1, 'day');
    }
    return dates;
  }, []);

  const transformData = useCallback((data) => {
    const transformed = [];
    const dateRange = generateDateRange(fromDate, toDate);
    if (!data || !data.NominationData || !data.NominationData.ContractData) {
      const row = { ContractID: "dummy", isTotal: false };
      dateRange.forEach(date => {
        row[date] = 0;
      });
      transformed.push(row);
    } else {
      data.NominationData?.ContractData.forEach(contract => {
        const row = { ContractID: contract.ContractID.toString(), isTotal: false };
        dateRange.forEach(date => {
          row[date] = 0;
        });
        contract.ContractDetails.forEach(detail => {
          const date = dayjs(detail.ContractDate).format('DD/MM');
          if (row.hasOwnProperty(date)) {
            row[date] = detail.ContractValue;
          }
        });
        transformed.push(row);
      });
    }
    const columns = [
      { header: 'Contracts', accessorKey: 'ContractID', id: 'ContractID' },
      ...dateRange.map(date => ({
        accessorKey: date,
        header: date,
        id: date,
        Cell: ({ cell, row }) => (
          <TextField
            className="ServiceProvider"
            value={localData[row.original.ContractID]?.[date] || cell.getValue() || ''}
            onChange={(e) => handleLocalChange(e.target.value, row.original, cell.column.id)}
            disabled={row.original.isTotal}
          />
        ),
      }))
    ];

    return { transformed, columns };
  }, [fromDate, toDate, generateDateRange, localData]);

  const extractTotals = useCallback((rowvalue, totalData, dateRange) => {
    if (!totalData) return null;
    const totals = { ContractID: totalData?.ContractName.toString(), isTotal: true, className: 'sticky-row' };
    totalData?.ContractDetails.forEach(detail => {
      const date = dayjs(detail.ContractDate).format('DD/MM');
      if (dateRange.includes(date)) {
        totals[date] = detail.ContractValue;
      }
    });
    return totals;
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRows([]);
    setRowSelection({});
  }, [setIsModalOpen, setSelectedRows, setRowSelection]);

  const handleRowDelete = useCallback(async (row) => {
    try {
      dispatch(alertActions.clear());
      await handleDelete(row);
      setIsModalOpen(false);
      setSelectedRows([]);
      setRowSelection({});
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  }, [dispatch, handleDelete, setIsModalOpen, setSelectedRows, setRowSelection]);

  const handleLocalChange = (newValue, rowData, columnId) => {
    setLocalData(prevLocalData => ({
      ...prevLocalData,
      [rowData.ContractID]: {
        ...prevLocalData[rowData.ContractID],
        [columnId]: newValue
      }
    }));
    debouncedHandleChange(newValue, rowData, columnId);
  };

  const debouncedHandleChange = useCallback(debounce((newValue, rowData, columnId) => {
    setData(prevData => {
      const updatedContractData = prevData.NominationData.ContractData.map(contract => {
        if (contract.ContractID.toString() === rowData.ContractID) {
          const date = dayjs(columnId, 'DD/MM').format('YYYY-MM-DD');
          const newContractDetails = contract.ContractDetails.map(detail => {
            if (dayjs(detail.ContractDate).format('YYYY-MM-DD') === date) {
              return { ...detail, ContractValue: newValue };
            }
            return detail;
          });

          // If the date was not found, add a new detail
          if (!newContractDetails.some(detail => dayjs(detail.ContractDate).format('YYYY-MM-DD') === date)) {
            newContractDetails.push({ ContractDate: date, ContractValue: newValue });
          }

          return { ...contract, ContractDetails: newContractDetails, isEditing: true };
        }
        return contract;
      });

      return {
        ...prevData,
        NominationData: {
          ...prevData.NominationData,
          ContractData: updatedContractData,
        },
      };
    });
    setIsDataChanged(true);
  }, 300), [setData]);

  const { transformed, columns } = useMemo(() => transformData(data), [data, transformData]);
  const dateRange = useMemo(() => generateDateRange(fromDate, toDate), [fromDate, toDate, generateDateRange]);

  const totalPipeline = useMemo(() => extractTotals('Pipeline', data.NominationData?.TotalPipelineData, dateRange), [data, dateRange, extractTotals]);
  const totalAllPipeline = useMemo(() => extractTotals('AllPipeline', data.NominationData?.TotalAllPipelineData, dateRange), [data, dateRange, extractTotals]);
  const totalGroup = useMemo(() => extractTotals('Group', data.NominationData?.TotalGroupData, dateRange), [data, dateRange, extractTotals]);

  const getTransformedData = useCallback(() => {
    let newData = [];
    if (data && data?.NominationData && data?.NominationData?.ContractData) {
      newData = [...transformed, totalPipeline, totalAllPipeline, totalGroup];
    } else {
      newData = [...transformed];
    }
    return newData;
  }, [data, transformed, totalPipeline, totalAllPipeline, totalGroup]);

  useEffect(() => {
    const setdata = async () => {
      const newTableData = getTransformedData();
      await setTableData(newTableData);
      const pinnedRows = newTableData ? newTableData.filter(row => row?.isTotal && row.ContractID !== "dummy").map(row => row.ContractID) : [];
      await setPinnedRow(pinnedRows);
      }
      setdata();
  }, [getTransformedData]);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableHiding: false,
    enableSorting: false,
    enableColumnFilters: false,
    columnFilterDisplayMode: 'popover',
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enablePagination: false,
    enableRowActions: true,
    enableStickyHeader: true,
    positionExpandColumn: 'first',
    positionActionsColumn: 'last',
    positionToolbarAlertBanner: 'none',
    layoutMode: 'grid-no-grow',
    initialState: {
      columnPinning: { left: ['mrt-row-select', 'ContractID'], right: ['mrt-row-actions'] },
      columnVisibility: { 'mrt-row-pin': false },
    },
    state: {
      rowSelection,
    },
    getRowId: (originalRow) => originalRow?.ContractID?.toString(),
    enableRowPinning: true,
    rowPinningDisplayMode: 'sticky',
    muiTableContainerProps: {
      sx: {
        maxHeight: '400px',
      },
    },
    muiTableBodyProps: {
      sx: {
        display: tableData && tableData?.find(t => t.ContractID === "dummy") ? 'flex' : 'table-row-group',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontSize: '1.5rem',
        color: 'gray',
      },
      children: tableData && tableData?.find(t => t.ContractID === "dummy") ? (
        <tr>
          <td colSpan={columns.length} style={{ textAlign: 'center' }}>
            No data to display
          </td>
        </tr>
      ) : null,
    },
    muiTableBodyRowProps: ({ row, table }) => {
      const { density } = table.getState();
      return {
        sx: {
          height: row.getIsPinned()
            ? `${density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69}px`
            : undefined,
        },
      };
    },
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection);
    },
    enableRowSelection: (row) => !row.original?.isTotal, // Disable row selection for total rows
    renderRowActions: ({ row }) => (
      !row.original?.isTotal && (
        <div   className='tableicons'>
          <IconButton className='delete' onClick={handleOpenModal}>
            <img src={Delete} alt="Delete" />
          </IconButton>
          {isModalOpen && (
            <ModalPopup
              header={header}
              message1="Are you sure you want to delete this contract?"
              btnPrimaryText="Confirm"
              btnSecondaryText="Cancel"
              handlePrimaryClick={() => handleRowDelete(row.original)}
              handleSecondaryClick={handleCloseModal}
            />
          )}
        </div>
      )
    ),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Tooltip title="Clear filter" className='Deactivate'>
          <div>
            <IconButton onClick={handleClearFilter}>
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
  });

  useEffect(() => {
    const selectedFlatRows = table.getSelectedRowModel().flatRows;
    setSelectedRows(selectedFlatRows.map((row) => row.original));
  }, [rowSelection, table]);
  
  useEffect(() => {
    if(pinnedRow){
    table.setRowPinning({
      top: pinnedRow,
    });
    console.log('tablepinnedrow',pinnedRow);
  }
  }, [pinnedRow]);

  return (
    <>
      <div ref={tableContainerRef}> {/* Set fixed height */}
        {tableData.length === 0 ? (
          <LoadingOverlay loading={true} />
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>
    </>
  );
};

export default PipelineNominationList;