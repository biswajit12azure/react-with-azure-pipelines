import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { materialsymbolsdownload } from "images";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
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
const NominationComplianceDownload = ({
  data,
  fileName = "Nomination Compliance Report",
  tableRef,
}) => {
  const pipelines = [
    "Columbia",
    "Cove Pt",
    "Dominion",
    "TCO Transit",
    "Transco",
    "Transco Z6",
  ];
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
    doc.text("Nomination Compliance Report", 14, 10);
    let col = true;
    const tableColumnHeaders = [
      "Date",
      "Pipeline",
      "Nomination by pipeline (Dth)",
      "Group",
      "Nomination by Group",
      "Forecast DRV",
      "Usage / Actual DRV (Dth)",
      "Forecast imbalance (Dth)",
      "Penalty ($)",
    ];

    const pipelines = [
      "Columbia",
      "Cove Pt",
      "Dominion",
      "TCO Transit",
      "Transco",
      "Transco Z6",
    ];

    const groupedData = {};

    // Group data by date and pipeline
    data.forEach((item) => {
      if (!item.ShipmentDate || !item.Pipeline) return;

      const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
      const pipeline = item.Pipeline;

      if (!groupedData[date]) groupedData[date] = {};
      groupedData[date][pipeline] = {
        pipeline,
        TotalNominations: item.TotalNominations ?? 0,
        Group: item.Group || "",
        TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
        totalforecastimbal: item.totalforecastimbal ?? 0,
        TotalUsage: item.TotalUsage ?? 0,
        TotalPenalty: item.TotalPenalty ?? 0,
      };
    });

    let startY = 20;
    const tableBody = [];

    // Create table rows for all dates
    Object.entries(groupedData).forEach(([date, entries]) => {
      let totalNoms = 0;
      let totalGroupNoms = 0;
      let totalDRV = 0;
      let totalUsage = 0;
      let totalImbalance = 0;
      let totalPenalty = 0;

      pipelines.forEach((pipeline) => {
        const record = entries[pipeline] || {
          pipeline,
          TotalNominations: 0,
          Group: "",
          TotalNominationAllocations: 0,
          DailyRequiredVolume: 0,
          totalforecastimbal: 0,
          TotalUsage: 0,
          TotalPenalty: 0,
        };

        totalNoms += record.TotalNominations;
        totalGroupNoms += record.TotalNominationAllocations;
        totalDRV += record.DailyRequiredVolume;
        totalUsage += record.TotalUsage;
        totalImbalance += record.totalforecastimbal;
        totalPenalty += record.TotalPenalty;

        tableBody.push([
          date,
          pipeline,
          record.TotalNominations,
          record.Group,
          record.TotalNominationAllocations,
          record.DailyRequiredVolume,
          record.TotalUsage,
          record.totalforecastimbal,
          record.TotalPenalty,
        ]);
      });

      // Add totals row
      tableBody.push([
        date,
        "Total",
        totalNoms,
        "",
        totalGroupNoms,
        totalDRV,
        totalUsage,
        totalImbalance,
        totalPenalty,
      ]);
    });

    // Render full table
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableBody,
      startY: startY,
      theme: "grid",
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: "#0F3557", textColor: "white", fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    doc.save("Nomination_Compliance_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Nomination Compliance Report"], // Title
      [], // Spacer row
      [
        "Date",
        "Pipeline",
        "Nomination by pipeline (Dth)",
        "Group",
        "Nomination by Group",
        "Forecast DRV",
        "Usage / Actual DRV (Dth)",
        "Forecast imbalance (Dth)",
        "Penalty ($)",
      ], // Headers
    ];
  
    const pipelines = [
      "Columbia",
      "Cove Pt",
      "Dominion",
      "TCO Transit",
      "Transco",
      "Transco Z6",
    ];
  
    const groupedData = {};
  
    data.forEach((item) => {
      if (!item.ShipmentDate || !item.Pipeline) return;
  
      const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
      const pipeline = item.Pipeline;
  
      if (!groupedData[date]) groupedData[date] = {};
      groupedData[date][pipeline] = {
        pipeline,
        TotalNominations: item.TotalNominations ?? 0,
        Group: item.Group || "",
        TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
        totalforecastimbal: item.totalforecastimbal ?? 0,
        TotalUsage: item.TotalUsage ?? 0,
        TotalPenalty: item.TotalPenalty ?? 0,
      };
    });
  
    Object.entries(groupedData).forEach(([date, entries]) => {
      let totalNoms = 0;
      let totalGroupNoms = 0;
      let totalDRV = 0;
      let totalUsage = 0;
      let totalImbalance = 0;
      let totalPenalty = 0;
  
      pipelines.forEach((pipeline) => {
        const record = entries[pipeline] || {
          pipeline,
          TotalNominations: 0,
          Group: "",
          TotalNominationAllocations: 0,
          DailyRequiredVolume: 0,
          totalforecastimbal: 0,
          TotalUsage: 0,
          TotalPenalty: 0,
        };
  
        totalNoms += record.TotalNominations;
        totalGroupNoms += record.TotalNominationAllocations;
        totalDRV += record.DailyRequiredVolume;
        totalUsage += record.TotalUsage;
        totalImbalance += record.totalforecastimbal;
        totalPenalty += record.TotalPenalty;
  
        worksheetData.push([
          date,
          pipeline,
          record.TotalNominations,
          record.Group,
          record.TotalNominationAllocations,
          record.DailyRequiredVolume,
          record.TotalUsage,
          record.totalforecastimbal,
          record.TotalPenalty,
        ]);
      });
  
      // Total row
      worksheetData.push([
        date,
        "Total",
        totalNoms,
        "",
        totalGroupNoms,
        totalDRV,
        totalUsage,
        totalImbalance,
        totalPenalty,
      ]);
    });
  
    // Create workbook and sheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Date
      { wch: 15 }, // Pipeline
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
    ];
  
    // Merge the title row
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nomination Report");
    XLSX.writeFile(workbook, "Nomination_Compliance_Report.xlsx");
  };
  
  const downloadCSV = () => {
    try {
      const headers = [
        "Date",
        "Pipeline",
        "Nomination by pipeline (Dth)",
        "Group",
        "Nomination by Group",
        "Forecast DRV",
        "Usage / Actual DRV (Dth)",
        "Forecast imbalance (Dth)",
        "Penalty ($)",
      ];
  
      const pipelines = [
        "Columbia",
        "Cove Pt",
        "Dominion",
        "TCO Transit",
        "Transco",
        "Transco Z6",
      ];
  
      const groupedData = {};
  
      data.forEach((item) => {
        if (!item.ShipmentDate || !item.Pipeline) return;
  
        const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
        const pipeline = item.Pipeline;
  
        if (!groupedData[date]) groupedData[date] = {};
        groupedData[date][pipeline] = {
          pipeline,
          TotalNominations: item.TotalNominations ?? 0,
          Group: item.Group || "",
          TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
          DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
          totalforecastimbal: item.totalforecastimbal ?? 0,
          TotalUsage: item.TotalUsage ?? 0,
          TotalPenalty: item.TotalPenalty ?? 0,
        };
      });
  
      const csvRows = [headers.join(",")]; // Add header row
  
      Object.entries(groupedData).forEach(([date, entries]) => {
        let totalNoms = 0;
        let totalGroupNoms = 0;
        let totalDRV = 0;
        let totalUsage = 0;
        let totalImbalance = 0;
        let totalPenalty = 0;
  
        pipelines.forEach((pipeline) => {
          const record = entries[pipeline] || {
            pipeline,
            TotalNominations: 0,
            Group: "",
            TotalNominationAllocations: 0,
            DailyRequiredVolume: 0,
            totalforecastimbal: 0,
            TotalUsage: 0,
            TotalPenalty: 0,
          };
  
          totalNoms += record.TotalNominations;
          totalGroupNoms += record.TotalNominationAllocations;
          totalDRV += record.DailyRequiredVolume;
          totalUsage += record.TotalUsage;
          totalImbalance += record.totalforecastimbal;
          totalPenalty += record.TotalPenalty;
  
          csvRows.push([
            date,
            pipeline,
            record.TotalNominations,
            record.Group,
            record.TotalNominationAllocations,
            record.DailyRequiredVolume,
            record.TotalUsage,
            record.totalforecastimbal,
            record.TotalPenalty,
          ].join(","));
        });
  
        // Total row
        csvRows.push([
          date,
          "Total",
          totalNoms,
          "",
          totalGroupNoms,
          totalDRV,
          totalUsage,
          totalImbalance,
          totalPenalty,
        ].join(","));
      });
  
      // Convert array to CSV string
      const csvString = csvRows.join("\n");
  
      // Create Blob and Download
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Nomination_Compliance_Report.csv");
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
  
      const pipelines = [
        "Columbia",
        "Cove Pt",
        "Dominion",
        "TCO Transit",
        "Transco",
        "Transco Z6",
      ];
  
      const groupedData = {};
  
      data.forEach((item) => {
        if (!item.ShipmentDate || !item.Pipeline) return;
  
        const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
        const pipeline = item.Pipeline;
  
        if (!groupedData[date]) groupedData[date] = {};
        groupedData[date][pipeline] = {
          pipeline,
          TotalNominations: item.TotalNominations ?? 0,
          Group: item.Group || "",
          TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
          DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
          totalforecastimbal: item.totalforecastimbal ?? 0,
          TotalUsage: item.TotalUsage ?? 0,
          TotalPenalty: item.TotalPenalty ?? 0,
        };
      });
  
      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<NominationComplianceReport>\n`;
  
      Object.entries(groupedData).forEach(([date, entries]) => {
        pipelines.forEach((pipeline) => {
          const record = entries[pipeline] || {
            pipeline,
            TotalNominations: 0,
            Group: "",
            TotalNominationAllocations: 0,
            DailyRequiredVolume: 0,
            totalforecastimbal: 0,
            TotalUsage: 0,
            TotalPenalty: 0,
          };
  
          xmlString += `  <Record>\n`;
          xmlString += `    <Date>${escapeXML(date)}</Date>\n`;
          xmlString += `    <Pipeline>${escapeXML(pipeline)}</Pipeline>\n`;
          xmlString += `    <NominationByPipeline>${record.TotalNominations}</NominationByPipeline>\n`;
          xmlString += `    <Group>${escapeXML(record.Group)}</Group>\n`;
          xmlString += `    <NominationByGroup>${record.TotalNominationAllocations}</NominationByGroup>\n`;
          xmlString += `    <ForecastDRV>${record.DailyRequiredVolume}</ForecastDRV>\n`;
          xmlString += `    <Usage>${record.TotalUsage}</Usage>\n`;
          xmlString += `    <ForecastImbalance>${record.totalforecastimbal}</ForecastImbalance>\n`;
          xmlString += `    <Penalty>${record.TotalPenalty}</Penalty>\n`;
          xmlString += `  </Record>\n`;
        });
  
        // Total row
        let totalNoms = 0, totalGroupNoms = 0, totalDRV = 0, totalUsage = 0, totalImbalance = 0, totalPenalty = 0;
        pipelines.forEach(p => {
          const r = entries[p] || {};
          totalNoms += r.TotalNominations ?? 0;
          totalGroupNoms += r.TotalNominationAllocations ?? 0;
          totalDRV += r.DailyRequiredVolume ?? 0;
          totalUsage += r.TotalUsage ?? 0;
          totalImbalance += r.totalforecastimbal ?? 0;
          totalPenalty += r.TotalPenalty ?? 0;
        });
  
        xmlString += `  <Record>\n`;
        xmlString += `    <Date>${escapeXML(date)}</Date>\n`;
        xmlString += `    <Pipeline>Total</Pipeline>\n`;
        xmlString += `    <NominationByPipeline>${totalNoms}</NominationByPipeline>\n`;
        xmlString += `    <Group></Group>\n`;
        xmlString += `    <NominationByGroup>${totalGroupNoms}</NominationByGroup>\n`;
        xmlString += `    <ForecastDRV>${totalDRV}</ForecastDRV>\n`;
        xmlString += `    <Usage>${totalUsage}</Usage>\n`;
        xmlString += `    <ForecastImbalance>${totalImbalance}</ForecastImbalance>\n`;
        xmlString += `    <Penalty>${totalPenalty}</Penalty>\n`;
        xmlString += `  </Record>\n`;
      });
  
      xmlString += `</NominationComplianceReport>`;
  
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });
  
      saveAs(blob, "Nomination_Compliance_Report.xml");
    } catch (error) {
      console.error("Error exporting XML:", error);
    }
  };
  
 
  

  const downloadWordDocument = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("No data available for Word export.");
      return;
    }
  
    const pipelines = [
      "Columbia",
      "Cove Pt",
      "Dominion",
      "TCO Transit",
      "Transco",
      "Transco Z6",
    ];
  
    const headers = [
      "Date",
      "Pipeline",
      "Nomination by pipeline (Dth)",
      "Group",
      "Nomination by Group",
      "Forecast DRV",
      "Usage / Actual DRV (Dth)",
      "Forecast imbalance (Dth)",
      "Penalty ($)",
    ];
  
    const groupedData = {};
  
    data.forEach((item) => {
      if (!item.ShipmentDate || !item.Pipeline) return;
  
      const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
      const pipeline = item.Pipeline;
  
      if (!groupedData[date]) groupedData[date] = {};
      groupedData[date][pipeline] = {
        pipeline,
        TotalNominations: item.TotalNominations ?? 0,
        Group: item.Group || "",
        TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
        totalforecastimbal: item.totalforecastimbal ?? 0,
        TotalUsage: item.TotalUsage ?? 0,
        TotalPenalty: item.TotalPenalty ?? 0,
      };
    });
  
    const allRows = [];
  
    // Header row
    const headerRow = new TableRow({
      children: headers.map((text) =>
        new TableCell({
          children: [new Paragraph({ text, bold: true })],
          width: { size: 20, type: WidthType.PERCENTAGE },
        })
      ),
    });
  
    allRows.push(headerRow);
  
    // Data rows
    Object.entries(groupedData).forEach(([date, entries]) => {
      let totalNoms = 0,
        totalGroupNoms = 0,
        totalDRV = 0,
        totalUsage = 0,
        totalImbalance = 0,
        totalPenalty = 0;
  
      pipelines.forEach((pipeline) => {
        const record = entries[pipeline] || {
          pipeline,
          TotalNominations: 0,
          Group: "",
          TotalNominationAllocations: 0,
          DailyRequiredVolume: 0,
          totalforecastimbal: 0,
          TotalUsage: 0,
          TotalPenalty: 0,
        };
  
        totalNoms += record.TotalNominations;
        totalGroupNoms += record.TotalNominationAllocations;
        totalDRV += record.DailyRequiredVolume;
        totalUsage += record.TotalUsage;
        totalImbalance += record.totalforecastimbal;
        totalPenalty += record.TotalPenalty;
  
        const row = [
          date,
          pipeline,
          record.TotalNominations,
          record.Group,
          record.TotalNominationAllocations,
          record.DailyRequiredVolume,
          record.TotalUsage,
          record.totalforecastimbal,
          record.TotalPenalty,
        ];
  
        allRows.push(
          new TableRow({
            children: row.map((cell) =>
              new TableCell({
                children: [new Paragraph(cell.toString())],
                width: { size: 20, type: WidthType.PERCENTAGE },
              })
            ),
          })
        );
      });
  
      // Total row
      const totalRow = [
        date,
        "Total",
        totalNoms,
        "",
        totalGroupNoms,
        totalDRV,
        totalUsage,
        totalImbalance,
        totalPenalty,
      ];
  
      allRows.push(
        new TableRow({
          children: totalRow.map((cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  text: cell.toString(),
                  bold: true,
                }),
              ],
              width: { size: 20, type: WidthType.PERCENTAGE },
            })
          ),
        })
      );
    });
  
    // Build the table
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: allRows,
    });
  
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Nomination Compliance Report",
              heading: "Heading1",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "), // Spacer
            table,
          ],
        },
      ],
    });
  
    // Export
    Packer.toBlob(doc)
      .then((blob) => {
        saveAs(blob, "Nomination_Compliance_Report.docx");
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
  
    const pipelines = [
      "Columbia",
      "Cove Pt",
      "Dominion",
      "TCO Transit",
      "Transco",
      "Transco Z6",
    ];
  
    const groupedData = {};
  
    data.forEach((item) => {
      if (!item.ShipmentDate || !item.Pipeline) return;
  
      const date = dayjs(item.ShipmentDate).format("MM/DD/YYYY");
      const pipeline = item.Pipeline;
  
      if (!groupedData[date]) groupedData[date] = {};
      groupedData[date][pipeline] = {
        pipeline,
        TotalNominations: item.TotalNominations ?? 0,
        Group: item.Group || "",
        TotalNominationAllocations: item.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: item.DailyRequiredVolume ?? 0,
        totalforecastimbal: item.totalforecastimbal ?? 0,
        TotalUsage: item.TotalUsage ?? 0,
        TotalPenalty: item.TotalPenalty ?? 0,
      };
    });
  
    let tableRows = "";
  
    Object.entries(groupedData).forEach(([date, entries]) => {
      let totalNoms = 0,
        totalGroupNoms = 0,
        totalDRV = 0,
        totalUsage = 0,
        totalImbalance = 0,
        totalPenalty = 0;
  
      pipelines.forEach((pipeline) => {
        const record = entries[pipeline] || {
          pipeline,
          TotalNominations: 0,
          Group: "",
          TotalNominationAllocations: 0,
          DailyRequiredVolume: 0,
          totalforecastimbal: 0,
          TotalUsage: 0,
          TotalPenalty: 0,
        };
  
        totalNoms += record.TotalNominations;
        totalGroupNoms += record.TotalNominationAllocations;
        totalDRV += record.DailyRequiredVolume;
        totalUsage += record.TotalUsage;
        totalImbalance += record.totalforecastimbal;
        totalPenalty += record.TotalPenalty;
  
        tableRows += `
          <tr>
            <td>${date}</td>
            <td>${pipeline}</td>
            <td>${record.TotalNominations}</td>
            <td>${record.Group}</td>
            <td>${record.TotalNominationAllocations}</td>
            <td>${record.DailyRequiredVolume}</td>
            <td>${record.TotalUsage}</td>
            <td>${record.totalforecastimbal}</td>
            <td>${record.TotalPenalty}</td>
          </tr>
        `;
      });
  
      // Add total row
      tableRows += `
        <tr class="total">
          <td>${date}</td>
          <td><b>Total</b></td>
          <td><b>${totalNoms}</b></td>
          <td></td>
          <td><b>${totalGroupNoms}</b></td>
          <td><b>${totalDRV}</b></td>
          <td><b>${totalUsage}</b></td>
          <td><b>${totalImbalance}</b></td>
          <td><b>${totalPenalty}</b></td>
        </tr>
      `;
    });
  
    const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nomination Compliance Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h2 { text-align: center; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #000; padding: 8px; text-align: center; }
      th { background-color: #0A2849; color: white; }
      tr:nth-child(even) { background-color: #f2f2f2; }
      .total { font-weight: bold; background-color: #e0e0e0; }
    </style>
  </head>
  <body>
  
    <h2>Nomination Compliance Report</h2>
  
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Pipeline</th>
          <th>Nomination by pipeline (Dth)</th>
          <th>Group</th>
          <th>Nomination by Group</th>
          <th>Forecast DRV</th>
          <th>Usage / Actual DRV (Dth)</th>
          <th>Forecast imbalance (Dth)</th>
          <th>Penalty ($)</th>
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
    link.download = "Nomination_Compliance_Report.html";
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
          saveAs(blob, "DC_Nomination_Report.tiff");
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

export default NominationComplianceDownload;
