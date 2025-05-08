import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
const CityGateReportList = forwardRef(({ cityGateData, setData1, ref }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const grouped = cityGateData?.supplybyCityGateReport?.reduce(
        (acc, entry) => {
          const shortName = entry.ShortName;

          if (!acc[shortName]) {
            acc[shortName] = {
              ShortName: shortName,
              RowSpan: 0,
              TotalNomination: 0,
              NominationPercentageByShortName: 0,
              TotalByShortName: 0,
              NominationPercentageSum: 0,
              children: [],
            };
          }

          acc[shortName].RowSpan += 1;
          acc[shortName].TotalNomination = entry.TotalNomination || 0;
          acc[shortName].NominationPercentageByShortName =
            entry.NominationPercentageByShortName || 0;
          acc[shortName].TotalByShortName = entry.TotalByShortName || 0;
          acc[shortName].NominationPercentageSum =
            entry.NominationPercentageSum || 0;
          acc[shortName].children.push(entry);
          return acc;
        },
        {}
      );

      const result = Object.values(grouped); // Convert to array
      // ✅ Use the totals already present in each group
      const totalRow = {
        ShortName: "Total",
        RowSpan: 1,
        isTotalRow: true,
        GrandTotal: result[0].children[0].GrandTotal,
        NominationPercentageOverall:
          result[0].children[0].NominationPercentageOverall,
        children: result[0].children,
      };

      // We assume all groups have same totals for their subgroup.
      // If you want to take from a specific group, update the index [0] accordingly.

      const finalData = [...result, totalRow];
      console.log(finalData);
      setData(finalData);
      setData1(finalData);
    } catch (e) {
      setData([]);
      console.log(e);
    }
  }, [cityGateData]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "ShortName",
        header: "Marketer",
        size: 250,
        Cell: ({ row }) => (
          <Typography
            sx={{ textAlign: "left" }}
            fontWeight="bold"
            rowSpan={row.original.RowSpan}
          >
            {row.original.ShortName}
          </Typography>
        ),
      },
      {
        accessorKey: "columbia",
        header: "Columbia",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[0].PipeLineTotal.toLocaleString()
                : row.original.children[0].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[0].NominationPercentGroupWise.toFixed(2)
                : row.original.children[0].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "NominationPercentageByShortName",
        header: "Transco",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[3].PipeLineTotal.toLocaleString()
                : row.original.children[3].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[3].NominationPercentGroupWise.toFixed(2)
                : row.original.children[3].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "TotalNomination",
        header: "Dominion",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[2].PipeLineTotal.toLocaleString()
                : row.original.children[2].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[2].NominationPercentGroupWise.toFixed(2)
                : row.original.children[2].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "NominationPercentageOverall",
        header: "Cove Pt",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[1].PipeLineTotal.toLocaleString()
                : row.original.children[1].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[1].NominationPercentGroupWise.toFixed(2)
                : row.original.children[1].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "TranscoZ6",
        header: "Transco Z6",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[4].PipeLineTotal.toLocaleString()
                : row.original.children[4].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[4].NominationPercentGroupWise.toFixed(2)
                : row.original.children[4].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "TCOTransit",
        header: "TCO Transit",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography>
              {row.original.isTotalRow
                ? row.original.children[5].PipeLineTotal.toLocaleString()
                : row.original.children[5].TotalNomination.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.isTotalRow
                ? row.original.children[5].NominationPercentGroupWise.toFixed(2)
                : row.original.children[5].NominationPercentageByShortName.toFixed(
                    2
                  )}{" "}
              %
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "TotalColumn",
        header: "Total",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "right" }}>
            <Typography fontWeight="bold">
              {row.original.isTotalRow
                ? row.original.GrandTotal.toLocaleString()
                : row.original.TotalByShortName.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="text.secondary"
            >
              100 %
            </Typography>
          </Box>
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
      sx: {
        borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
      },
    },
  });

  return (
    <Box id="table-container cityGateList" ref={ref}>
      <MaterialReactTable table={table} />
    </Box>
  );
});

export default CityGateReportList;
