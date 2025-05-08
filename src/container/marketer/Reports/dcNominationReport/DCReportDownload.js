import React, { useState } from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { materialsymbolsdownload } from 'images';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType } from "docx";
const DCReportDownload = ({ data,fileName="DC Reallocation Report",tableRef }) => {

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
        doc.text("DC Reallocation Report", 14, 10);
    
        const tableColumnHeaders = ["Marketer", "Customer Account #", "Reallocated Volume", "Total Reallocated Volume", "Total DC Nomination"];
        const tableRows = [];
    
        data.forEach((item) => {
            if (item.isTotal) {
                // Total row (fully spans columns correctly)
                tableRows.push([
                    { content: "Total", colSpan: 2, styles: { fontStyle: "bold", halign: "left" } },
                    { content: item.CustomerReallocatedVolume, styles: { fontStyle: "bold" } },
                    { content: item.TotalReallocatedVolume, styles: { fontStyle: "bold" } },
                    { content: item.TotalDCNomination, styles: { fontStyle: "bold" } },
                ]);
            } else {
                const row = [];
    
                // Ensure correct marketer alignment
                if (!item.HideMarketer) {
                    row.push({ content: item.MarketerName, rowSpan: item.RowSpan || 1, styles: { fontStyle: "bold" } });
                } else {
                    row.push(); // Placeholder to maintain structure
                }
    
                // Customer Account
                row.push({ content: item.CustomerAccount });
    
                // Reallocated Volume
                row.push({ content: item.CustomerReallocatedVolume });
    
                // Ensure correct alignment of Total Reallocated Volume and DC Nomination
                if (!item.HideMarketer) {
                    row.push(
                        { content: item.TotalReallocatedVolume, rowSpan: item.RowSpan || 1, styles: { fontStyle: "bold" } },
                        { content: item.TotalDCNomination, rowSpan: item.RowSpan || 1, styles: { fontStyle: "bold" } }
                    );
                } else {
                    // Keep correct column structure even when marketer is hidden
                    row.push("", ""); // Empty placeholders
                }
    
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
    
        doc.save("DC_Reallocation_Report.pdf");
    };
    
    const downloadExcel = () => {
        const worksheetData = [
            ["DC Reallocation Report"], // Report Title
            [], // Empty Row
            ["Marketer", "Customer Account #", "Reallocated Volume", "Total Reallocated Volume", "Total DC Nomination"], // Table Headers
        ];
    
        data.forEach((item) => {
            if (item.isTotal) {
                // Total row (styled similarly to the PDF function)
                worksheetData.push([
                    "Total", // Merged Marketer
                    "", // Empty placeholder for Customer Account
                    item.CustomerReallocatedVolume,
                    item.TotalReallocatedVolume,
                    item.TotalDCNomination,
                ]);
            } else {
                const row = [];
    
                // Ensure correct marketer alignment
                if (!item.HideMarketer) {
                    row.push(item.MarketerName);
                } else {
                    row.push(""); // Placeholder for hidden marketer
                }
    
                // Customer Account
                row.push(item.CustomerAccount);
    
                // Reallocated Volume
                row.push(item.CustomerReallocatedVolume);
    
                // Ensure correct alignment of Total Reallocated Volume and DC Nomination
                if (!item.HideMarketer) {
                    row.push(item.TotalReallocatedVolume, item.TotalDCNomination);
                } else {
                    row.push("", ""); // Empty placeholders
                }
    
                worksheetData.push(row);
            }
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
            { wch: 25 }, // Total DC Nomination
        ];
    
        // Merge the title across all columns
        worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    
        XLSX.utils.book_append_sheet(workbook, worksheet, "DC Reallocation Report");
        XLSX.writeFile(workbook, "DC_Reallocation_Report.xlsx");
    };
     
    const downloadCSV = () => {
        try {
            // Define CSV Headers
            const headers = ["Marketer", "Customer Account #", "Reallocated Volume", "Total Reallocated Volume", "Total DC Nomination"];
    
            // Convert Data to CSV Format
            const csvRows = [headers.join(",")]; // Add header row
    
            data.forEach((item) => {
                if (item.isTotal) {
                    csvRows.push([
                        "Total", // Total row
                        "",
                        item.CustomerReallocatedVolume,
                        item.TotalReallocatedVolume,
                        item.TotalDCNomination
                    ].join(","));
                } else {
                    csvRows.push([
                        item.HideMarketer ? "" : item.MarketerName, // Marketer (if hidden, add empty space)
                        `\t${item.CustomerAccount}`,
                        item.CustomerReallocatedVolume,
                        item.TotalReallocatedVolume || "", // Ensure correct alignment
                        item.TotalDCNomination || ""
                    ].join(","));
                }
            });
    
            // Convert Array to CSV String
            const csvString = csvRows.join("\n");
    
            // Create Blob and Download
            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "DC_Reallocation_Report.csv");
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
    
            let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<DCReallocationReport>\n`;
    
            data.forEach((item) => {
                xmlString += `  <Record>\n`;
                xmlString += `    <Marketer>${escapeXML(item.HideMarketer ? "" : item.MarketerName)}</Marketer>\n`;
                xmlString += `    <CustomerAccount>${escapeXML(item.CustomerAccount)}</CustomerAccount>\n`; // Ensure correct encoding
                xmlString += `    <ReallocatedVolume>${escapeXML(String(item.CustomerReallocatedVolume))}</ReallocatedVolume>\n`;
                xmlString += `    <TotalReallocatedVolume>${escapeXML(String(item.TotalReallocatedVolume || ""))}</TotalReallocatedVolume>\n`;
                xmlString += `    <TotalDCNomination>${escapeXML(String(item.TotalDCNomination || ""))}</TotalDCNomination>\n`;
                xmlString += `  </Record>\n`;
            });
    
            xmlString += `</DCReallocationReport>`;
    
            // Convert string to Blob
            const blob = new Blob([xmlString], { type: "application/xml;charset=utf-8;" });
    
            // Ensure `saveAs` is used correctly
            saveAs(blob, "DC_Reallocation_Report.xml");
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
        const headers = ["Marketer", "Customer Account #", "Reallocated Volume", "Total Reallocated Volume", "Total DC Nomination"];
        
        // Convert data into rows
        const rows = data.map((item) => [
            item.HideMarketer ? "" : item.MarketerName,
            item.CustomerAccount,
            item.CustomerReallocatedVolume,
            item.TotalReallocatedVolume || "",
            item.TotalDCNomination || "",
        ]);
    
        // Create Word Table Rows
        const tableRows = rows.map((row) =>
            new TableRow({
                children: row.map((cell) =>
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
                    children: headers.map((header) =>
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
                            text: "DC Reallocation Report",
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
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "DC_Reallocation_Report.docx");
        }).catch(error => {
            console.error("Error generating Word document:", error);
        });
    };
    
    // const downloadMHTML = () => {
    //     const htmlContent = `<!DOCTYPE html>
    //     <html>
    //     <head>
    //       <meta http-equiv="Content-Type" content="text/html" charset="utf-8">
    //       <title>DC Reallocation Report</title>
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
    //     saveAs(blob, "DC_Reallocation_Report.mhtml");
    // };
    
    // const downloadHTML = () => {
    //     const htmlContent = `<!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>DC Reallocation Report</title>
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
    
    //         <h2>DC Reallocation Report</h2>
    
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>Marketer</th>
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
    //     link.download = "DC_Reallocation_Report.html";
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
                const customerAccount = row.customerAccount || "N/A";
                const reallocatedVolume = row.reallocatedVolume || 0;
                const totalDCNomination = row.totalDCNomination || 0;
    
                marketerTotalReallocated += reallocatedVolume;
                marketerTotalDCNomination += totalDCNomination;
    
                tableRows += `
                    <tr>
                        ${index === 0 ? `<td rowspan="${rows.length}"><b>${marketer}</b></td>` : ""}
                        <td>${customerAccount}</td>
                        <td>${reallocatedVolume}</td>
                        ${index === 0 ? `<td rowspan="${rows.length}"><b>${marketerTotalReallocated}</b></td>` : ""}
                        ${index === 0 ? `<td rowspan="${rows.length}"><b>${marketerTotalDCNomination}</b></td>` : ""}
                    </tr>
                `;
            });
    
            grandTotalReallocated += marketerTotalReallocated;
            grandTotalDCNomination += marketerTotalDCNomination;
        });
    
        // Add total row
        tableRows += `
            <tr class="total">
                <td colspan="2"><b>Total</b></td>
                <td><b>${grandTotalReallocated}</b></td>
                <td><b>${grandTotalReallocated}</b></td>
                <td><b>${grandTotalDCNomination}</b></td>
            </tr>
        `;
    
        // Create the full HTML document
        const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DC Reallocation Report</title>
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
    
            <h2>DC Reallocation Report</h2>
    
            <table>
                <thead>
                    <tr>
                        <th>Marketer</th>
                        <th>Customer Account #</th>
                        <th>Reallocated Volume</th>
                        <th>Total Reallocated Volume</th>
                        <th>Total DC Nomination</th>
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
        link.download = "DC_Reallocation_Report.html";
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
            const tableElement = document.getElementById('table-container');
          
            if (!tableElement) {
              console.error('Table element not found!');
              return;
            }
          
            try {
              const canvas = await html2canvas(tableElement);
              canvas.toBlob((blob) => {
                if (blob) {
                  saveAs(blob, 'DC_Nomination_Report.tiff');
                } else {
                  console.error('Failed to create TIFF blob.');
                }
              }, 'image/png');
            } catch (error) {
              console.error('Error capturing table:', error);
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

export default DCReportDownload;