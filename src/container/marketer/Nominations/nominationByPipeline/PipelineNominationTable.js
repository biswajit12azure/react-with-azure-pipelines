import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { Lock, LockOpen, Sync, FilterListOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Checkbox, Paper } from '@mui/material';
import { Delete, Deletewhite } from 'images';
import { ModalPopup } from '_components';
import { alertActions } from '_store';
import { useDispatch } from 'react-redux';

const PipelineNominationList = ({ data = [], fromDate, toDate, selectedRows, setSelectedRows, handleChange, handleDelete, handleRefresh, handleToggleActiveStatus, isModalOpen, setIsModalOpen, rowSelection, setRowSelection }) => {
  const dispatch = useDispatch();
  const header = "Nomination By Pipeline";

  const generateDateRange = useCallback((start, end) => {
    const dates = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      dates.push(currentDate.format('DD/MM'));
      currentDate = currentDate.add(1, 'day');
    }
    return dates;
  }, []);

  const transformData = useCallback((data) => {
    if (!data || !data.NominationData || !data.NominationData.ContractData) {
      return { transformed: [], columns: [] };
    }

    const transformed = [];
    const dateRange = generateDateRange(fromDate, toDate);

    data.NominationData.ContractData.forEach(contract => {
      const row = { ContractID: contract.ContractID, isTotal: false };
      dateRange.forEach(date => {
        row[date] = 0; // Initialize with empty string
      });
      contract.ContractDetails.forEach(detail => {
        const date = dayjs(detail.ContractDate).format('DD/MM');
        if (row.hasOwnProperty(date)) {
          row[date] = detail.ContractValue;
        }
      });
      transformed.push(row);
    });

    const columns = [
      { header: 'Contracts', accessorKey: 'ContractID', id: 'ContractID' },
      ...dateRange.map(date => ({
        accessorKey: date,
        header: date,
        id: date,
        Cell: ({ cell, row }) => (
          <TextField
            type="number"
            className={`ServiceProvider ${row.original?.isTotal ? 'total-row-textbox' : ''}`}
            value={cell.getValue() || ''}
            onChange={(e) => handleChange(e.target.value, row.original, cell.column.id)}
            disabled={row.original?.isTotal}
          />
        ),
      }))
    ];

    return { transformed, columns };
  }, [fromDate, toDate, generateDateRange, handleChange]);

  const extractTotals = (totalData, dateRange) => {
    const totals = { ContractID: totalData?.ContractName, isTotal: true };
    totalData?.ContractDetails.forEach(detail => {
      const date = dayjs(detail.ContractDate).format('DD/MM');
      if (dateRange.includes(date)) {
        totals[date] = detail.ContractValue;
      }
    });
    return totals;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRows([]);
    setRowSelection({});
  };

  const handleRowDelete = async (row) => {
    try {
      dispatch(alertActions.clear());
      await handleDelete(row);
      setIsModalOpen(false);
      setSelectedRows([]);
      setRowSelection({});
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const { transformed, columns } = useMemo(() => transformData(data), [data, transformData]);
  const dateRange = useMemo(() => generateDateRange(fromDate, toDate), [fromDate, toDate, generateDateRange]);

  const totalPipeline = useMemo(() => extractTotals(data.NominationData?.TotalPipelineData, dateRange), [data, dateRange]);
  const totalAllPipeline = useMemo(() => extractTotals(data.NominationData?.TotalAllPipelineData, dateRange), [data, dateRange]);
  const totalGroup = useMemo(() => extractTotals(data.NominationData?.TotalGroupData, dateRange), [data, dateRange]);

  const [tableData, setTableData] = useState([...transformed]);

  useEffect(() => {
    setTableData([...transformed]);
  }, [transformed]);

  const handleRowSelect = (row) => {
    const isSelected = selectedRows.includes(row);
    const newSelectedRows = isSelected ? selectedRows.filter(r => r !== row) : [...selectedRows, row];
    setSelectedRows(newSelectedRows);
  };

  const scrollDates = (direction) => {
    const container = document.querySelector('.date-container');
    if (direction === 'left') {
      container.scrollBy({ left: -100, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" style={{ position: 'sticky', left: 0, zIndex: 1, background: 'white' }}>
              <Checkbox
                indeterminate={selectedRows.length > 0 && selectedRows.length < tableData.length}
                checked={tableData.length > 0 && selectedRows.length === tableData.length}
                onChange={(e) => setSelectedRows(e.target.checked ? tableData : [])}
              />
            </TableCell>
            <TableCell style={{ position: 'sticky', left: 50, zIndex: 1, background: 'white' }}>Contracts</TableCell>
            <TableCell colSpan={dateRange.length} className="date-container" style={{ overflowX: 'auto', display: 'flex' }}>
              <IconButton onClick={() => scrollDates('left')}>{"<"}</IconButton>
              {columns.slice(1).map(column => (
                <TableCell key={column.id} style={{ minWidth: '100px' }}>{column.header}</TableCell>
              ))}
              <IconButton onClick={() => scrollDates('right')}>{">"}</IconButton>
            </TableCell>
            <TableCell style={{ position: 'sticky', right: 0, zIndex: 1, background: 'white' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index} selected={selectedRows.includes(row)}>
              <TableCell padding="checkbox" style={{ position: 'sticky', left: 0, zIndex: 1, background: 'white' }}>
                <Checkbox
                  checked={selectedRows.includes(row)}
                  onChange={() => handleRowSelect(row)}
                  disabled={row?.isTotal}
                />
              </TableCell>
              <TableCell style={{ position: 'sticky', left: 50, zIndex: 1, background: 'white' }}>{row.ContractID}</TableCell>
              <TableCell colSpan={dateRange.length} className="date-container" style={{ overflowX: 'auto', display: 'flex' }}>
                {columns.slice(1).map(column => (
                  <TableCell key={column.id} style={{ minWidth: '100px' }}>
                    {column.Cell ? column.Cell({ cell: { getValue: () => row[column.accessorKey] }, row }) : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableCell>
              {!row?.isTotal && (
                <TableCell>
                  <IconButton className='delete' onClick={handleOpenModal}>
                    <img src={Delete} alt="Delete" />
                  </IconButton>
                  {isModalOpen && (
                    <ModalPopup
                      header={header}
                      message1="Are you sure you want to delete this contract?"
                      btnPrimaryText="Confirm"
                      btnSecondaryText="Cancel"
                      handlePrimaryClick={() => handleRowDelete(row)}
                      handleSecondaryClick={handleCloseModal}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell style={{ position: 'sticky', left: 50, zIndex: 1, background: 'white' }}>{totalPipeline['ContractID']}</TableCell>
            <TableCell colSpan={dateRange.length} className="date-container" style={{ overflowX: 'auto', display: 'flex' }}>
              {columns.slice(1).map(column => (
                <TableCell key={column.id}>
                  {totalPipeline[column.accessorKey] || ''}
                </TableCell>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell style={{ position: 'sticky', left: 50, zIndex: 1, background: 'white' }}>{totalAllPipeline['ContractID']}</TableCell>
            <TableCell colSpan={dateRange.length} className="date-container" style={{ overflowX: 'auto', display: 'flex' }}>
              {columns.slice(1).map(column => (
                <TableCell key={column.id}>
                  {totalAllPipeline[column.accessorKey] || ''}
                </TableCell>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell style={{ position: 'sticky', left: 50, zIndex: 1, background: 'white' }}>{totalGroup['ContractID']}</TableCell>
            <TableCell colSpan={dateRange.length} className="date-container" style={{ overflowX: 'auto', display: 'flex' }}>
              {columns.slice(1).map(column => (
                <TableCell key={column.id}>
                  {totalGroup[column.accessorKey] || ''}
                </TableCell>
              ))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Tooltip title="Clear filter" className='Deactivate'>
          <div>
            <IconButton onClick={handleRefresh}>
              <FilterListOff variant="contained" color="secondary" />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title="Delete Selected" className='DeleteSelected'>
          <div>
            <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows.length === 0}>
              <img src={Deletewhite} alt="Delete" />
            </IconButton>
          </div>
        </Tooltip>
      </Box>
    </TableContainer>
  );
};

export default PipelineNominationList;