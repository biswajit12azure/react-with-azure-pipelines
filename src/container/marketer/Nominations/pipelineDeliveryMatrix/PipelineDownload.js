import React, { useState } from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { materialsymbolsdownload } from 'images';
import dayjs from 'dayjs';

const PipelineDownload = ({ data, selectedDate }) => {
    console.log("$$$$$$$$$$$$$$$$$$$$$$",data);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const exportToExcel = () => {
      
        const worksheetData = [
          ["INPUTS"],
          ["Total System Load", data?.PipelineGuide?.SystemLoad],
          ["DRV Assigned", data?.PipelineGuide?.DRVAssigned],
          ["Withdraw from Storage", data?.PipelineGuide?.StorageWithdraw],
          ["Remaining FT Load", data?.PipelineGuide?.RemainingFTLoad],
          [],
          ["Pipeline", "Min", "Max", "Nomination"],
          ...data?.PipeLines?.map(p => {
            const minPercent = parseFloat(data?.PipelineGuide?.RemainingFTLoad * (p?.MinValue / 100));
            const maxPercent = parseFloat(data?.PipelineGuide?.RemainingFTLoad * (p?.MaxValue / 100)) ;
         
            return[
            p.PipelineName,
            `${minPercent}`,
            `${maxPercent}`,
            p.PipeNomination
          ]
          
        })
        ];
    
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pipeline Delivery Guide Report");
    
        const filename = `Pipeline_Delivery_Guide_Report_${dayjs().format("YYYY-MM-DD")}.xlsx`;
        XLSX.writeFile(workbook, filename);
        handleClose();
      };
      const exportToPDF = () => {
        const doc = new jsPDF();
      
        const systemLoad = data?.PipelineGuide?.SystemLoad || 0;
        const drvAssigned = data?.PipelineGuide?.DRVAssigned || 0;
        const storageWithdraw = data?.PipelineGuide?.StorageWithdraw || 0;
        const remainingFTLoad = data?.PipelineGuide?.RemainingFTLoad || 0;
      
        // Title
        doc.setFontSize(16);
        doc.text("Pipeline Delivery Guide Report", 14, 15);
      
        // INPUTS table
        autoTable(doc, {
          startY: 25,
          head: [["INPUTS", ""]],
          body: [
            ["Total System Load", systemLoad],
            ["DRV Assigned", drvAssigned],
            ["Withdraw from Storage", storageWithdraw],
            ["Remaining FT Load", remainingFTLoad],
          ],
          theme: "grid",
          headStyles: { fillColor: [26, 61, 117], halign: "left" },
          styles: { halign: "left" },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 70 },
            1: { cellWidth: 50 }
          }
        });
      
        // Pipeline Table
        const pipelineTableBody = data?.PipeLines?.map((p) => {
          const min = parseFloat((remainingFTLoad * (parseFloat(p?.MinValue) / 100)).toFixed(0));
          const max = parseFloat((remainingFTLoad * (parseFloat(p?.MaxValue) / 100)).toFixed(0));
      
          return [
            p.PipelineName || "-",
            min,
            max,
            p.PipeNomination || 0
          ];
        });
      
        autoTable(doc, {
          head: [["Pipeline", "Min", "Max", "Nomination"]],
          body: pipelineTableBody,
          startY: doc.previousAutoTable.finalY + 10,
          theme: "grid",
          headStyles: { fillColor: [26, 61, 117] },
          styles: { halign: "center" },
        });
      
        doc.save(`Pipeline_Report_${dayjs().format("YYYY-MM-DD")}.pdf`);
        handleClose();
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
                <MenuItem onClick={exportToExcel}>Excel</MenuItem>
                {/* <MenuItem onClick={exportToPDF}>CSV</MenuItem> */}
                <MenuItem onClick={exportToPDF}>PDF</MenuItem>
            </Menu>
        </>
    );
};

export default PipelineDownload;