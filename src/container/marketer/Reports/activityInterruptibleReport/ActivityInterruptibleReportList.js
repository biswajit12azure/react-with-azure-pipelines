import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const ActivityInterruptibleList = forwardRef(
  ({ activityInterruptible, setData1, ref }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
  
    if(activityInterruptible && activityInterruptible.ActivityInterruptibleReport && activityInterruptible.ActivityInterruptibleReport.length)
      {
        setData(activityInterruptible.AdjustmentActivityInterruptibleReport);
        setData1(activityInterruptible.AdjustmentActivityInterruptibleReport);
      }
    }, [activityInterruptible]);

    const columns = useMemo(
      () => [
        {
          accessorKey: "EndDate",
          header: "Month End",
          size: 150,
          Cell: ({ row }) => (
            <Box>
              <Typography sx={{ fontWeight: "bold", color: "gray" }}>
                {row.original.AllocationGroup}
              </Typography>
              <Typography
                sx={{ verticalAlign: "middle" }}
                rowSpan={row.original.RowSpan}
              >
                {dayjs(row.original.EndDate).format("MM/DD/YYYY")}
              </Typography>
            </Box>
          ),
        },
        {
          accessorKey: "PreviousBalanceInterruptible",
          header: "Imbalance position at Beginning of month",
          size: 250,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.PreviousBalanceInterruptible.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalNominationAllocations",
          header: "Nomination",
          size: 150,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.TotalNominationAllocations.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "TotalUsage",
          header: "Usage",
          size: 150,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.TotalUsage.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "ImbalanceAdjustedVolume",
          header: "Adjustment",
          size: 150,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.ImbalanceAdjustedVolume.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "DailyRequiredVolume",
          header: "DRV",
          size: 100,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.DailyRequiredVolume.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "MonthEndImbalanceFirm",
          header: "Imbalance (under-delivery/over-delevery) at month end",
          size: 350,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.MonthEndImbalanceFirm.toLocaleString()}
            </Typography>
          ),
        },
        {
          accessorKey: "ThresholdValue",
          header: "15% Thershold (Higher of DRV vs Usage)",
          size: 250,
          Cell: ({ row }) => (
            <Typography rowSpan={row.original.RowSpan}>
              {row.original.ThresholdValue.toLocaleString()}
            </Typography>
          ),
        },

        {
          accessorKey: "OutsideThresholdAmount",
          header: "Outside 15% Tolerance level",
          size: 150,
          Cell: ({ row }) => (
            <Typography
              sx={{ verticalAlign: "middle" }}
              rowSpan={row.original.RowSpan}
            >
              {row.original.OutsideThresholdAmount.toLocaleString()}
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
          textAlign: "center",
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

export default ActivityInterruptibleList;
