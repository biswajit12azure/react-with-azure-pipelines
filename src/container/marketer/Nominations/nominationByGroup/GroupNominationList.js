import React, { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography,TextField, IconButton,Box, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FilterListOff } from '@mui/icons-material';

const GroupNominationList = ({fromDate, toDate , data,handleChange,clearFilter}) => {
  const tableContainerRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [pinnedRow, setPinnedRow] = useState([]);
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
    if (!data || !data.GroupData || !data.GroupData.GroupData1) {
      const row = { GroupID: "dummy", isTotal: false };
      dateRange.forEach(date => {
        row[date] = 0; // Initialize with empty string
      });
      transformed.push(row);
      console.log(transformed);
    } else {
      data.GroupData?.GroupData1?.forEach(contract => {
        const GroupHeaderRow = { GroupID: contract?.GroupID,GroupName:contract?.GroupName.toString() || '', isGroupHeader: true, isTotal: false };
        transformed.push(GroupHeaderRow);
        console.log(GroupHeaderRow);
        const nominationRow = { GroupID: contract?.GroupID, GroupName: "Nomination" , isTotal: false };
        dateRange.forEach(date => {
          nominationRow[date] = 0;
        });
  
        contract?.GroupDetails.forEach(detail => {
          
          const ShipmentDate = dayjs(detail?.ShipmentDate).format('MM/DD/YYYY');
          if (nominationRow.hasOwnProperty(ShipmentDate)) {
            nominationRow[ShipmentDate] = detail?.NominationValue;
          }
        });
  
        transformed.push(nominationRow);
        console.log(nominationRow);
        // Second row (DRV)
        const drvRow = { GroupID: contract?.GroupID, GroupName: "DRV",isTotal: false };
        dateRange.forEach(date => {
          drvRow[date] = 0;
        });
  
        contract?.GroupDetails.forEach(detail => {
          const date = dayjs(detail?.GroupDate).format('MM/DD/YYYY');
          if (drvRow.hasOwnProperty(date)) {
            drvRow[date] = detail?.DRV_value;
          }
        });
  
        transformed.push(drvRow);
      });
    }
    const columns = [
      { header: data?.GroupData?.MarketerName, accessorKey: "GroupName", id: 'GroupName'},
      ...dateRange.map(date => ({
        accessorKey: date,
        header: date,
        id: date,
        Cell: ({ cell, row }) => (
          <TextField
            className="ServiceProvider"//{`ServiceProvider ${row.original.isTotal ? 'total-row-textbox' : ''}`}
            value={cell.getValue() || ''}
            onChange={(e) => handleChange(e.target.value, row.original, cell.column.id)}
            disabled={row.original.isTotal}
          />
        ),
      }))
    ];

    return { transformed, columns };
  }, [fromDate, toDate, generateDateRange, handleChange]);
  // const extractTotals = (rowvalue, totalData, dateRange) => {
  //   if (!totalData) {
  //     return null;
  //   };
  //   if(rowvalue === "Pipeline"){
  //     const totals = { GroupID: rowvalue, GroupName: "PipeNomination", isTotal: true, className: 'sticky-row' };
  //     totalData?.ContractDetails.forEach(detail => {
  //       const date = dayjs(detail.ContractDate).format('DD/MM');
  //       if (dateRange.includes(date)) {
  //         totals[date] = detail.ContractValue;
  //       }
  //     });
  //     return totals;
  //   }else if(rowvalue === "DRV_Total"){
  //     const totals = { GroupID: rowvalue, GroupName: "Group DRV", isTotal: true, className: 'sticky-row' };

  //     // Initialize each date with zero
  //     dateRange.forEach(date => {
  //       totals[date] = 0;
  //     });
  //     totalData.GroupData1.forEach(group => {
  //       group?.GroupDetails?.forEach(detail => {
  //         const date = dayjs(detail?.GroupDate).format('DD/MM');
  //         if (dateRange.includes(date)) {
  //           totals[date] = (totals[date] || '') + detail.DRV_value;
  //         }
  //       });
  //     });
  
  //     return totals;
  //   }else{
  //     const totals = { GroupID: rowvalue, GroupName: "Group Nom", isTotal: true, className: 'sticky-row' };
  //     dateRange.forEach(date => {
  //       totals[date] = 0;
  //     });
  //     totalData.GroupData1.forEach(group => {
  //       group?.GroupDetails?.forEach(detail => {
  //         const date = dayjs(detail?.GroupDate).format('DD/MM');
  //         if (dateRange.includes(date)) {
  //           totals[date] = (totals[date] || '') + detail.NominationValue;
  //         }
  //       });
  //     });
  
  //     return totals;
  //   }

  // };
  const extractTotals = (rowvalue, totalData, dateRange) => {
    if (!totalData || !dateRange) return null;
  
    const totals = {
      GroupID: rowvalue,
      GroupName: rowvalue === "DRV_Total" ? "Group DRV" :
                  rowvalue === "Pipeline" ? "PipeNomination" : "Group Nom",
      isTotal: true,
      className: 'sticky-row'
    };
  
    // Initialize all dates to 0
    dateRange.forEach(date => {
      totals[date] = 0;
    });
  
    if (rowvalue === "Pipeline" && totalData?.ContractDetails) {
      totalData.ContractDetails.forEach(detail => {
        const date = dayjs(detail.ContractDate).format('MM/DD/YYYY');
        if (dateRange.includes(date)) {
          totals[date] += Number(detail.ContractValue ?? 0);
        }
      });
    }
  
    else if ((rowvalue === "DRV_Total" || rowvalue === "Group") && totalData?.GroupData1?.length) {
      totalData.GroupData1.forEach(group => {
        group?.GroupDetails?.forEach(detail => {
          const date = dayjs(detail?.GroupDate).format('MM/DD/YYYY');
          if (dateRange.includes(date)) {
            if (rowvalue === "DRV_Total") {
              totals[date] += Number(detail.DRV_value ?? 0);
            } else {
              totals[date] += Number(detail.NominationValue ?? 0);
            }
          }
        });
      });
    }
  
    return totals;
  };
  
  const { transformed, columns } = useMemo(() => transformData(data), [data, transformData]);
  const dateRange = useMemo(() => generateDateRange(fromDate, toDate), [fromDate, toDate, generateDateRange]);
 
  // const totalPipeline = useMemo(() => extractTotals('Pipeline', data.NominationData?.TotalPipelineData, dateRange), [data, dateRange]);
  // const totalAllPipeline = useMemo(() => extractTotals('AllPipeline', data.NominationData?.TotalAllPipelineData, dateRange), [data, dateRange]);
  // const totalGroup = useMemo(() => {
  //   if (!data?.GroupData || !data.GroupData.TotalGroupData) return null;
  //   return extractTotals('Group', data.GroupData.TotalGroupData, dateRange);
  // }, [data, dateRange]);
  const totalGroup = useMemo(() => {
    if (!data?.GroupData) return null;
    return extractTotals('Group', data.GroupData, dateRange);
  }, [data, dateRange]);
  const totalNomination = useMemo(() => extractTotals('Pipeline', data?.NominationData?.TotalAllPipelineData, dateRange), [data, dateRange]);
  const totalDRV = useMemo(() => {
    if (!data?.GroupData) return null;
    return extractTotals('DRV_Total', data.GroupData, dateRange);
  }, [data, dateRange]);

  const getTransformefData = () => {
    let newData = [];
    if (data && data?.GroupData && data?.GroupData?.GroupData1) {
      newData = [...transformed, totalGroup,totalDRV,totalNomination];
    }
    else {
      newData = [...transformed];
    }
    return newData.filter(row => row && typeof row === 'object');
  }

  useEffect(() => {
    const setdata = async () => {
    const newTableData = getTransformefData();
    await setTableData(newTableData);
    const pinnedRows = newTableData ? newTableData.filter(row => row?.isTotal && row.GroupID !== "dummy").map(row => row.GroupID) : [];
    await setPinnedRow(pinnedRows);
    console.log("3333333333333333333333333",pinnedRows);
    }
    setdata();
  }, [data,transformed, totalGroup]);

  
  useEffect(() => {
    if(pinnedRow){
    table.setRowPinning({
      top: pinnedRow,
    });
    console.log('tablepinnedrow',pinnedRow);
  }
  }, [pinnedRow]);
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
    layoutMode: 'grid-no-grow',
    initialState: {
      columnPinning: { left: ["GroupName"] },
      columnVisibility: { 'mrt-row-pin': false },
    },
    getRowId: (originalRow) => originalRow?.GroupID?.toString(),
    enableRowPinning: true,
    rowPinningDisplayMode: 'sticky',
    muiTableContainerProps: {
      sx: {
        maxHeight: '400px',
      },
    },
    muiTableBodyProps: {
      sx: {
        display: (tableData && tableData?.find(t => t?.GroupID === "dummy") )? 'flex' : 'table-row-group',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontSize: '1.5rem',
        color: 'gray',
      },
      children: (tableData && tableData?.find(t => t?.GroupID === "dummy")) ? (
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
    
      // muiTableBodyRowProps: ({ row }) => ({
      //   sx: row.original.isGroupHeader
      //     ? { fontWeight: "bold", pointerEvents: "none" } // Apply styles if it's a group header
      //     : {}, // Default empty object for other rows
      // }),
      muiTableBodyCellEditTextFieldProps: ({ row, column }) =>
      row.original.isGroupHeader
        ? column.accessorKey === "GroupName"
          ? {} // Show textbox only for "Value" column in group header
          : { sx: { display: "none" } } // Hide other columns in group header
        : { sx: { display: "none" } },

        muiTableBodyCellProps: ({ cell, row, table }) => {
          if (row?.original?.isGroupHeader) {
            const totalColumns = table.getAllColumns().length; // Get total column count
        
            return {
              colSpan: cell?.column?.id === "GroupName" ? totalColumns : 0, // Span all columns or hide
              sx: cell?.column?.id === "GroupName"
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
                <IconButton onClick={clearFilter}>
                  <FilterListOff variant="contained" color="secondary" />
                </IconButton>
              </div>
            </Tooltip>
          </Box>
        )
  });

  return (
    <div ref={tableContainerRef}>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default GroupNominationList;