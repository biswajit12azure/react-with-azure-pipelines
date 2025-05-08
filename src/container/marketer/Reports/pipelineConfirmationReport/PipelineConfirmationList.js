import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";

const PipelineConfirmationList = forwardRef(
  ({ PipelineConfirmationData, setData1, ref }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
      if (!PipelineConfirmationData?.ReportBody) return;
      setData(PipelineConfirmationData?.ReportBody);
        setData1(PipelineConfirmationData?.ReportBody);
    }, [PipelineConfirmationData]);
    const columns = useMemo(
      () => [
        {
          accessorKey: "Marketer",
          header: "Marketer",
          size: 250,
          Cell: ({ row }) => (
            <Typography fontWeight="bold" sx={{ verticalAlign: "middle" }}>
              {row.original.Marketer}
            </Typography>
          ),
        },
        {
          accessorKey: "ContractNumber",
          header: "Contract Number",
          size: 200,
        },
        {
          accessorKey: "Nomination",
          header: "Nomination",
          size: 200,
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
          textAlign: "left",
          borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
        },
      },
    });

    return (
      <Box id="table-container" ref={ref}>
        <MaterialReactTable table={table} />
      </Box>
    );
  }
);

export default PipelineConfirmationList;
