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
const SupplierPendingEnrollmentOrDropReportDownload = ({
  data,
  fileName = "Supplier Pending Enrollment/Drop Report",
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
    doc.text("Supplier Pending Enrollment/Drop Report", 14, 10);

    const tableColumnHeaders = [
      "Account Number",
      "Account Flag",
      "Bill Date",
      "Bill Method",
      "Code",
      "Effective Date",
      "METER READ DATE",
      "Supplier Group Number",
      "Description",
    ];
    const tableRows = [];

    data.forEach((item) => {
      const row = [];
      row.push({
        content: item.AccountNumber,
        styles: { fontStyle: "bold" },
      });
      row.push({ content: item.AccountFlag || "" });
      row.push({ content: dayjs(item.Bill_Date).format('MM/DD/YYYY') });
      row.push({ content: item.BillMethod });
      row.push({ content: item.Code });
      row.push({ content: dayjs(item.EffectiveDate).format('MM/DD/YYYY') });
      row.push({ content: dayjs(item.MR_DATE).format('MM/DD/YYYY') });
      row.push({ content: item.SupplierGroupNumber });
      row.push({ content: item.Description });


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

    doc.save("Supplier_Pending_Enrollment/Drop_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Supplier Pending Enrollment/Drop Report"], // Report Title
      [], // Empty Row
      [
        "Account Number",
        "Account Flag",
        "Bill Date",
        "Bill Method",
        "Code",
        "Effective Date",
        "METER READ DATE",
        "Supplier Group Number",
        "Description",
      ], // Table Headers
    ];

    data.forEach((item) => {

      const row = [];
      row.push(item.AccountNumber || "");
      row.push(item.AccountFlag || "");
      row.push(dayjs(item.Bill_Date).format('MM/DD/YYYY'));
      row.push(item.BillMethod);
      row.push(item.Code);
      row.push(dayjs(item.EffectiveDate).format('MM/DD/YYYY'));
      row.push(dayjs(item.MR_DATE).format('MM/DD/YYYY'));
      row.push(item.SupplierGroupNumber);
      row.push(item.Description);



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
      { wch: 25 }, // Totals (Dth)
      { wch: 25 }, // Totals (Dth)
      { wch: 25 }, // Totals (Dth)
    ];

    // Merge the title across all columns
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "SupplierPendingEnrollmentOrDrop");
    XLSX.writeFile(workbook, "Supplier_Pending_Enrollment/Drop.xlsx");
  };

  const downloadCSV = () => {
    try {
      const headers = [
        "Account Number",
        "Account Flag",
        "Bill Date",
        "Bill Method",
        "Code",
        "Effective Date",
        "METER READ DATE",
        "Supplier Group Number",
        "Description",
      ];
  
      const escapeCSV = (value) => {
        if (value == null) return ""; // handle null/undefined
        const stringValue = String(value);
        // Escape double quotes and wrap in quotes if value contains comma, newline or quote
        if (/[",\n]/.test(stringValue)) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };
  
      const csvRows = [headers.map(escapeCSV).join(",")];
  
      data.forEach((item) => {
        const row = [
          item.AccountNumber,
          item.AccountFlag,
          dayjs(item.Bill_Date).format("MM/DD/YYYY"),
          item.BillMethod,
          item.Code,
          dayjs(item.EffectiveDate).format("MM/DD/YYYY"),
          dayjs(item.MR_DATE).format("MM/DD/YYYY"),
          item.SupplierGroupNumber,
          item.Description,
        ].map(escapeCSV);
        csvRows.push(row.join(","));
      });
  
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Supplier_Pending_Enrollment_Drop_Report.csv");
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

      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<SupplierPendingEnrollmentOrDropReport>\n`;

      data.forEach((item) => {

        xmlString += `  <Record>\n`;
        xmlString += `    <AccountNumber>${escapeXML(item.AccountNumber)}</AccountNumber>\n`;
        xmlString += `    <AccountFlag>${escapeXML(
          item.AccountFlag
        )}</AccountFlag>\n`;
        xmlString += `    <Bill_Date>${escapeXML
          (dayjs(item.Bill_Date).format('MM/DD/YYYY')
          )}</Bill_Date>\n`; // Ensure correct encoding
        xmlString += `    <BillMethod>${escapeXML(
          item.BillMethod
        )}</BillMethod>\n`;
        xmlString += `    <Code>${escapeXML(
          item.Code
        )}</Code>\n`;
        xmlString += `    <EffectiveDate>${escapeXML
          (dayjs(item.EffectiveDate).format('MM/DD/YYYY')
          )}</EffectiveDate>\n`;
        xmlString += `    <MR_DATE>${escapeXML
          (dayjs(item.MR_DATE).format('MM/DD/YYYY')
          )}</MR_DATE>\n`;
        xmlString += `    <SupplierGroupNumber>${escapeXML(String(item.SupplierGroupNumber || ""))}</SupplierGroupNumber>\n`;
        xmlString += `    <Description>${escapeXML(item.Description)}</Description>\n`;
        xmlString += `  </Record>\n`;
      });

      xmlString += `</SupplierPendingEnrollmentOrDropReport>`;

      // Convert string to Blob
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });

      // Ensure `saveAs` is used correctly
      saveAs(blob, "Supplier_Pending_Enrollment/Drop_Report.xml");
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
      "Account Number",
      "Account Flag",
      "Bill Date",
      "Bill Method",
      "Code",
      "Effective Date",
      "METER READ DATE",
      "Supplier Group Number",
      "Description",
    ];

    // Convert data into rows
    const rows = data.map((item) => [
      item.AccountNumber || "",
      item.AccountFlag || "",
      dayjs(item.Bill_Date).format('MM/DD/YYYY'),
      item.BillMethod,
      item.Code,
      dayjs(item.EffectiveDate).format('MM/DD/YYYY'),
      dayjs(item.MR_DATE).format('MM/DD/YYYY'),
      item.SupplierGroupNumber,
      item.Description,
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
              text: "Supplier Pending Enrollment/Drop Report",
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
        saveAs(blob, "Supplier_Pending_Enrollment/Drop_Report.docx");
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
    // Group data by supplierPendingEnrollmentOrDrop
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.supplierPendingEnrollmentOrDrop]) acc[row.supplierPendingEnrollmentOrDrop] = [];
      acc[row.supplierPendingEnrollmentOrDrop].push(row);
      return acc;
    }, {});

    // Generate table rows
    Object.keys(groupedData).forEach((supplierPendingEnrollmentOrDrop) => {
      const rows = groupedData[supplierPendingEnrollmentOrDrop];

      rows.forEach((row, index) => {
        // Ensure values are properly accessed and handled
        const AccountNumber = row.AccountNumber || "";
        const AccountFlag = row.AccountFlag || "";
        const Bill_Date = dayjs(row.Bill_Date).format('MM/DD/YYYY');
        const BillMethod = row.BillMethod;
        const Code = row.Code;
        const EffectiveDate = dayjs(row.EffectiveDate).format('MM/DD/YYYY');
        const MR_DATE = dayjs(row.MR_DATE).format('MM/DD/YYYY');
        const SupplierGroupNumber = row.SupplierGroupNumber;
        const Description = row.Description;

        tableRows += `
                    <tr>
                        <td>${AccountNumber}</td>
                        <td>${AccountFlag}</td>
                        <td>${Bill_Date}</td>
                        <td>${BillMethod}</td>
                        <td>${Code}</td>
                        <td>${EffectiveDate}</td>
                        <td>${MR_DATE}</td>
                        <td>${SupplierGroupNumber}</td>
                        <td>${Description}</td>
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
            <title>Supplier Pending Enrollment/Drop Report</title>
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
    
            <h2>Supplier Pending Enrollment/Drop Report</h2>
    
            <table>
                <thead>
                    <tr>
                        <th>Account Number</th>
                        <th>Account Flag</th>
                        <th>Bill Date</th>
                        <th>Bill Method</th>
                        <th>Code</th>
                        <th>Effective Date</th>
                        <th>METER READ DATE</th>
                        <th>Supplier Group Number</th>
                        <th>Description</th>
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
    link.download = "Supplier_Pending_Enrollment/Drop_Report.html";
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
          saveAs(blob, "SupplierPendingEnrollmentOrDrop.tiff");
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

export default SupplierPendingEnrollmentOrDropReportDownload;
