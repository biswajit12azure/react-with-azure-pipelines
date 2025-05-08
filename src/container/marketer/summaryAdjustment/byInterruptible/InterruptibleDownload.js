import React, { useState } from "react";
import { Button, Typography, Grid, Menu, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { materialsymbolsdownload } from 'images';
import dayjs from 'dayjs';

const InterruptibleDownload = ({ data, selectedDate }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDownload = (format) => {
        try {
            const workbook = XLSX.utils.book_new();
            const worksheetData = [
                [""], // Empty row
                ["", "Summary Adjustment Activity Interruptible", "", "", ""], // Header
                [], // Empty row
                ["", `For the month ${dayjs(selectedDate).format('MMMM')}`, "", "", ""], // Dynamic month
                [], // Empty row
                [], // Empty row
                ["", `Date published: ${dayjs().format('MM/DD/YYYY')}`, "", "", ""], // Date published
                [], // Empty row
                [], // Empty row
                ["", "GROUP", "IMBALANCE - FOM", "NOMINATIONS", "USAGE", "ADJUSTMENT", "DRV", "IMBALANCE - EOM", "±15% TOLERANCE", ">15% TOLERANCE"], // Table headers
                ...data.InterruptibleData.map(item => [
                    "",
                    item.AllocationGroup,
                    { v: item.PreviousBalanceInterruptible, t: 'n', z: '0,0' }, // Right align with 10 & 100 format
                    { v: item.TotalNominationAllocations, t: 'n', z: '0,0' }, // Right align with 10 & 100 format
                    { v: item.TotalUsage, t: 'n', z: '0,0' }, // Right align with 10 & 100 format
                    { v: item.ImbalanceAdjustedVolume, t: 'n', z: '0,0' },
                    { v: item.DailyRequiredVolume, t: 'n', z: '0,0' },
                    { v: item.MonthEndImbalanceInterruptible, t: 'n', z: '0,0' },
                    { v: item.ThresholdValue, t: 'n', z: '0,0' },
                    { v: item.OutsideThresholdAmount, t: 'n', z: '0,0' }
                ])
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            worksheet['!merges'] = [
                { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } }, // Merge B2:F2
                { s: { r: 3, c: 1 }, e: { r: 3, c: 4 } }, // Merge B4:F4
                { s: { r: 6, c: 1 }, e: { r: 6, c: 3 } }, // Merge B7:D7
            ];

            worksheet['!cols'] = [
                { wch: 0 }, // Column A
                { wch: 20 }, // Column B
                { wch: 30 }, // Column C
                { wch: 30 }, // Column D
                { wch: 30 }, // Column E
                { wch: 30 }, // Column E
                { wch: 30 }, // Column E
                { wch: 30 }, // Column E
                { wch: 30 }, // Column E
                { wch: 30 }, // Column E
            ];

            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary Adjustment Activity Int");

            // if (format === 'xls') {
            //     XLSX.writeFile(workbook, "Summary Adjustment Activity Interruptible.xls");
            // } else 
            if (format === 'xlsx') {
                XLSX.writeFile(workbook, "Summary Adjustment Activity Interruptible.xlsx");
            } else if (format === 'pdf') {
                const doc = new jsPDF();
                autoTable(doc, {
                    head: [ ["GROUP", "IMBALANCE - FOM", "NOMINATIONS", "USAGE", "ADJUSTMENT", "DRV", "IMBALANCE - EOM", "±15% TOLERANCE", ">15% TOLERANCE"], // Table headers
                ],
                    body: data.InterruptibleData.map(item => [
                        item.AllocationGroup,
                        item.PreviousBalanceInterruptible,
                        item.TotalNominationAllocations,
                        item.TotalUsage,
                        item.ImbalanceAdjustedVolume,
                        item.DailyRequiredVolume,
                        item.MonthEndImbalanceInterruptible,
                        item.ThresholdValue,
                        item.OutsideThresholdAmount
                    ])
                });
                doc.save('Summary Adjustment Activity Interruptible.pdf');
            } else if (format === 'csv') {
                const csvData = XLSX.utils.sheet_to_csv(worksheet);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Summary Adjustment Activity Interruptible.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            handleClose();
        } catch (error) {
            console.error("Error generating the report:", error);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary"
                onClick={handleClick}
            >
                <img src={materialsymbolsdownload} alt="Download" /> Download
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleDownload('xlsx')}>Excel</MenuItem>
                <MenuItem onClick={() => handleDownload('csv')}>CSV</MenuItem>
                <MenuItem onClick={() => handleDownload('pdf')}>PDF</MenuItem>
            </Menu>
        </>
    );
};

export default InterruptibleDownload;