import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography, Backdrop, TextField, CircularProgress, Button, Box } from "@mui/material";

const FirmList=({data,handleChange})=>
{
    console.log("FirmlistData",data);
    const handleInputChange = (row, value) => {
        handleChange(row, value);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "AllocationGroup",
                header: "GROUP",
            },
            {
                accessorKey: "MonthlyGroupImbalance",
                header: "GROUP IMBALANCE",
            },
            {
                accessorKey: "ImbalanceAdjustedVolume",
                header: "IMBALANCE ADJUSTMENT",
                Cell: ({cell, row }) => (
                    <Box>
                        <TextField
                            variant="standard"
                            value={cell.getValue()}
                            onChange={(e) =>  handleInputChange(row, e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: "PreviousBalanceFirm",
                header: "INVENTORY BALANCE",
                Cell: ({ cell }) => (
                    <Typography sx={{ fontWeight: "500", color: "#4A4A4A" }}>
                        {cell.getValue()}
                    </Typography>
                ),
            },
        ],
        [data]
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableHiding: false,
        enablePagination: false,
        enableBottomToolbar: false, // Hide bottom toolbar
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableDensityToggle: false,
        enableColumnHiding: false,
        positionToolbarAlertBanner: "none",     // Hide the density toggle
        enableColumnVisibility: false,   // Hide the column visibility toggle
        enableFullScreenToggle: false,   // Hide the full-screen toggle
        muiTableBodyCellProps: {
            sx: { borderBottom: "none" }, // Remove borders
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: "bold",
                color: "#0B254B",
                textAlign: "left",
            },
        },
        muiTableContainerProps: {
            sx: {
              maxHeight: '400px',
            },
          },
        renderToolbarInternalActions: () => null,
    });

    return (
        <div>
             {/* Table */}
             <MaterialReactTable table={table} />
        </div>
    );
}

export default FirmList;