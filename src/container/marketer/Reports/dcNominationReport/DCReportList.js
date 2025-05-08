import React, { useState, useMemo, useEffect, forwardRef } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Typography } from "@mui/material";

const DCReportList = forwardRef(({setData1, ref}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Simulated API Data
        const jsonData = {
            Succeeded: true,
            Data: [
                { MarketerID: 1, MarketerName: "Alpha Gas & Electric DC", CustomerAccount: "220000617559", CustomerReallocatedVolume: 50000 },
                { MarketerID: 1, MarketerName: "Alpha Gas & Electric DC", CustomerAccount: "220002118002", CustomerReallocatedVolume: 20000 },
                { MarketerID: 2, MarketerName: "American Power & Gas DC", CustomerAccount: "220000617558", CustomerReallocatedVolume: 30000 },
                { MarketerID: 2, MarketerName: "American Power & Gas DC", CustomerAccount: "220002118004", CustomerReallocatedVolume: 10000 },
            ],
        };

        // Compute total volumes per marketer
        const marketerTotals = {};
        jsonData.Data.forEach((item) => {
            if (!marketerTotals[item.MarketerName]) {
                marketerTotals[item.MarketerName] = { TotalReallocatedVolume: 0, TotalDCNomination: 0, RowSpan: 0 };
            }
            marketerTotals[item.MarketerName].TotalReallocatedVolume += item.CustomerReallocatedVolume;
            marketerTotals[item.MarketerName].TotalDCNomination += item.CustomerReallocatedVolume;
            marketerTotals[item.MarketerName].RowSpan += 1;
        });

        // Format data with row span markers
        let formattedData = [];
        let marketerSeen = new Set();
        jsonData.Data.forEach((item) => {
            const isFirstOccurrence = !marketerSeen.has(item.MarketerName);
            formattedData.push({
                ...item,
                TotalReallocatedVolume: isFirstOccurrence ? marketerTotals[item.MarketerName].TotalReallocatedVolume : "",
                TotalDCNomination: isFirstOccurrence ? marketerTotals[item.MarketerName].TotalDCNomination : "",
                RowSpan: isFirstOccurrence ? marketerTotals[item.MarketerName].RowSpan : 0,
                HideMarketer: !isFirstOccurrence,
            });
            marketerSeen.add(item.MarketerName);
        });

        // Add grand total row
        formattedData.push({
            MarketerName: "Total",
            CustomerAccount: "",
            CustomerReallocatedVolume: formattedData.reduce((sum, item) => sum + (item.CustomerReallocatedVolume || 0), 0),
            TotalReallocatedVolume: formattedData.reduce((sum, item) => sum + (parseInt(item.TotalReallocatedVolume) || 0), 0),
            TotalDCNomination: formattedData.reduce((sum, item) => sum + (parseInt(item.TotalDCNomination) || 0), 0),
            isTotal: true,
        });

        setData(formattedData);
        setData1(formattedData);
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: "MarketerName",
                header: "Marketer",
                size: 250,
                Cell: ({ row }) =>
                    row.original.isTotal ? (
                        <Typography fontWeight="bold">Total</Typography>
                    ) : row.original.HideMarketer ? (
                        ""
                    ) : (
                        <Typography sx={{ verticalAlign: "middle" }} rowSpan={row.original.RowSpan}>
                            {row.original.MarketerName}
                        </Typography>
                    ),
            },
            {
                accessorKey: "CustomerAccount",
                header: "Customer Account #",
                size: 200,
            },
            {
                accessorKey: "CustomerReallocatedVolume",
                header: "Reallocated Volume",
                size: 200,
            },
            {
                accessorKey: "TotalReallocatedVolume",
                header: "Total Reallocated Volume",
                size: 200,
                Cell: ({ row }) =>
                    row.original.isTotal || row.original.TotalReallocatedVolume ? (
                        <Typography fontWeight="bold" sx={{ verticalAlign: "middle" }} rowSpan={row.original.RowSpan}>
                            {row.original.TotalReallocatedVolume}
                        </Typography>
                    ) : (
                        ""
                    ),
            },
            {
                accessorKey: "TotalDCNomination",
                header: "Total DC Nomination",
                size: 200,
                Cell: ({ row }) =>
                    row.original.isTotal || row.original.TotalDCNomination ? (
                        <Typography fontWeight="bold" sx={{ verticalAlign: "middle" }} rowSpan={row.original.RowSpan}>
                            {row.original.TotalDCNomination}
                        </Typography>
                    ) : (
                        ""
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
        enableGlobalFilter:false,
        enableHiding:false,
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
            sx: { textAlign: "center" },
        },
    });

    return (
        <Box id="table-container" ref={ref}>
            <MaterialReactTable table={table} />
        </Box>
    );
});

export default DCReportList;
