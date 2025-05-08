import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { materialsymbolsdownload } from "images";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
} from "docx";
import dayjs from "dayjs";
const ActivityInterruptibleDownload = ({
  data,
  fileName = "Activity Interruptible Report",
  tableRef,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Activity Interruptible Report", 14, 10);

    const tableColumnHeaders = [
      "Month End",
      "Imbalance position at Beginning of month",
      "Nomination",
      "Usage",
      "Adjustment",
      "DRV",
      "Imbalance (under-delivery/over-delevery) at month end",
      "15% Thershold (Higher of DRV vs Usage)",
      "Outside 15% Tolerance level",
    ];
    const tableRows = [];

    data.forEach((item) => {
      const row = [];
      // EndDate
      row.push({ content: dayjs(item.EndDate).format("MM/DD/YYYY") });
      //   Imbalance position at Beginning of month
      row.push({
        content: item.PreviousBalanceInterruptible.toLocaleString(),
      });
      // Nomination
      row.push({ content: item.TotalNominationAllocations.toLocaleString() });
      // Usage
      row.push({ content: item.TotalUsage.toLocaleString() });
      // Adjustment
      row.push({ content: item.ImbalanceAdjustedVolume.toLocaleString() });
      // DRV
      row.push({ content: item.DailyRequiredVolume.toLocaleString() });

      // Imbalance (under-delivery/over-delevery) at month end
      row.push({ content: item.MonthEndImbalanceFirm.toLocaleString() });
      // 15% Thershold (Higher of DRV vs Usage)
      row.push({ content: item.ThresholdValue.toLocaleString() });
      // Outside 15% Tolerance level
      row.push({ content: item.OutsideThresholdAmount.toLocaleString() });
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { halign: "center", fontSize: 10 },
      headStyles: { fillColor: "#0F3557", textColor: "white", fontSize: 10 },
    });

    doc.save("Activity_Interruptible_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Activity Interruptible Report"], // Report Title
      [], // Empty Row
      [
        "Month End",
        "Imbalance position at Beginning of month",
        "Nomination",
        "Usage",
        "Adjustment",
        "DRV",
        "Imbalance (under-delivery/over-delevery) at month end",
        "15% Thershold (Higher of DRV vs Usage)",
        "Outside 15% Tolerance level",
      ], // Table Headers
    ];

    data.forEach((item) => {
      //
      const row = [];

      // EndDate
      row.push(dayjs(item.EndDate).format("MM/DD/YYYY"));
      //   Imbalance position at Beginning of month
      row.push(item.PreviousBalanceInterruptible.toLocaleString());
      // Nomination
      row.push(item.TotalNominationAllocations.toLocaleString());
      // Usage
      row.push(item.TotalUsage.toLocaleString());
      // Adjustment
      row.push(item.ImbalanceAdjustedVolume.toLocaleString());
      // DRV
      row.push(item.DailyRequiredVolume.toLocaleString());

      // Imbalance (under-delivery/over-delevery) at month end
      row.push(item.MonthEndImbalanceFirm.toLocaleString());
      // 15% Thershold (Higher of DRV vs Usage)
      row.push(item.ThresholdValue.toLocaleString());
      // Outside 15% Tolerance level
      row.push(item.OutsideThresholdAmount.toLocaleString());

      worksheetData.push(row);
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 20 }, // Marketer
      { wch: 25 }, // Customer Account #
      { wch: 25 }, // Reallocated Volume
      { wch: 25 }, // Total Reallocated Volume
      { wch: 25 }, // Total Activity Interruptible
    ];

    // Merge the title across all columns
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Activity Interruptible Report"
    );
    XLSX.writeFile(workbook, "Activity_Interruptible_Report.xlsx");
  };

  const downloadCSV = () => {
    try {
      // Define CSV Headers
      const headers = [
        "Month End",
        "Imbalance position at Beginning of month",
        "Nomination",
        "Usage",
        "Adjustment",
        "DRV",
        "Imbalance (under-delivery/over-delevery) at month end",
        "15% Thershold (Higher of DRV vs Usage)",
        "Outside 15% Tolerance level",
      ];

      // Convert Data to CSV Format
      const csvRows = [headers.join(",")]; // Add header row

      data.forEach((item) => {
        csvRows.push(
          [
            dayjs(item.EndDate).format("MM/DD/YYYY"), // Marketer (if hidden, add empty space)
            item.PreviousBalanceInterruptible,
            item.TotalNominationAllocations,
            item.TotalUsage, // Ensure correct alignment
            item.ImbalanceAdjustedVolume,
            item.DailyRequiredVolume,
            item.MonthEndImbalanceFirm,
            item.ThresholdValue,
            item.OutsideThresholdAmount,
          ].join(",")
        );
      });

      // Convert Array to CSV String
      const csvString = csvRows.join("\n");

      // Create Blob and Download
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Activity_Interruptible_Report.csv");
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const escapeXML = (str) => {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const downloadXML = () => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("No data available for XML export.");
        return;
      }

      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<ActivityInterruptibleReport>\n`;

      data.forEach((item) => {
        xmlString += `  <Record>\n`;
        xmlString += `    <MonthEnd>${escapeXML(
          dayjs(item.EndDate).format("MM/DD/YYYY")
        )}</MonthEnd>\n`;
        xmlString += `    <ImbalancePositionAtBeginningOfMonth>${escapeXML(
          item.PreviousBalanceInterruptible.toLocaleString()
        )}</ImbalancePositionAtBeginningOfMonth>\n`; // Ensure correct encoding
        xmlString += `    <Nomination>${escapeXML(
          item.TotalNominationAllocations.toLocaleString()
        )}</Nomination>\n`;
        xmlString += `    <Usage>${escapeXML(
          item.TotalUsage.toLocaleString()
        )}</Usage>\n`;
        xmlString += `    <Adjustment>${escapeXML(
          item.ImbalanceAdjustedVolume.toLocaleString()
        )}</Adjustment>\n`;
        xmlString += `    <DRV>${escapeXML(
          item.DailyRequiredVolume.toLocaleString()
        )}</DRV>\n`;
        xmlString += `    <ImbalanceAtMonthEnd>${escapeXML(
          item.MonthEndImbalanceFirm.toLocaleString()
        )}</ImbalanceAtMonthEnd>\n`;
        xmlString += `    <ThresholdValue>${escapeXML(
          item.ThresholdValue.toLocaleString()
        )}</ThresholdValue>\n`;
        xmlString += `    <OutSideThresholdAmount>${escapeXML(
          item.OutsideThresholdAmount.toLocaleString()
        )}</OutSideThresholdAmount>\n`;
        xmlString += `  </Record>\n`;
      });

      xmlString += `</ActivityInterruptibleReport>`;

      // Convert string to Blob
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });

      // Ensure `saveAs` is used correctly
      saveAs(blob, "Activity_Interruptible_Report.xml");
    } catch (error) {
      console.error("Error exporting XML:", error);
    }
  };

  const downloadWordDocument = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("No data available for Word export.");
      return;
    }

    // Define Headers
    const headers = [
      "Month End",
      "Imbalance position at Beginning of month",
      "Nomination",
      "Usage",
      "Adjustment",
      "DRV",
      "Imbalance (under-delivery/over-delevery) at month end",
      "15% Thershold (Higher of DRV vs Usage)",
      "Outside 15% Tolerance level",
    ];

    // Convert data into rows
    const rows = data.map((item) => [
      dayjs(item.EndDate).format("MM/DD/YYYY"), // Marketer (if hidden, add empty space)
      item.PreviousBalanceInterruptible.toLocaleString(),
      item.TotalNominationAllocations.toLocaleString(),
      item.TotalUsage.toLocaleString(), // Ensure correct alignment
      item.ImbalanceAdjustedVolume.toLocaleString(),
      item.DailyRequiredVolume.toLocaleString(),
      item.MonthEndImbalanceFirm.toLocaleString(),
      item.ThresholdValue.toLocaleString(),
      item.OutsideThresholdAmount.toLocaleString(),
    ]);

    // Create Word Table Rows
    const tableRows = rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [new Paragraph(cell?.toString() || "")],
                width: { size: 20, type: WidthType.PERCENTAGE },
              })
          ),
        })
    );

    // Create the Word Table
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: headers.map(
            (header) =>
              new TableCell({
                children: [new Paragraph({ text: header, bold: true })],
                width: { size: 20, type: WidthType.PERCENTAGE },
              })
          ),
        }),
        ...tableRows,
      ],
    });

    // Create Document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Activity Interruptible Report",
              heading: "Heading1",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "), // Spacing
            table,
          ],
        },
      ],
    });

    // Generate and Save the Document
    Packer.toBlob(doc)
      .then((blob) => {
        saveAs(blob, "Activity_Interruptible_Report.docx");
      })
      .catch((error) => {
        console.error("Error generating Word document:", error);
      });
  };

  const downloadHTML = () => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No valid data available to download!");
      return;
    }

    let tableRows = "";
    let grandTotalReallocated = 0;
    let grandTotalDCNomination = 0;

    // Group data by marketer
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.marketer]) acc[row.marketer] = [];
      acc[row.marketer].push(row);
      return acc;
    }, {});

    // Generate table rows
    Object.keys(groupedData).forEach((marketer) => {
      const rows = groupedData[marketer];
      let marketerTotalReallocated = 0;
      let marketerTotalDCNomination = 0;

      rows.forEach((row, index) => {
        // Ensure values are properly accessed and handled
        const EndDate = dayjs(row.EndDate).format("MM/DD/YYYY");
        const PreviousBalanceInterruptible =
          row.PreviousBalanceInterruptible.toLocaleString();
        const TotalNominationAllocations =
          row.TotalNominationAllocations.toLocaleString();
        const TotalUsage = row.TotalUsage.toLocaleString(); // Ensure correct alignment
        const ImbalanceAdjustedVolume =
          row.ImbalanceAdjustedVolume.toLocaleString();
        const DailyRequiredVolume = row.DailyRequiredVolume.toLocaleString();
        const MonthEndImbalanceFirm =
          row.MonthEndImbalanceFirm.toLocaleString();
        const ThresholdValue = row.ThresholdValue.toLocaleString();
        const OutsideThresholdAmount =
          row.OutsideThresholdAmount.toLocaleString();

        tableRows += `
                    <tr>
                     
                            <td><b>${EndDate}</b></td>
                        <td>${PreviousBalanceInterruptible}</td>
                        <td>${TotalNominationAllocations}</td>
                        <td>${TotalUsage}</td>
                        <td>${ImbalanceAdjustedVolume}</td>
                        <td>${DailyRequiredVolume}</td>
                        <td>${MonthEndImbalanceFirm}</td>
                        <td>${ThresholdValue}</td>
                        <td>${OutsideThresholdAmount}</td>
                      
                    </tr>
                `;
      });
    });

    // Create the full HTML document
    const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Activity Interruptible Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #0A2849; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                td[colspan] { font-weight: bold; text-align: left; }
                .total { font-weight: bold; }
            </style>
        </head>
        <body>
    
            <h2>Activity Interruptible Report</h2>
    
            <table>
                <thead>
                    <tr>
                             <th>Month End</th>
        <th>Imbalance position at Beginning of month</th>
        <th>Nomination</th>
        <th>Usage</th>
        <th>Adjustment</th>
        <th>DRV</th>
        <th>Imbalance (under-delivery/over-delevery) at month end</th>
        <th>15% Thershold (Higher of DRV vs Usage)</th>
        <th>Outside 15% Tolerance level</th>


                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
    
        </body>
        </html>`;

    // Create a Blob and trigger file download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Activity_Interruptible_Report.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTIFF = async () => {
    const tableElement = document.getElementById("table-container");

    if (!tableElement) {
      console.error("Table element not found!");
      return;
    }

    try {
      const canvas = await html2canvas(tableElement);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "Activity_Interruptible_Report.tiff");
        } else {
          console.error("Failed to create TIFF blob.");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error capturing table:", error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className="Download"
        color="primary"
        onClick={handleClick}
      >
        <img src={materialsymbolsdownload} alt="Download" /> Download
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={downloadExcel}>Excel</MenuItem>
        <MenuItem onClick={downloadCSV}>CSV</MenuItem>
        <MenuItem onClick={downloadPDF}>PDF</MenuItem>
        <MenuItem onClick={downloadXML}>XML</MenuItem>
        <MenuItem onClick={downloadWordDocument}>Word</MenuItem>
        <MenuItem onClick={downloadHTML}>MHTML</MenuItem>
        <MenuItem onClick={exportTIFF}>TIFF</MenuItem>
      </Menu>
    </>
  );
};

export default ActivityInterruptibleDownload;
