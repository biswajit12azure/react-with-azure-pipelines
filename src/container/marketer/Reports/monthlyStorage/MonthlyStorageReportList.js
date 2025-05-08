import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const MonthlyStorageReportList = forwardRef(
  ({ monthlyStorageData, setData1, ref }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Make a shallow copy of the original data
      if(monthlyStorageData?.MonthlyStorageData){
      const originalData = monthlyStorageData?.MonthlyStorageData || [];
      const formattedData = [...originalData];

      const monthlyTotalStorage = monthlyStorageData.MonthlyTotalStorage;

      // Check if the total row is already added
      const hasTotal = formattedData.some((item) => item.isTotal);

      if (!hasTotal) {
        formattedData.push({
          ShipmentDate: "Total",
          isTotal: true,
          TotalNominationAllocations:
            monthlyTotalStorage.MonthlyTotalNominationAllocations,
          TotalUsage: monthlyTotalStorage.MonthlyTotalUsage,
          TotalInjection: monthlyTotalStorage.MonthlyTotalInjection,
          TotalBalance: monthlyTotalStorage.MonthEndBalance,
        });
      }

      console.log(formattedData);
      setData(formattedData);
      setData1(formattedData);
    }
    }, [monthlyStorageData]);

    const columns = useMemo(
      () => [
        {
          accessorKey: "ShipmentDate",
          header: "Date",
          size: 200,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={row.original.isTotal ? "bold" : "normal"}
            >
              {row.original.isTotal
                ? row.original.ShipmentDate
                : dayjs(row.original.ShipmentDate).format("MM/DD/YYYY")}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalNominationAllocations",
          header: "Nomination (Dth)",
          size: 200,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={row.original.isTotal ? "bold" : "normal"}
            >
              {row.original.TotalNominationAllocations.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalUsage",
          header: "Usage / Actualized DRV (Dth)",
          size: 250,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={row.original.isTotal ? "bold" : "normal"}
            >
              {row.original.TotalUsage.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalInjection",
          header: "Injections / Withdrawal (Dth / Day)",
          size: 300,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={row.original.isTotal ? "bold" : "normal"}
            >
              {row.original.TotalInjection.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalBalance",
          header: "Inventory balance (Dth)",
          size: 250,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={row.original.isTotal ? "bold" : "normal"}
            >
              {row.original.TotalBalance.toLocaleString()}
            </Typography>
          ),
        },
      ],
      []
    );

    const table = useMaterialReactTable({
      columns,
      data,
      enableExpanding: false,
      enablePagination: false,
      enableColumnFilters: false,
      enableFullScreenToggle: false,
      enableColumnActions: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableDensityToggle: false,
      muiTableHeadCellProps: {
        sx: {
          backgroundColor: "#0F3557",
          color: "white",
          fontWeight: "bold",
          textAlign: "left",
        },
      },
      muiTableBodyCellProps: {
        sx: { textAlign: "left" },
      },
    });

    return (
      <Box id="table-container" ref={ref}>
        <MaterialReactTable table={table} />
      </Box>
    );
  }
);

export default MonthlyStorageReportList;
