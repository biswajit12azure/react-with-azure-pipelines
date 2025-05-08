import React, { useCallback, useEffect, useMemo, useState,forwardRef } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { TextField , Box} from '@mui/material';
import dayjs from 'dayjs';

const CustomerUsageList = forwardRef(({ fromDate, toDate, data, handleChange,ref }) => {
  const [tableData, setTableData] = useState([]);
  const generateDateRange = useCallback((start, end) => {
    const dates = [];
    let current = dayjs(start);
    const last = dayjs(end);
    while (current.isBefore(last) || current.isSame(last)) {
      dates.push(current.format('DD/MM'));
      current = current.add(1, 'day');
    }
    return dates;
  }, []);

  const transformData = useCallback(() => {
    const usageData = data?.CustomerUsageData;
    if (!usageData) return { rows: [], columns: [] };
  
    const dateRange = generateDateRange(fromDate, toDate);
    const grouped = {};
  
    usageData.forEach(entry => {
      const date = dayjs(entry.ShipmentDate).format('DD/MM');
      if (!grouped[entry.AccountNumber]) {
        grouped[entry.AccountNumber] = { AccountNumber: entry.AccountNumber };
      }
      if (dateRange.includes(date)) {
        grouped[entry.AccountNumber][date] = entry.DailyUsage;
      }
    });
  
    const rows = Object.values(grouped).map(row => {
      dateRange.forEach(date => {
        if (row[date] === undefined) {
          row[date] = 0;
        }
      });
      return row;
    });
    const columns = [
      { header: 'Account Number', accessorKey: 'AccountNumber' },
      ...dateRange.map(date => ({
        accessorKey: date,
        header: date,
        Cell: ({ cell, row }) => (
          <TextField
            value={cell.getValue() ?? ''}
            onChange={e => handleChange(e.target.value, row.original, cell.column.id)}
            size="small"
          />
        ),
      }))
    ];
  
    return { rows, columns };
  }, [data, fromDate, toDate, generateDateRange, handleChange]);
  

  const { rows, columns } = useMemo(() => transformData(), [transformData]);

  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableSorting: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    layoutMode: 'grid-no-grow',
    initialState: {
      columnPinning: { left: ['AccountNumber'] },
      columnVisibility: { 'mrt-row-pin': false },
    },
    getRowId: row => row.AccountNumber,
    
  });

  return (
<Box id="table-container1" ref={ref}>
<MaterialReactTable table={table} id="table-container1" ref={ref}/>;
</Box>

  )
});

export default CustomerUsageList;
