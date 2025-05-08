import React from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import AccountInquiryDetails from "./AccountInquiryDetails";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const AccountInquiryList = ({ data,noRecordMessage }) => {
    const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const columns = [
        {
            accessorKey: "AccountNumber",
            header: "Account #",
            Cell: ({ row }) => (
                <span onClick={() => handleAddEdit(row)} >
                    <Typography sx={{ ml: 1 ,textAlign:"left"}}>{row.original.AccountNumber}</Typography>

                </span>
            ),
        },
        { accessorKey: "AccountHolder", header: "Account Holder" },
        { accessorKey: "ServiceAddress", header: "Service Address" ,
            Cell: ({ cell }) => (
                <Box>
                    {truncateText(cell.getValue(), 20)}
                </Box>
            ),
        },
        { accessorKey: "BillingAddress", header: "Billing Address",
            Cell: ({ cell }) => (
                <Box>
                    {truncateText(cell.getValue(), 20)}
                </Box>
            ),
         },
        {
            accessorKey: "PhoneNumber",
            header: "Phone Number",
            Cell: ({ cell }) => (
                <Box >
                    {formatPhoneNumber(cell.getValue())}
                </Box>
            ),
        },
        {
            accessorKey: "AmountDue",
            header: "Amount Due",
            Cell: ({ cell }) => (
                <Box >
                    {`$ ${cell.getValue()}`}
                </Box>
            ),
        },

    ];

    const handleAddEdit = (row) => {
        row.toggleExpanded();

    };

    const table = useMaterialReactTable({
        columns,
        data: noRecordMessage ? [] : data,
        enableHiding: false,
        columnFilterDisplayMode: 'popover',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableRowActions: false,
        enableRowSelection: false,
        enableExpandAll: false,
        positionExpandColumn: 'first',
        positionToolbarAlertBanner: 'none',
        autoResetPageIndex: false,
        getRowId: (row) => row.UserId, // Ensure unique IDs for rows
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: "",
                size: 10, // make the expand column wider
                muiTableHeadCellProps: {
                    sx: {
                        display: 'none', // Hide the expand column
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        display: 'none', // Hide the expand column
                    },
                },
            },
        },
        initialState: {
            columnOrder: [
                'mrt-row-expand',
                'AccountNumber',
                'AccountHolder',
                'ServiceAddress',
                'BillingAddress',
                "PhoneNumber",
                "AmountDue"
            ],

        },
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <AccountInquiryDetails rowData={row.original} />
            </Box>
        ),
        muiExpandButtonProps: {
            sx: {
                display: 'none',
            },
        },
        localization: {
            noRecordsToDisplay: noRecordMessage || 'No records to display.',
        },
    });

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider>
        </>
    );
};

export default AccountInquiryList;