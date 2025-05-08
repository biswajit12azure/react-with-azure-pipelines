import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const NominationComplianceList = forwardRef(
  ({ NominationComplianceData, setData1, ref }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const formatTableData = (details) => {
        if (!details && !details?.length) return;
        const pipelines = [
          "Columbia",
          "Cove Pt",
          "Dominion",
          "TCO Transit",
          "Transco",
          "Transco Z6",
        ];
        const grouped = {};

        details?.forEach((item) => {
          const date = item.ShipmentDate.split("T")[0];
          if (!grouped[date]) grouped[date] = {};

          grouped[date][item.Pipeline] = {
            ShipmentDate: date,
            Pipeline: item.Pipeline,
            Group: item.AllocationGroup || "",
            TotalNominations: item.TotalNominations ?? 0,
            TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
            DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
            TotalUsage: item.TotalUsage ?? 0,
            totalforecastimbal: item.totalforecastimbal ?? 0,
            TotalPenalty: item.TotalPenalty ?? 0,
          };
        });

        const result = [];

        Object.entries(grouped).forEach(([date, pipelineData]) => {
          let totals = {
            ShipmentDate: "",
            Pipeline: "Total",
            Group: "",
            TotalNominations: 0,
            TotalNominationAllocations: 0,
            DailyRequiredVolume: 0,
            TotalUsage: 0,
            totalforecastimbal: 0,
            TotalPenalty: 0,
          };

          pipelines?.forEach((pipeline, i) => {
            const row = pipelineData[pipeline] || {
              ShipmentDate: date,
              Pipeline: pipeline,
              Group: "",
              TotalNominations: 0,
              TotalNominationAllocations: 0,
              DailyRequiredVolume: 0,
              TotalUsage: 0,
              totalforecastimbal: 0,
              TotalPenalty: 0,
            };

            const finalRow = {
              ...row,
              DisplayDate: i === 0 ? date : "",
              RowSpan: i === 0 ? pipelines.length + 1 : 0,
            };

            totals.TotalNominations += row.TotalNominations;
            totals.TotalNominationAllocations += row.TotalNominationAllocations;
            totals.DailyRequiredVolume += row.DailyRequiredVolume;
            totals.TotalUsage += row.TotalUsage;
            totals.totalforecastimbal += row.totalforecastimbal;
            totals.TotalPenalty += row.TotalPenalty;

            result.push(finalRow);
          });

          result.push({
            ShipmentDate: "",
            Pipeline: "Total",
            Group: "",
            TotalNominations: totals.TotalNominations,
            TotalNominationAllocations: totals.TotalNominationAllocations,
            DailyRequiredVolume: totals.DailyRequiredVolume,
            TotalUsage: totals.TotalUsage,
            totalforecastimbal: totals.totalforecastimbal,
            TotalPenalty: totals.TotalPenalty,
            DisplayDate: "",
            RowSpan: 0,
          });
        });

        return result;
      };

      const formatted = formatTableData(NominationComplianceData?.Details);
      setData(formatted?.length ? formatted : []);
      setData1(formatted?.length ? formatted : []);
    }, [NominationComplianceData]);
    const columns = useMemo(
      () => [
        {
          accessorKey: "DisplayDate",
          header: "Date",
          size: 100,
          Cell: ({ row }) =>
            row.original.DisplayDate ? (
              <td rowSpan={row.original.RowSpan}>
                {dayjs(row.original.DisplayDate).format("MM/DD/YYYY")}
              </td>
            ) : null,
        },
        {
          accessorKey: "Pipeline",
          header: "Pipeline",
          size: 140,
        },
        {
          accessorKey: "TotalNominations",
          header: "Nomination by pipeline (Dth)",
          size: 250,
        },
        {
          accessorKey: "Group",
          header: " Group ",
          size: 100,
        },

        {
          accessorKey: "TotalNominationAllocations",
          header: " Nomination by Group ",
          size: 210,
        },
        {
          accessorKey: "DailyRequiredVolume",
          header: "Forecast DRV",
          size: 150,
        },
        {
          accessorKey: "TotalUsage",
          header: "Usage / Actual DRV (Dth)",
          size: 230,
        },
        {
          accessorKey: "totalforecastimbal",
          header: "Forecast imbalance (Dth)",
          size: 240,
        },
        {
          accessorKey: "TotalPenalty",
          header: "Penalty",
          size: 140,
          Cell: ({ row }) => (
                      <Typography
                      >
                        {row.original.TotalPenalty.toLocaleString() }$
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

export default NominationComplianceList;
