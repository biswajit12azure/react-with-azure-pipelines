import React from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Paper, Box, Typography } from '@mui/material';

const SupplierActiveCustomerList = ({ data,ref }) => {
  const supplierData = data?.supplierActiveCustomerReport || [];

  const columns = [
    {
      header: 'Serv. Prov.',
      accessorKey: 'ServiceProvider',
    },
    {
      header: 'Rate cat.',
      accessorKey: 'RateCategory',
    },
    {
      header: 'BCIss',
      accessorKey: 'BCIss',
    },
    {
      header: 'Contract',
      accessorKey: 'Contract',
    },
    {
      header: 'Cont. Account',
      accessorKey: 'ContAccount',
    },
    {
      header: 'M/I Date',
      accessorKey: 'MIDate',
    },
    {
      header: 'M/O Date',
      accessorKey: 'MODate',
    },
    {
      header: 'Valid to',
      accessorKey: 'ValidTo',
    },
    {
      header: 'Portion',
      accessorKey: 'Portion',
    },
    {
      header: 'S. Type',
      accessorKey: 'SType',
    },
    {
      header: 'Low Income',
      accessorKey: 'LowIncome',
      Cell: ({ cell }) => cell.getValue() ?? 'N/A',
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: supplierData,

    enableSorting: true,
    enableColumnFilters: false,
    enableGlobalFilter: false,

    enablePagination: true,
    enableExpanding: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableDensityToggle: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#1976d2',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'left',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        textAlign: 'left',
      },
    },

    displayColumnDefOptions: {
      'mrt-row-numbers': {
        header: '#',
      },
    },

    initialState: {
      pageIndex: 0,
      pageSize: 5,
    },
    muiTablePaginationProps: {
      rowsPerPageOptions: [5, 10, 25],
      showFirstButton: true,
      showLastButton: true,
    },

    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          height: '70px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No results found for the provided search criteria.
        </Typography>
      </Box>
    ),
  });

  return (
    <Box id="table-container" ref={ref}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default SupplierActiveCustomerList;
