import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const InterruptibleList_old = ({ data, handleChange }) => {
  const handleInputChange = (group, value) => {
    handleChange(group, value);
  };

  const columns = useMemo(() => [
    { accessorKey: 'AllocationGroup', header: 'GROUP', enableColumnFilter: false },
    { accessorKey: 'PreviousBalanceInterruptible', header: 'IMBALANCE - FOM', enableColumnFilter: false },
    { accessorKey: 'TotalNominationAllocations', header: 'NOMINATIONS', enableColumnFilter: false },
    { accessorKey: 'TotalUsage', header: 'USAGE', enableColumnFilter: false },
    {
      accessorKey: "ImbalanceAdjustedVolume",
      header: "ADJUSTMENT",
      Cell: ({ row }) => (
        !row.original.isGroupHeader && (
          <Box>
            <TextField
              variant="standard"
              value={row.original.ImbalanceAdjustedVolume || ''}
              onChange={(e) => handleInputChange(row, e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>
        )
      )
    },
    { accessorKey: 'DailyRequiredVolume', header: 'DRV', enableColumnFilter: false },
    { accessorKey: 'MonthEndImbalanceInterruptible', header: 'IMBALANCE - EOM', enableColumnFilter: false },
    { accessorKey: 'ThresholdValue', header: '±15% TOLERANCE', enableColumnFilter: false },
    { accessorKey: 'OutsideThresholdAmount', header: '>15% TOLERANCE', enableColumnFilter: false },
  ], []);

  const groupedData = useMemo(() => {
    const marketers = {};
    data?.InterruptibleData?.forEach(item => {
      if (!marketers[item.CompanyID]) {
        marketers[item.CompanyID] = {
          CompanyName: item.CompanyName,
          groups: [{AllocationGroupID:item.CompanyID,AllocationGroup:item.CompanyName,isGroupHeader:true}]
        };
      }
      marketers[item.CompanyID].groups.push(item);
    });
    return Object.values(marketers);
  }, [data]);

  const tableData = useMemo(() => {
    const marketers = {};
    
    data?.InterruptibleData?.forEach(item => {
      if (!marketers[item.CompanyID]) {
        marketers[item.CompanyID] = {
          CompanyName: item.CompanyName,
          groups: [{
            AllocationGroupID: item.CompanyID,
            AllocationGroup: item.CompanyName,
            isGroupHeader: true
          }]
        };
      }
      marketers[item.CompanyID].groups.push({ ...item, isGroupHeader: false });
    });
  
    return Object.values(marketers).flatMap(marketer => marketer.groups);
  }, [data]);


  // return (
  //   <div>
  //     <TableContainer sx={{ maxHeight: '400px' }}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             {columns.map((column) => (
  //               <TableCell
  //                 key={column.accessorKey}
  //                 sx={{
  //                   fontWeight: "bold",
  //                   color: "#0B254B",
  //                   textAlign: "left",
  //                 }}
  //               >
  //                 {column.header}
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {groupedData.map((marketer, marketerIndex) => (
  //             <React.Fragment key={marketerIndex}>
  //               <TableRow key={`marketer-${marketerIndex}`}>
  //                 <TableCell colSpan={columns.length} variant="head" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
  //                   {marketer.CompanyName}
  //                 </TableCell>
  //               </TableRow>
  //               {marketer.groups.map((group, groupIndex) => (
  //                 <TableRow key={groupIndex}>
  //                   {columns.map((column) => (
  //                     <TableCell
  //                       key={column.accessorKey}
  //                       sx={{ borderBottom: "none" }}
  //                     >
  //                       {column.accessorKey === "ImbalanceAdjustedVolume" ? (
  //                         <TextField
  //                           variant="standard"
  //                           value={group[column.accessorKey] || ''}
  //                           onChange={(e) =>
  //                             handleInputChange(group, e.target.value)
  //                           }
  //                           InputProps={{
  //                             disableUnderline: true,
  //                           }}
  //                         />
  //                       ) : (
  //                         group[column.accessorKey]
  //                       )}
  //                     </TableCell>
  //                   ))}
  //                 </TableRow>
  //               ))}
  //             </React.Fragment>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </div>
  // );
    const table = useMaterialReactTable({
      columns,
      data: tableData,
      enableSorting: false,
      enableColumnFilters: false,
      columnFilterDisplayMode: 'popover',
      enablePagination: false,
      enableHiding: false,
      enableRowActions: false,
      enableStickyHeader: true,
      enableGlobalFilter: false,
      enableColumnActions: false,
      enableDensityToggle: false,
      enableFullScreenToggle: false,

      getRowId: (originalRow) => originalRow?.AllocationGroupID?.toString(),

      muiTableContainerProps: {
        sx: {
          maxHeight: '400px',
        },
      },

        muiTableBodyCellEditTextFieldProps: ({ row, column }) =>
        row.original.isGroupHeader
          ? column.accessorKey === "AllocationGroup"
            ? {} // Show textbox only for "Value" column in group header
            : { sx: { display: "none" } } // Hide other columns in group header
          : { sx: { display: "none" } },
  
          muiTableBodyCellProps: ({ cell, row, table }) => {
            if (row.original.isGroupHeader) {
              const totalColumns = table.getAllColumns().length; // Get total column count
          
              return {
                colSpan: cell.column.id === "AllocationGroup" ? totalColumns : 0, // Span all columns or hide
                sx: cell.column.id === "AllocationGroup"
                  ? {
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textAlign: "center",
                      backgroundColor: "#f5f5f5", // Optional: Highlight the row
                      width: "150%", // Ensure full width
                    }
                  : { display: "none" }, // Hide unwanted columns
              };
            }
          },
          
          
    });
  
    return (
      <div>
        <MaterialReactTable table={table} />
      </div>
    );
  };

export default InterruptibleList_old;