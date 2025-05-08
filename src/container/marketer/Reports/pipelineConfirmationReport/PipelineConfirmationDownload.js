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
const PipelineConfirmationDownload = ({
  data,
  fileName = "Pipeline_Confirmation_Report",
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
    doc.text("Pipeline Confirmation Report", 14, 10);

    const tableColumnHeaders = [
      "Marketer",
      "Contract Number",
      "Nomination",
    ];
    const tableRows = [];

    data.forEach((item) => {
      if (item.isTotal) {
        // Total row (fully spans columns correctly)
        tableRows.push([
          {
            content: "Total",
            colSpan: 3, // Adjusted to span all the way across
            styles: { fontStyle: "bold", halign: "center" },
          },
          // { content: item.TotalNomination, styles: { fontStyle: "bold" } },
        ]);
      } else {
        const row = [];

        // Marketer
        row.push({ content: item.Marketer, styles: { fontStyle: "bold" } });

        // Contract Number
        row.push({ content: item.ContractNumber || "" });

        // Nomination
        row.push({ content: item.Nomination || "" });

        // Total nomination
        // row.push({
        //   content: item.TotalNomination || "", // Ensure it's not undefined or null
        //   styles: { fontStyle: "bold" },
        // });

        tableRows.push(row);
      }
    });

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { halign: "center", fontSize: 10 },
      headStyles: { fillColor: "#0F3557", textColor: "white", fontSize: 10 },
    });

    doc.save("Pipeline_Confirmation_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Pipeline Confirmation Report"], // Report Title
      [], // Empty Row
      ["Marketer", "Contract Number", "Nomination", ], // Table Headers
    ];

    data.forEach((item) => {
      if (item.isTotal) {
        // Total row (styled similarly to the PDF function)
        // worksheetData.push([
        //   "Total", // Merged Marketer
        //   "", // Empty placeholder for Customer Account
        //   "",
        //   item.TotalNomination,
        // ]);
      } else {
        const row = [];

        // Marketer
        row.push(item.Marketer);

        // Contract Number
        row.push(item.ContractNumber);

        // Nomination
        row.push(item.Nomination);
        // // Total nomination
        // row.push(item.TotalNomination);

        worksheetData.push(row);
      }
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 20 }, // Marketer
      { wch: 25 }, // Contract Number
      { wch: 25 }, // Nomination
      // { wch: 25 }, // Total nomination
      { wch: 25 }, // Total
    ];

    // Merge the title across all columns
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Pipeline Confirmation Report"
    );
    XLSX.writeFile(workbook, "Pipeline_Confirmation_Report.xlsx");
  };

  const downloadCSV = () => {
    try {
      // Define CSV Headers
      const headers = [
        "Marketer",
        "Contract Number",
        "Nomination",
        // "Total Nomination",
      ]; // Table Headers
      // Convert Data to CSV Format
      const csvRows = [headers.join(",")]; // Add header row

      data.forEach((item) => {
        if (item.isTotal) {
          // csvRows.push(
          //   [
          //     "Total", // Total row
          //     "",
          //     "",
          //     item.TotalNomination,
          //   ].join(",")
          // );
        } else {
          csvRows.push(
            [
              item.Marketer, // Marketer (if hidden, add empty space)
              item.ContractNumber,
              item.Nomination,
              // item.TotalNomination, // Ensure correct alignment
            ].join(",")
          );
        }
      });

      // Convert Array to CSV String
      const csvString = csvRows.join("\n");

      // Create Blob and Download
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Pipeline_Confirmation_Report.csv");
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

      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<PipelineConfirmation>\n`;

      data.forEach((item) => {
        xmlString += `  <Record>\n`;
        xmlString += `    <Marketer>${escapeXML(item.Marketer)}</Marketer>\n`;
        xmlString += `    <ContractNumber>${escapeXML(
          item.ContractNumber
        )}</ContractNumber>\n`; // Ensure correct encoding
        xmlString += `    <Nomination>${escapeXML(
          String(item.Nomination || "0")
        )}</Nomination>\n`;
        // xmlString += `    <TotalNomination>${escapeXML(
        //   String(item.TotalNomination)
        // )}</TotalNomination>\n`;
        xmlString += `  </Record>\n`;
      });

      xmlString += `</PipelineConfirmation>`;

      // Convert string to Blob
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });

      // Ensure `saveAs` is used correctly
      saveAs(blob, "Pipeline_Confirmation_Report.xml");
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
      "Marketer",
      "Contract Number",
      "Nomination",
      // "Total Nomination",
    ];

    // Convert data into rows
    const rows = data.map((item) => [
      item.Marketer,
      item.ContractNumber,
      item.Nomination,
      // item.TotalNomination || "",
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
              text: "Pipeline Confirmation Report",
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
        saveAs(blob, "Pipeline_Confirmation_Report.docx");
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

    // Group data by marketer
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.marketer]) acc[row.marketer] = [];
      acc[row.marketer].push(row);
      return acc;
    }, {});

    // Generate table rows
    Object.keys(groupedData).forEach((marketer) => {
      const rows = groupedData[marketer];

      rows.forEach((row) => {
        // if (row.isTotal) {
        //   grandTotalReallocated += row.TotalNomination || 0;
        //   return;
        // }
        const Marketer = row.Marketer;
        const ContractNumber = row.ContractNumber || "";
        const Nomination = row.Nomination || 0;
        // const TotalNomination = row.TotalNomination || 0;

        tableRows += `
          <tr>
            <td><b>${Marketer}</b></td>
            <td>${ContractNumber}</td>
            <td>${Nomination}</td>
          </tr>`;
      });
    });

    // Add total row
    tableRows += `
      <tr class="total">
        <td colspan="3"><b>Grand Total</b></td>
        <td><b>${grandTotalReallocated}</b></td>
      </tr>`;

    // Create full HTML
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Pipeline_Confirmation_Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #0A2849; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Pipeline_Confirmation_Report</h2>
        <table>
          <thead>
            <tr>
              <th>Marketer</th>
              <th>Contract Number</th>
              <th>Nomination</th>
              
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Pipeline_Confirmation_Report.html";
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
          saveAs(blob, "Pipeline_Confirmation_Report.tiff");
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

export default PipelineConfirmationDownload;
