import React, { useState, useMemo, useEffect, forwardRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const SupplierPendingEnrollmentOrDropReportList = forwardRef(
  ({ supplierPendingEnrollmentOrDropData, setData1, ref }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Make a shallow copy of the original data
      if(supplierPendingEnrollmentOrDropData?.accountDetails){
      const originalData = supplierPendingEnrollmentOrDropData?.accountDetails || [];
     
      setData(originalData);
      setData1(originalData);
    }
    }, [supplierPendingEnrollmentOrDropData]);

    const columns = useMemo(
      () => [
        {
          accessorKey: "AccountNumber",
          header: "Account Number",
          size: 230,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
              fontWeight={ "bold" }
            >
              {row.original.AccountNumber}
            </Typography>
          ),
        },
        {
          accessorKey: "AccountFlag",
          header: "Account Flag",
          size: 150,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
            >
              {row.original.AccountFlag}
            </Typography>
          ),
        },
        {
          accessorKey: "Bill_Date",
          header: "Bill Date",
          size: 200,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
            >
              {dayjs(row.original.Bill_Date).format('MM/DD/YYYY')}
            </Typography>
          ),
        },
        {
          accessorKey: "BillMethod",
          header: "Bill Method",
          size: 200,
         
        },
        {
          accessorKey: "Code",
          header: "Code",
          size: 150,
         
        },
        {
          accessorKey: "EffectiveDate",
          header: "Effective Date",
          size: 200,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
            >
              {dayjs(row.original.EffectiveDate).format('MM/DD/YYYY')}
            </Typography>
          ),
        },
        {
          accessorKey: "MR_DATE",
          header: "METER READ DATE",
          size: 200,
          Cell: ({ row }) => (
            <Typography
              rowSpan={row.original.RowSpan}
            >
              {dayjs(row.original.MR_DATE).format('MM/DD/YYYY')}
            </Typography>
          ),
         
        },
        {
          accessorKey: "SupplierGroupNumber",
          header: "Supplier Group Number",
          size: 250,
         
        },
        {
          accessorKey: "Description",
          header: "Description",
          size: 250,
         
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

export default SupplierPendingEnrollmentOrDropReportList;
