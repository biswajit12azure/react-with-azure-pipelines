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
const MonthlyStorageReportDownload = ({
  data,
  fileName = "Monthly Storage Report",
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
    doc.text("Monthly Storage Report", 14, 10);

    const tableColumnHeaders = [
      "Date",
      "Nomination (Dth)",
      "Usage / Actualized DRV (Dth)",
      "Injections / Withdrawal (Dth / Day)",
      "Inventory balance (Dth)",
      "Total (Dth)",
    ];
    const tableRows = [];

    data.forEach((item) => {
      const total =
        (item.nominationDth || 0) +
        (item.injectionWithdrawalDthPerDay || 0) +
        (item.inventoryBalanceDth || 0) +
        (item.usageActualizedDrvDth || 0);

      const row = [];
      row.push({ content: item.date || "" });
      row.push({ content: item.nominationDth || 0 });
      row.push({ content: item.usageActualizedDrvDth || 0 });
      row.push({ content: item.injectionWithdrawalDthPerDay || 0 });
      row.push({ content: item.inventoryBalanceDth || 0 });
      row.push({
        content: total,
        rowSpan: item.RowSpan || 1,
        styles: { fontStyle: "bold" },
      });

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

    doc.save("MonthlyStorage_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Monthly Storage Report"], // Report Title
      [], // Empty Row
      [
        "Date",
        "Nomination (Dth)",
        "Usage / Actualized DRV (Dth)",
        "Injections / Withdrawal (Dth / Day)",
        "Inventory balance (Dth)",
        "Total (Dth)",
      ], // Table Headers
    ];

    data.forEach((item) => {
      const total =
        item.nominationDth ||
        0 + item.injectionWithdrawalDthPerDay ||
        0 + item.inventoryBalanceDth ||
        0;

      const row = [];
      row.push(item.date);

      // Ensure correct monthlyStorage alignment
      if (!item.HideMonthlyStorage) {
        row.push(item.nominationDth);
      } else {
        row.push(""); // Placeholder for hidden monthlyStorage
      }
      // Usage / Actualized DRV (Dth)
      row.push(item.usageActualizedDrvDth);

      // Injections / Withdrawal (Dth / Day)
      row.push(item.injectionWithdrawalDthPerDay);

      // Inventory balance (Dth)
      row.push(item.inventoryBalanceDth);

      // Ensure correct alignment of Total Reallocated Volume and DC Nomination

      row.push(total);

      worksheetData.push(row);
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 20 }, // Date
      { wch: 20 }, // Nomination
      { wch: 25 }, // Usage / Actualized DRV (Dth)
      { wch: 25 }, // Injections / Withdrawal (Dth / Day)
      { wch: 25 }, // Inventory balance (Dth)
      { wch: 25 }, // Totals (Dth)
    ];

    // Merge the title across all columns
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Storage Report");
    XLSX.writeFile(workbook, "MonthlyStorage_Report.xlsx");
  };

  const downloadCSV = () => {
    try {
      // Define CSV Headers
      const headers = [
        "Date",
        "Nomination (Dth)",
        "Usage / Actualized DRV (Dth)",
        "Injections / Withdrawal (Dth / Day)",
        "Inventory balance (Dth)",
        "Total (Dth)",
      ];

      // Convert Data to CSV Format
      const csvRows = [headers.join(",")]; // Add header row

      data.forEach((item) => {
        const total =
          item.nominationDth ||
          0 + item.injectionWithdrawalDthPerDay ||
          0 + item.inventoryBalanceDth ||
          0;

        csvRows.push(
          [
            item.date || "",
            item.HideMonthlyStorage ? "" : item.nominationDth, // MonthlyStorage (if hidden, add empty space)
            `\t${item.usageActualizedDrvDth}`,
            item.injectionWithdrawalDthPerDay,
            item.inventoryBalanceDth || "", // Ensure correct alignment
            item.TotalDCNomination || "",
            total || "",
          ].join(",")
        );
      });

      // Convert Array to CSV String
      const csvString = csvRows.join("\n");

      // Create Blob and Download
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "MonthlyStorage_Report.csv");
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

      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<MonthlyStorageReport>\n`;

      data.forEach((item) => {
        const total =
          item.nominationDth ||
          0 + item.injectionWithdrawalDthPerDay ||
          0 + item.inventoryBalanceDth ||
          0;

        xmlString += `  <Record>\n`;
        xmlString += `    <Date>${escapeXML(item.date)}</Date>\n`;
        xmlString += `    <Nomination>${escapeXML(
          String(item.nominationDth)
        )}</Nomination>\n`;
        xmlString += `    <UsageActualizedDRV>${escapeXML(
          String(item.usageActualizedDrvDth)
        )}</UsageActualizedDRV>\n`; // Ensure correct encoding
        xmlString += `    <Injections>${escapeXML(
          String(item.injectionWithdrawalDthPerDay)
        )}</Injections>\n`;
        xmlString += `    <InventoryBalance>${escapeXML(
          String(item.inventoryBalanceDth || "")
        )}</InventoryBalance>\n`;
        xmlString += `    <Total>${escapeXML(String(total || ""))}</Total>\n`;
        xmlString += `  </Record>\n`;
      });

      xmlString += `</MonthlyStorageReport>`;

      // Convert string to Blob
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });

      // Ensure `saveAs` is used correctly
      saveAs(blob, "MonthlyStorage_Report.xml");
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
      "Date",
      "Nomination (Dth)",
      "Usage / Actualized DRV (Dth)",
      "Injections / Withdrawal (Dth / Day)",
      "Inventory balance (Dth)",
      "Total (Dth)",
    ];

    // Convert data into rows
    const rows = data.map((item) => [
      item.date,
      item.HideMonthlyStorage ? "" : item.nominationDth,
      item.usageActualizedDrvDth,
      item.injectionWithdrawalDthPerDay,
      item.inventoryBalanceDth || "",
      item.nominationDth ||
        0 + item.injectionWithdrawalDthPerDay ||
        0 + item.inventoryBalanceDth ||
        0 ||
        "",
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
              text: "Monthly Storage Report",
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
        saveAs(blob, "MonthlyStorage_Report.docx");
      })
      .catch((error) => {
        console.error("Error generating Word document:", error);
      });
  };

  // const downloadMHTML = () => {
  //     const htmlContent = `<!DOCTYPE html>
  //     <html>
  //     <head>
  //       <meta http-equiv="Content-Type" content="text/html" charset="utf-8">
  //       <title>Monthly Storage Report</title>
  //       <style>
  //         body {
  //           font-family: Arial, sans-serif;
  //         }
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //         }
  //         th, td {
  //           border: 1px solid black;
  //           padding: 8px;
  //           text-align: left;
  //         }
  //         th {
  //           background-color: #f2f2f2;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <table>
  //         <thead>
  //           <tr>${Object.keys(data[0])
  //             .map((key) => `<th>${key}</th>`)
  //             .join("")}</tr>
  //         </thead>
  //         <tbody>
  //           ${data
  //             .map(
  //               (row) =>
  //                 `<tr>${Object.values(row)
  //                   .map((value) => `<td>${value}</td>`)
  //                   .join("")}</tr>`
  //             )
  //             .join("")}
  //         </tbody>
  //       </table>
  //     </body>
  //     </html>`;

  //     const blob = new Blob([htmlContent], { type: "multipart/related" });
  //     saveAs(blob, "MonthlyStorage_Report.mhtml");
  // };

  // const downloadHTML = () => {
  //     const htmlContent = `<!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>Monthly Storage Report</title>
  //         <style>
  //             body { font-family: Arial, sans-serif; }
  //             table { width: 100%; border-collapse: collapse; }
  //             th, td { border: 1px solid black; padding: 8px; text-align: left; }
  //             th { background-color: #0A2849; color: white; font-weight: bold; }
  //             tr:nth-child(even) { background-color: #f2f2f2; }
  //             td[colspan] { font-weight: bold; text-align: left; }
  //             .total { font-weight: bold; }
  //         </style>
  //     </head>
  //     <body>

  //         <h2>Monthly Storage Report</h2>

  //         <table>
  //             <thead>
  //                 <tr>
  //                     <th>MonthlyStorage</th>
  //                     <th>Customer Account #</th>
  //                     <th>Reallocated Volume</th>
  //                     <th>Total Reallocated Volume</th>
  //                     <th>Total DC Nomination</th>
  //                 </tr>
  //             </thead>
  //             <tbody>
  //                 <tr>
  //                     <td rowspan="2"><b>Alpha Gas & Electric DC</b></td>
  //                     <td>220000617559</td>
  //                     <td>50000</td>
  //                     <td rowspan="2"><b>70000</b></td>
  //                     <td rowspan="2"><b>70000</b></td>
  //                 </tr>
  //                 <tr>
  //                     <td>220002118002</td>
  //                     <td>20000</td>
  //                 </tr>
  //                 <tr>
  //                     <td rowspan="2"><b>American Power & Gas DC</b></td>
  //                     <td>220000617558</td>
  //                     <td>30000</td>
  //                     <td rowspan="2"><b>40000</b></td>
  //                     <td rowspan="2"><b>40000</b></td>
  //                 </tr>
  //                 <tr>
  //                     <td>220002118004</td>
  //                     <td>10000</td>
  //                 </tr>
  //                 <tr class="total">
  //                     <td colspan="2"><b>Total</b></td>
  //                     <td><b>110000</b></td>
  //                     <td><b>110000</b></td>
  //                     <td><b>110000</b></td>
  //                 </tr>
  //             </tbody>
  //         </table>

  //     </body>
  //     </html>`;

  //     const blob = new Blob([htmlContent], { type: "text/html" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = "MonthlyStorage_Report.html";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  // };

  const downloadHTML = () => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No valid data available to download!");
      return;
    }

    let tableRows = "";
    // Group data by monthlyStorage
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.monthlyStorage]) acc[row.monthlyStorage] = [];
      acc[row.monthlyStorage].push(row);
      return acc;
    }, {});

    // Generate table rows
    Object.keys(groupedData).forEach((monthlyStorage) => {
      const rows = groupedData[monthlyStorage];

      rows.forEach((row, index) => {
        // Ensure values are properly accessed and handled
        const date = row.date || "N/A";
        const nominationDth = row.nominationDth || 0;
        const usageActualizedDrvDth = row.usageActualizedDrvDth || 0;
        const injectionWithdrawalDthPerDay =
          row.injectionWithdrawalDthPerDay || 0;
        const inventoryBalanceDth = row.inventoryBalanceDth || 0;
        const total =
          row.nominationDth ||
          0 + row.injectionWithdrawalDthPerDay ||
          0 + row.inventoryBalanceDth ||
          0;

        tableRows += `
                    <tr>
                        <td>${date}</td>
                        <td>${nominationDth}</td>
                        <td>${usageActualizedDrvDth}</td>
                        <td>${injectionWithdrawalDthPerDay}</td>
                        <td>${inventoryBalanceDth}</td>
                        <td><b>${total}</b></td>
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
            <title>Monthly Storage Report</title>
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
    
            <h2>Monthly Storage Report</h2>
    
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Nomination (Dth)</th>
                        <th>Usage / Actualized DRV (Dth)</th>
                        <th>Injections / Withdrawal (Dth / Day)</th>
                        <th>Inventory balance (Dth)</th>
                        <th>Totals (Dth)</th>
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
    link.download = "MonthlyStorage_Report.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const exportTIFF = async () => {
  //   if (!tableRef.current) {
  //     console.error('Table reference is null!');
  //     return;
  //   }

  //   try {
  //     const canvas = await html2canvas(tableRef.current);
  //     canvas.toBlob((blob) => {
  //       if (blob) {
  //         saveAs(blob, 'table.tiff');
  //       } else {
  //         console.error('Failed to create TIFF blob.');
  //       }
  //     }, 'image/png'); // TIFF not directly supported, use PNG
  //   } catch (error) {
  //     console.error('Error capturing table:', error);
  //   }
  // };

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
          saveAs(blob, "MonthlyStorage.tiff");
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

export default MonthlyStorageReportDownload;
