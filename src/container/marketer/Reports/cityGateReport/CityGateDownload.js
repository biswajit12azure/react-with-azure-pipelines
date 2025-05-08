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
const CityGateReportDownload = ({
  data,
  fileName = "Supply by City Gate Report",
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
    doc.text("Supply by City Gate Report", 14, 10);

    const tableColumnHeaders = [
      "Marketer",
      "Columbia",
      "Transco",
      "Dominion",
      "Cove Pt",
      "Transco Z6",
      "TCO Transit",
      "Total",
    ];
    const tableRows = [];

    data.forEach((item) => {
      const row = [];

      // Marketer name
      row.push({ content: item.ShortName, styles: { fontStyle: "bold" } });

      // Columbia
      row.push(
        `${
          item.isTotalRow
            ? item.children[0]?.PipeLineTotal.toLocaleString()
            : item.children[0]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[0]?.NominationPercentGroupWise.toFixed(2)
            : item.children[0]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );

      // Transco
      row.push(
        `${
          item.isTotalRow
            ? item.children[3]?.PipeLineTotal.toLocaleString()
            : item.children[3]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[3]?.NominationPercentGroupWise.toFixed(2)
            : item.children[3]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );

      // Dominion
      row.push(
        `${
          item.isTotalRow
            ? item.children[2]?.PipeLineTotal.toLocaleString()
            : item.children[2]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[2]?.NominationPercentGroupWise.toFixed(2)
            : item.children[2]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      //   Cove Pt
      row.push(
        `${
          item.isTotalRow
            ? item.children[1]?.PipeLineTotal.toLocaleString()
            : item.children[1]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[1]?.NominationPercentGroupWise.toFixed(2)
            : item.children[1]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      // Transco Z6
      row.push(
        `${
          item.isTotalRow
            ? item.children[4]?.PipeLineTotal.toLocaleString()
            : item.children[4]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[4]?.NominationPercentGroupWise.toFixed(2)
            : item.children[4]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      // TCO Transit

      row.push(
        `${
          item.isTotalRow
            ? item.children[5]?.PipeLineTotal.toLocaleString()
            : item.children[5]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[5]?.NominationPercentGroupWise.toFixed(2)
            : item.children[5]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      // Total

      row.push(
        `${
          item.isTotalRow
            ? item.GrandTotal.toLocaleString()
            : item.TotalByShortName.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.NominationPercentageOverall.toFixed(2)
            : item.NominationPercentageSum.toFixed(2)
        } %`
      );
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

    doc.save("Supply_by_City_Gate_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = [
      ["Supply by City Gate Report"], // Report Title
      [], // Empty Row
      [
        "Marketer",
        "Columbia",
        "Transco",
        "Dominion",
        "Cove Pt",
        "Transco Z6",
        "TCO Transit",
        "Total",
      ], // Table Headers
    ];

    data.forEach((item) => {
      const row = [];

      // Marketer name
      row.push(item.ShortName);
      row.push({
        v: `${
          item.isTotalRow
            ? item.children[0]?.PipeLineTotal.toLocaleString()
            : item.children[0]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[0]?.NominationPercentGroupWise.toFixed(2)
            : item.children[0]?.NominationPercentageByShortName.toFixed(2)
        } %`,
        s: {
          alignment: {
            wrapText: true,
            horizontal: "center",
            vertical: "right",
          },
        },
      });

      // Nomination for each pipeline
      row.push(
        `${
          item.isTotalRow
            ? item.children[3]?.PipeLineTotal.toLocaleString()
            : item.children[3]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[3]?.NominationPercentGroupWise.toFixed(2)
            : item.children[3]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );

      // Percentage of Nomination
      row.push(
        `${
          item.isTotalRow
            ? item.children[2]?.PipeLineTotal.toLocaleString()
            : item.children[2]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[2]?.NominationPercentGroupWise.toFixed(2)
            : item.children[2]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );

      // Total pipeline nomination
      row.push(
        `${
          item.isTotalRow
            ? item.children[1]?.PipeLineTotal.toLocaleString()
            : item.children[1]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[1]?.NominationPercentGroupWise.toFixed(2)
            : item.children[1]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      //   Pipeline Nomination percentage
      row.push(
        `${
          item.isTotalRow
            ? item.children[4]?.PipeLineTotal.toLocaleString()
            : item.children[4]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[4]?.NominationPercentGroupWise.toFixed(2)
            : item.children[4]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      row.push(
        `${
          item.isTotalRow
            ? item.children[5]?.PipeLineTotal.toLocaleString()
            : item.children[5]?.TotalNomination.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.children[5]?.NominationPercentGroupWise.toFixed(2)
            : item.children[5]?.NominationPercentageByShortName.toFixed(2)
        } %`
      );
      row.push(
        `${
          item.isTotalRow
            ? item.GrandTotal.toLocaleString()
            : item.TotalByShortName.toLocaleString()
        }\n${
          item.isTotalRow
            ? item.NominationPercentageOverall.toFixed(2)
            : item.NominationPercentageSum.toFixed(2)
        } %`
      );

      worksheetData.push(row);
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 30 }, // Marketer
      { wch: 20 }, // Columbia
      { wch: 20 }, // Transco
      { wch: 20 }, // Dominion
      { wch: 20 }, // Cove Pt
      { wch: 20 }, // Transco Z6
      { wch: 20 }, // TCO Transit
      { wch: 20 }, // Total
    ];

    // Merge the title across all columns
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Supply by City Gate Report"
    );
    XLSX.writeFile(workbook, "City_Gate_Report.xlsx");
  };

  const downloadCSV = () => {
    try {
      const headers = [
        "Marketer",
        "Columbia",
        "Transco",
        "Dominion",
        "Cove Pt",
        "Transco Z6",
        "TCO Transit",
        "Total",
      ];

      const csvRows = [headers.join(",")]; // Header row

      data.forEach((item) => {
        const row = [];

        const formatCell = (total, percent) =>
          `"${(total || 0).toLocaleString()}\n${(percent || 0).toFixed(2)} %"`; // Wrap in quotes

        // Marketer
        row.push(`"${item.ShortName}"`);

        // Columbia
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[0]?.PipeLineTotal
              : item.children[0]?.TotalNomination,
            item.isTotalRow
              ? item.children[0]?.NominationPercentGroupWise
              : item.children[0]?.NominationPercentageByShortName
          )
        );

        // Transco
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[3]?.PipeLineTotal
              : item.children[3]?.TotalNomination,
            item.isTotalRow
              ? item.children[3]?.NominationPercentGroupWise
              : item.children[3]?.NominationPercentageByShortName
          )
        );

        // Dominion
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[2]?.PipeLineTotal
              : item.children[2]?.TotalNomination,
            item.isTotalRow
              ? item.children[2]?.NominationPercentGroupWise
              : item.children[2]?.NominationPercentageByShortName
          )
        );

        // Cove Pt
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[1]?.PipeLineTotal
              : item.children[1]?.TotalNomination,
            item.isTotalRow
              ? item.children[1]?.NominationPercentGroupWise
              : item.children[1]?.NominationPercentageByShortName
          )
        );

        // Transco Z6
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[4]?.PipeLineTotal
              : item.children[4]?.TotalNomination,
            item.isTotalRow
              ? item.children[4]?.NominationPercentGroupWise
              : item.children[4]?.NominationPercentageByShortName
          )
        );

        // TCO Transit
        row.push(
          formatCell(
            item.isTotalRow
              ? item.children[5]?.PipeLineTotal
              : item.children[5]?.TotalNomination,
            item.isTotalRow
              ? item.children[5]?.NominationPercentGroupWise
              : item.children[5]?.NominationPercentageByShortName
          )
        );

        // Total
        row.push(
          formatCell(
            item.isTotalRow ? item.GrandTotal : item.TotalByShortName,
            item.isTotalRow
              ? item.NominationPercentageOverall
              : item.NominationPercentageSum
          )
        );

        csvRows.push(row.join(","));
      });

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Supply_by_City_Gate_Report.csv");
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

      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<CityGateReallocationReport>\n`;

      data.forEach((item) => {
        xmlString += `  <Record>\n`;
        xmlString += `    <Marketer>${escapeXML(item.ShortName)}</Marketer>\n`;
        xmlString += `    <Columbia>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[0]?.PipeLineTotal.toLocaleString()
                : item.children[0]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[0]?.NominationPercentGroupWise.toFixed(2)
                : item.children[0]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</Columbia>\n`;
        xmlString += `    <Transco>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[3]?.PipeLineTotal.toLocaleString()
                : item.children[3]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[3]?.NominationPercentGroupWise.toFixed(2)
                : item.children[3]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</Transco>\n`;
        xmlString += `    <Dominion>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[2]?.PipeLineTotal.toLocaleString()
                : item.children[2]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[2]?.NominationPercentGroupWise.toFixed(2)
                : item.children[2]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</Dominion>\n`;
        xmlString += `    <CovePt>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[1]?.PipeLineTotal.toLocaleString()
                : item.children[1]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[1]?.NominationPercentGroupWise.toFixed(2)
                : item.children[1]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</CovePt>\n`;
        xmlString += `    <TranscoZ6>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[4]?.PipeLineTotal.toLocaleString()
                : item.children[4]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[4]?.NominationPercentGroupWise.toFixed(2)
                : item.children[4]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</TranscoZ6>\n`;
        xmlString += `    <TCOTransit>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.children[5]?.PipeLineTotal.toLocaleString()
                : item.children[5]?.TotalNomination.toLocaleString()
            },${
              item.isTotalRow
                ? item.children[5]?.NominationPercentGroupWise.toFixed(2)
                : item.children[5]?.NominationPercentageByShortName.toFixed(2)
            } %`
          )
        )}</TCOTransit>\n`;
        xmlString += `    <Total>${escapeXML(
          String(
            `${
              item.isTotalRow
                ? item.GrandTotal.toLocaleString()
                : item.TotalByShortName.toLocaleString()
            },${
              item.isTotalRow
                ? item.NominationPercentageOverall.toFixed(2)
                : item.NominationPercentageSum.toFixed(2)
            } %`
          )
        )}</Total>\n`;
        xmlString += `  </Record>\n`;
      });

      xmlString += `</CityGateReallocationReport>`;

      // Convert string to Blob
      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8;",
      });

      // Ensure `saveAs` is used correctly
      saveAs(blob, "Supply_by_City_Gate_Report.xml");
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
      "Columbia",
      "Transco",
      "Dominion",
      "Cove Pt",
      "Transco Z6",
      "TCO Transit",
      "Total",
    ];

    // Convert data into rows
    const rows = data.map((item) => [
      item.ShortName,
      `${
        item.isTotalRow
          ? item.children[0]?.PipeLineTotal.toLocaleString()
          : item.children[0]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[0]?.NominationPercentGroupWise.toFixed(2)
          : item.children[0]?.NominationPercentageByShortName.toFixed(2)
      } %`, // Marketer
      `${
        item.isTotalRow
          ? item.children[3]?.PipeLineTotal.toLocaleString()
          : item.children[3]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[3]?.NominationPercentGroupWise.toFixed(2)
          : item.children[3]?.NominationPercentageByShortName.toFixed(2)
      } %`,
      `${
        item.isTotalRow
          ? item.children[2]?.PipeLineTotal.toLocaleString()
          : item.children[2]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[2]?.NominationPercentGroupWise.toFixed(2)
          : item.children[2]?.NominationPercentageByShortName.toFixed(2)
      } %`,
      `${
        item.isTotalRow
          ? item.children[1]?.PipeLineTotal.toLocaleString()
          : item.children[1]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[1]?.NominationPercentGroupWise.toFixed(2)
          : item.children[1]?.NominationPercentageByShortName.toFixed(2)
      } %`,
      `${
        item.isTotalRow
          ? item.children[4]?.PipeLineTotal.toLocaleString()
          : item.children[4]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[4]?.NominationPercentGroupWise.toFixed(2)
          : item.children[4]?.NominationPercentageByShortName.toFixed(2)
      } %`,
      `${
        item.isTotalRow
          ? item.children[5]?.PipeLineTotal.toLocaleString()
          : item.children[5]?.TotalNomination.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.children[5]?.NominationPercentGroupWise.toFixed(2)
          : item.children[5]?.NominationPercentageByShortName.toFixed(2)
      } %`,
      `${
        item.isTotalRow
          ? item.GrandTotal.toLocaleString()
          : item.TotalByShortName.toLocaleString()
      }  ${
        item.isTotalRow
          ? item.NominationPercentageOverall.toFixed(2)
          : item.NominationPercentageSum.toFixed(2)
      } %`,
    ]);

    // Create Word Table Rows
    const tableRows = rows.map(
      (row) =>
        new TableRow({
          children: row.map((cell) => {
            // Split the cell content manually by space (or other criteria) to handle line breaks
            const paragraphs = cell.split("  ").map((line, idx) => {
              if (idx === 0) {
                return new Paragraph(line.trim()); // First part (before "%")
              }
              return new Paragraph(`${line.trim()} `); // Add back the "%" after splitting
            });

            return new TableCell({
              children: paragraphs,
              width: { size: 20, type: WidthType.PERCENTAGE },
            });
          }),
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
                width: { size: 15, type: WidthType.PERCENTAGE },
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
              text: "Supply by City Gate Report",
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
        saveAs(blob, "Supply_by_City_Gate_Report.docx");
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

    // Group data by marketer
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.marketer]) acc[row.marketer] = [];
      acc[row.marketer].push(row);
      return acc;
    }, {});

    // Generate table rows
    Object.keys(groupedData).forEach((marketer) => {
      const rows = groupedData[marketer];

      rows.forEach((row, index) => {
        // Ensure values are properly accessed and handled
        const marketer = row.ShortName || "N/A";
        const Columbia = `${
          row.isTotalRow
            ? row.children[0].PipeLineTotal.toLocaleString()
            : row.children[0].TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[0]?.NominationPercentGroupWise.toFixed(2)
            : row.children[0]?.NominationPercentageByShortName.toFixed(2)
        } %`;
        const Transco = `${
          row.isTotalRow
            ? row.children[3]?.PipeLineTotal.toLocaleString()
            : row.children[3]?.TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[3]?.NominationPercentGroupWise.toFixed(2)
            : row.children[3]?.NominationPercentageByShortName.toFixed(2)
        } %`;
        const Dominion = `${
          row.isTotalRow
            ? row.children[2]?.PipeLineTotal.toLocaleString()
            : row.children[2]?.TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[2]?.NominationPercentGroupWise.toFixed(2)
            : row.children[2]?.NominationPercentageByShortName.toFixed(2)
        } %`;
        const CovePt = `${
          row.isTotalRow
            ? row.children[1]?.PipeLineTotal.toLocaleString()
            : row.children[1]?.TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[1]?.NominationPercentGroupWise.toFixed(2)
            : row.children[1]?.NominationPercentageByShortName.toFixed(2)
        } %`;
        const TranscoZ6 = `${
          row.isTotalRow
            ? row.children[4]?.PipeLineTotal.toLocaleString()
            : row.children[4]?.TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[4]?.NominationPercentGroupWise.toFixed(2)
            : row.children[4]?.NominationPercentageByShortName.toFixed(2)
        } %`;
        const TCOTransit = `${
          row.isTotalRow
            ? row.children[5]?.PipeLineTotal.toLocaleString()
            : row.children[5]?.TotalNomination.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.children[5]?.NominationPercentGroupWise.toFixed(2)
            : row.children[5]?.NominationPercentageByShortName.toFixed(2) || 0
        } %`;
        const Total = `${
          row.isTotalRow
            ? row.GrandTotal.toLocaleString()
            : row.TotalByShortName.toLocaleString()
        }<br>${
          row.isTotalRow
            ? row.NominationPercentageOverall.toFixed(2)
            : row.NominationPercentageSum.toFixed(2)
        } %`;

        tableRows += `
                    <tr>
                        
                        <td>${marketer}</td>
                        <td>${Columbia}</td>
                        <td>${Transco}</td>
                        <td>${Dominion}</td>
                        <td>${CovePt}</td>
                        <td>${TranscoZ6}</td>
                        <td>${TCOTransit}</td>
                        <td>${Total}</td>
                       
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
            <title>Supply by City Gate Report</title>
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
    
            <h2>Supply by City Gate Report</h2>
    
            <table>
                <thead>
                    <tr>
                        <th>Marketer</th>
                        <th>Columbia</th>
                        <th>Transco</th>
                        <th>Dominion</th>
                        <th>Cove Pt</th>
                        <th>Transco Z6</th>
                        <th>TCO Transit</th>
                        <th>Total</th>
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
    link.download = "Supply_by_City_Gate_Report.html";
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
          saveAs(blob, "CityGate_Nomination_Report.tiff");
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

export default CityGateReportDownload;
