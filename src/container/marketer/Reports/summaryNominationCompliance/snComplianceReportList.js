import React from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Paper, Box, Typography } from '@mui/material';

const SNComplianceReportList = ({ data }) => {
  console.log("data", data);

  const columns = [
    {
      header: 'Marketer',
      accessorKey: 'CompanyName',
      enableSorting: true,
    },
    {
      header: 'Marketer Group',
      accessorKey: 'AllocationGroup',
      enableSorting: true,
    },
    {
      header: 'Nominations by Group',
      accessorKey: 'TotalNominationAllocations',
      enableSorting: true,
    },
    {
      header: 'Forecast DRV',
      accessorKey: 'DailyRequiredVolume',
      enableSorting: true,
    },
    {
      header: 'Actual DRV',
      accessorKey: 'TotalUsage',
      enableSorting: true,
    },
    {
      header: 'Forecast Imbalance',
      accessorKey: 'TotalForecastImbal',
      enableSorting: true,
    },
    {
      header: 'Penalty',
      accessorKey: 'Penalty',
      enableSorting: true,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,

    enableSorting: true,
    enableColumnFilters: false,
    enableColumnFilterRow: false,
    enableGlobalFilter: false,
    enableColumnFilterModes: true,
    enableFilterMatchHighlighting: false,

    enablePagination: true,
    enableExpanding: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableDensityToggle: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#fff',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        textAlign: 'left',
      },
    },

    
    muiTableBodyRowProps: ({ row }) => {
      const { AllocationGroup, customCategory } = row.original || {};
      const isFixedTotal =
        customCategory === 'Fixed Total' &&
        ['Total FIRM', 'Total Interruptible', 'Grand Total'].includes(AllocationGroup);

      return {
        onClick: isFixedTotal ? undefined : () => {}, 
        sx: {
          fontWeight: row.original?.isTotal ? 'bold' : 'normal',
          backgroundColor: isFixedTotal ? '#0F3557' : 'inherit',
          color: isFixedTotal ? '#FFFFFF' : 'inherit',
          pointerEvents: isFixedTotal ? 'none' : 'auto',
          '&:hover': {
            backgroundColor: 'inherit',
            cursor: 'default',
          },
        },
      };
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
      rowsPerPageOptions: [5, 10, 25, 50],
      showFirstButton: true,
      showLastButton: true,
    },

   
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80px',
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No results found for the provided search criteria.
        </Typography>
      </Box>
    ),
  });

  return (
    <Paper>
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default SNComplianceReportList;
