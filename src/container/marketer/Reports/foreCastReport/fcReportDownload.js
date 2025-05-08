import React, { useState } from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { materialsymbolsdownload } from 'images';
import html2canvas from 'html2canvas'


const FCReportDownload = ({ data, subtotal }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit' });

    const getUniqueDates = () => {
        const unique = [...new Set(data.map((d) => formatDate(d.ShipmentDate)))];
        return unique.slice(0, 5); // First 5 unique dates
    };

    const getGroupNames = () => {
        const groups = [...new Set(data.map((item) => item.Name))];
        return groups;
    };

    const generateTableData = () => {
        const dates = getUniqueDates();
        const groupNames = getGroupNames();
        const tableHeaders = ["Group", ...dates];
        const tableBody = groupNames.map((group) => {
            const row = [group];
            dates.forEach((date) => {
                const match = data.find(
                    (d) => d.Name === group && formatDate(d.ShipmentDate) === date
                );
                row.push(match ? match.DailyRequiredVolume : '-');
            });
            return row;
        });

        const subtotalTypes = [
            { key: "SubTotalByFirm", label: "SubTotalByFirm" },
            { key: "SubTotalByInterruptible", label: "SubTotalByInterruptible" },
            { key: "BothSubTotal", label: "Total" }
        ];

        subtotalTypes.forEach(({ key, label }) => {
            const row = [label];
            dates.forEach(date => {
                const match = subtotal.find(s => formatDate(s.SubTotalDate) === date);
                row.push(match && match[key] !== undefined ? match[key] : '-');
            });
            tableBody.push(row);
        });

        return { tableHeaders, tableBody };
    };

    const downloadPDF = () => {
        if (!data || data.length === 0) return;

        const doc = new jsPDF();
        const marketerName = data[0]?.MarketerName || 'N/A';
        const dates = getUniqueDates();
        const currentDate = new Date();

        doc.setFontSize(16);
        doc.text("5 Days Requirement Forecast Report", 14, 20);
        doc.setFontSize(12);
        doc.text(`Marketer Name: ${marketerName}`, 14, 30);
        doc.text(`Date Range: ${dates[0]} to ${dates[dates.length - 1]}`, 14, 38);
        doc.text(`Date Published: ${formatDate(currentDate)}`, 14, 46);

        const { tableHeaders, tableBody } = generateTableData();

        doc.autoTable({
            startY: 55,
            head: [tableHeaders],
            body: tableBody,
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: '#0F3557',
                textColor: 'white',
                fontStyle: 'bold',
            },
            didParseCell: function (data) {
                const rowIndex = data.row.index;
                const isSubtotalRow = rowIndex >= getGroupNames().length;

                if (isSubtotalRow) {
                    data.cell.styles.fillColor = '#0F3557';
                    data.cell.styles.textColor = 'white';
                    data.cell.styles.fontStyle = 'bold';
                }
            },
            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(10);
                doc.text('Forecast Quantity: Dth Dry', doc.internal.pageSize.width - 60, pageHeight - 10);
            },
        });

        doc.save("5_Days_Requirement_Forecast_Report.pdf");
    };

    const downloadExcel = () => {
        const { tableHeaders, tableBody } = generateTableData();
        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableBody]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "5_Days_Requirement_Forecast_Report.xlsx");
    };

    const downloadCSV = () => {
        const { tableHeaders, tableBody } = generateTableData();
        const csvContent = [tableHeaders, ...tableBody].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, "5_Days_Requirement_Forecast_Report.csv");
    };

    const downloadXML = () => {
        const { tableHeaders, tableBody } = generateTableData();
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Report>\n';
        tableBody.forEach(row => {
            xmlContent += '  <Row>\n';
            row.forEach((cell, index) => {
                xmlContent += `    <${tableHeaders[index]}>${cell}</${tableHeaders[index]}>\n`;
            });
            xmlContent += '  </Row>\n';
        });
        xmlContent += '</Report>';
        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
        saveAs(blob, "5_Days_Requirement_Forecast_Report.xml");
    };

    const downloadWordDocument = () => {
        if (!data || data.length === 0) return;
    
        const { tableHeaders, tableBody } = generateTableData();
    
        const marketerName = data[0]?.MarketerName || "N/A";
        const firstDate = new Date(data[0]?.ShipmentDate);
        const dateRangeStart = new Date(firstDate);
        const dateRangeEnd = new Date(firstDate);
        dateRangeEnd.setDate(dateRangeEnd.getDate() + 4); // 5-day range
    
        const format = (date) =>
            new Date(date).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
    
        const publishedDate = format(new Date());
    
        let docContent = `
            <html>
            <head>
                <title>5 Days Requirement Forecast Report</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                    th { background-color: #0F3557; color: white; }
                    .subtotal { background-color: #0F3557; color: white; font-weight: bold; }
                    .footer { position: fixed; bottom: 10px; right: 10px; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1 style="text-align: left;">5 Days Requirement Forecast Report</h1>
                <p><strong>Marketer Name:</strong> ${marketerName}</p>
                <p><strong>Date Range:</strong> ${format(dateRangeStart)} to ${format(dateRangeEnd)}</p>
                <p><strong>Published Date:</strong> ${publishedDate}</p>
                <table>
                    <thead>
                        <tr>
                            ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableBody
                            .map(row => {
                                const isSubtotal = ["SubTotalByFirm", "SubTotalByInterruptible", "Total"].includes(row[0]);
                                return `<tr class="${isSubtotal ? 'subtotal' : ''}">
                                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                                </tr>`;
                            })
                            .join('')}
                    </tbody>
                </table>
                <div class="footer">Forecast Quantity: Dth Dry</div>
            </body>
            </html>
        `;
    
        const blob = new Blob([docContent], {
            type: "application/msword;charset=utf-8;",
        });
    
        saveAs(blob, "5_Days_Requirement_Forecast_Report.doc");
    };
    
    


    const downloadHTML = () => {
        const { tableHeaders, tableBody } = generateTableData();
        let htmlContent = '<html><head><title>5 Days Requirement Forecast Report</title></head><body>';
        htmlContent += '<h1>5 Days Requirement Forecast Report</h1>';
        htmlContent += '<table border="1"><thead><tr>';
        tableHeaders.forEach(header => {
            htmlContent += `<th>${header}</th>`;
        });
        htmlContent += '</tr></thead><tbody>';
        tableBody.forEach(row => {
            htmlContent += '<tr>';
            row.forEach(cell => {
                htmlContent += `<td>${cell}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody></table>';
        htmlContent += '<p>Forecast Quantity: Dth Dry</p>';
        htmlContent += '</body></html>';
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
        saveAs(blob, "5_Days_Requirement_Forecast_Report.html");
    };

    const exportTIFF = async () => {
        const tableElement = document.getElementById('table-container1');

        if (!tableElement) {
            console.error('Table element not found!');
            return;
        }

        try {
            const canvas = await html2canvas(tableElement, { scale: 2 });
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, '5_Days_Requirement_Forecast_Report.tiff');
                } else {
                    console.error('Failed to create TIFF blob.');
                }
            }, 'image/tiff');
        } catch (error) {
            console.error('Error capturing table:', error);
        }
    };


    // const downloadPDF = () => {
    //     if (!data || data.length === 0) return;

    //     const doc = new jsPDF();
    //     const marketerName = data[0]?.MarketerName || 'N/A';
    //     const dates = getUniqueDates();
    //     const currentDate = new Date();

    //     // Header text
    //     doc.setFontSize(16);
    //     doc.text("5 Days Requirement Forecast Report", 14, 20);
    //     doc.setFontSize(12);
    //     doc.text(`Marketer Name: ${marketerName}`, 14, 30);
    //     doc.text(`Date Range: ${dates[0]} to ${dates[dates.length - 1]}`, 14, 38);
    //     doc.text(`Date Published: ${formatDate(currentDate)}`, 14, 46);

    //     const tableHeaders = ["Group", ...dates];
    //     const groupNames = getGroupNames();

    //     const tableBody = groupNames.map((group) => {
    //         const row = [group];
    //         dates.forEach((date) => {
    //             const match = data.find(
    //                 (d) => d.Name === group && formatDate(d.ShipmentDate) === date
    //             );
    //             row.push(match ? match.DailyRequiredVolume : '-');
    //         });
    //         return row;
    //     });

    //     // Add subtotal rows with proper label and style
    //     const subtotalTypes = [
    //         { key: "SubTotalByFirm", label: "SubTotalByFirm" },
    //         { key: "SubTotalByInterruptible", label: "SubTotalByInterruptible" },
    //         { key: "BothSubTotal", label: "Total" }
    //     ];

    //     subtotalTypes.forEach(({ key, label }) => {
    //         const row = [label];
    //         dates.forEach(date => {
    //             const match = subtotal.find(s => formatDate(s.SubTotalDate) === date);
    //             row.push(match && match[key] !== undefined ? match[key] : '-');
    //         });
    //         tableBody.push(row);
    //     });

    //     doc.autoTable({
    //         startY: 55,
    //         head: [tableHeaders],
    //         body: tableBody,
    //         styles: {
    //             fontSize: 10,
    //             cellPadding: 2,
    //         },
    //         headStyles: {
    //             fillColor: '#0F3557',
    //             textColor: 'white',
    //             fontStyle: 'bold',
    //         },
    //         didParseCell: function (data) {
    //             const rowIndex = data.row.index;
    //             const isSubtotalRow = rowIndex >= groupNames.length;

    //             if (isSubtotalRow) {
    //                 // Apply same style as table header
    //                 data.cell.styles.fillColor = '#0F3557';
    //                 data.cell.styles.textColor = 'white';
    //                 data.cell.styles.fontStyle = 'bold';
    //             }
    //         },
    //         didDrawPage: function (data) {
    //             const pageHeight = doc.internal.pageSize.height;
    //             doc.setFontSize(10);
    //             doc.text('Forecast Quantity: Dth Dry', doc.internal.pageSize.width - 60, pageHeight - 10);
    //         },
    //     });

    //     doc.save("5_Days_Requirement_Forecast_Report.pdf");
    // };



    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary"
                onClick={handleClick}
                disabled={!data || data.length === 0}
            >
                <img src={materialsymbolsdownload} alt="Download" style={{ marginRight: 6 }} />
                Download
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); downloadExcel(); }}>Excel</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadCSV(); }}>CSV</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadPDF(); }}>PDF</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadXML(); }}>XML</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadWordDocument(); }}>Word</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadHTML(); }}>MHTML</MenuItem>
                <MenuItem onClick={() => { handleClose(); exportTIFF(); }}>TIFF</MenuItem>
            </Menu>
        </>
    );
};

export default FCReportDownload;
