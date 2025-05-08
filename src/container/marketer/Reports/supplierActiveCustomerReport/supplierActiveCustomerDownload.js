import React, { useState } from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { materialsymbolsdownload, WGL_logo } from 'images';

const SupplierActiveCustomerDownload = ({ data ,tableRef }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const formatDate = (date) => dayjs(date).locale('en-gb').format('MM/DD/YYYY');
    const formatGasDayMonthYear = (date) => dayjs(date).locale('en-gb').format('MM/YYYY');

    const reportName = `Supplier Active Customers Report `
    const headers = [
        { header: 'Serv. Prov.', accessorKey: 'ServiceProvider' },
        { header: 'Rate cat.', accessorKey: 'RateCategory' },
        { header: 'BCIss', accessorKey: 'BCIss' },
        { header: 'Contract', accessorKey: 'Contract' },
        { header: 'Cont. Account', accessorKey: 'ContAccount' },
        { header: 'M/I Date', accessorKey: 'MIDate' },
        { header: 'M/O Date', accessorKey: 'MODate' },
        { header: 'Valid to', accessorKey: 'ValidTo' },
        { header: 'Portion', accessorKey: 'Portion' },
        { header: 'S. Type', accessorKey: 'SType' },
        { header: 'Low Income', accessorKey: 'LowIncome' },
    ];

    const downloadExcel = () => {
        if (!data?.supplierActiveCustomerReport) return;
    
        const reportTitleOnly = 'Supplier Active Customers Report';
    
        const wb = XLSX.utils.book_new();
    
        const wsData = [
            ['','Report',reportTitleOnly],                        
            ['', 'Washington Gas'],                    
            ['', `MarketerName:`, data?.marketerReportDtos?.[0]?.MarketerName || ''],
            ['', `Month & year:`, data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''],
            ['', `Date published:`, formatDate(new Date())],
            [],                                       
            headers.map(h => h.header),  
            ...data.supplierActiveCustomerReport.map(row =>
                headers.map(h => row[h.accessorKey])   // Table data
            ),
        ];
    
        const ws = XLSX.utils.aoa_to_sheet(wsData);
    
        // Optional: set column widths to ensure good display
        const columnWidths = headers.map(() => ({ wch: 15 }));
        ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 30 }, ...columnWidths]; // first few cols are for metadata lines
    
        XLSX.utils.book_append_sheet(wb, ws, 'Active Customers');
    
        saveAs(
            new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }),
            `${reportTitleOnly}.xlsx`
        );
    };
    

    const downloadCSV = () => {
        if (!data?.supplierActiveCustomerReport) return;
        const csvRows = [];
        csvRows.push(`${reportName}`);
        csvRows.push('Washington Gas');
        csvRows.push(`MarketerName:,${data?.marketerReportDtos?.[0]?.MarketerName || ''}`);
        csvRows.push(`Month & year:,${data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''}`);
        csvRows.push(`Date published:,${formatDate(new Date())}`);
        csvRows.push(''); // Empty row for spacing
        csvRows.push(headers.map(h => h.header).join(','));
        data.supplierActiveCustomerReport.forEach(row => {
            csvRows.push(headers.map(h => row[h.accessorKey]).join(','));
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${reportName}.csv`);
    };

    const downloadPDF = () => {
        if (!data?.supplierActiveCustomerReport) return;

        const doc = new jsPDF();
        const reportTitleOnly = 'Supplier Active Customers Report';
        const marketerName = `MarketerName: ${data?.marketerReportDtos?.[0]?.MarketerName || ''}`;
        const monthYear = `Month & year: ${data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''}`;
        const publishedDate = `Date published: ${formatDate(new Date())}`;
        const tableHeaders = headers.map(h => h.header);
        const tableData = data.supplierActiveCustomerReport.map(row => headers.map(h => row[h.accessorKey]));

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // === Report Title (Top-left) ===
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(reportTitleOnly, margin, 25);

        // === WGL Logo and Inline "Washington Gas" Text (Top-right) ===
        const logoWidth = 18; // slightly smaller
        const logoHeight = (WGL_logo && WGL_logo.height && WGL_logo.width)
            ? logoWidth * (WGL_logo.height / WGL_logo.width)
            : 12;

        const textFontSize = 10;
        doc.setFontSize(textFontSize);
        doc.setFont('helvetica', 'normal');

        const gasText = "Washington Gas";
        const gasTextWidth = doc.getTextWidth(gasText);

        const paddingBetweenLogoAndText = 4;

        const totalRightContentWidth = logoWidth + paddingBetweenLogoAndText + gasTextWidth;
        const rightX = pageWidth - margin - totalRightContentWidth;
        const topY = 18; // Y position for both logo and text

        // Add logo
        if (WGL_logo) {
            try {
                doc.addImage(WGL_logo, 'PNG', rightX, topY, logoWidth, logoHeight);
            } catch (error) {
                console.error("Error adding image to PDF:", error);
            }
        }

        // Add "Washington Gas" inline with logo
        const textX = rightX + logoWidth + paddingBetweenLogoAndText;
        const textY = topY + logoHeight / 2 + textFontSize / 2 - 1;
        doc.text(gasText, textX, textY);

        // === Report Metadata ===
        let yPosition = Math.max(topY + logoHeight, 35) + 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(marketerName, margin, yPosition);
        yPosition += 7;
        doc.text(monthYear, margin, yPosition);
        yPosition += 7;
        doc.text(publishedDate, margin, yPosition);
        yPosition += 10;

        // === Table ===
        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: yPosition,
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`${reportTitleOnly}.pdf`);
    };


    const downloadXML = () => {
        if (!data?.supplierActiveCustomerReport) return;
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ActiveCustomersReport>
    <ReportTitle>${reportName}</ReportTitle>
    <WashingtonGas>Washington Gas</WashingtonGas>
    <MarketerName>${data?.marketerReportDtos?.[0]?.MarketerName || ''}</MarketerName>
    <MonthYear>${data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''}</MonthYear>
    <DatePublished>${formatDate(new Date())}</DatePublished>
    <Customers>
    ${data.supplierActiveCustomerReport.map(customer => `
        <Customer>
            ${headers.map(h => `<${h.accessorKey}>${customer[h.accessorKey] || ''}</${h.accessorKey}>`).join('\n            ')}
        </Customer>
    `).join('\n    ')}
    </Customers>
</ActiveCustomersReport>`;
        const blob = new Blob([xmlString], { type: 'application/xml' });
        saveAs(blob, `${reportName}.xml`);
    };

    const downloadWord = () => {
        if (!data?.supplierActiveCustomerReport) return;
    
        const reportTitleOnly = 'Supplier Active Customers Report';
    
        let docContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${reportTitleOnly}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
    
                .logo-container {
                    text-align: right;
                    margin-bottom: 10px;
                }
    
                .logo-container img {
                    height: 24px;
                    vertical-align: middle;
                }
    
                .logo-container span {
                    margin-left: 6px;
                    vertical-align: middle;
                    font-size: 12px;
                }
    
                h2 {
                    font-size: 18px;
                    margin: 10px 0 20px 0;
                }
    
                p {
                    margin: 5px 0;
                    font-size: 12px;
                }
    
                table {
                    width: 100%;
                    table-layout: fixed;
                    border-collapse: collapse;
                    font-size: 10px;
                }
    
                th, td {
                    border: 1px solid #000;
                    padding: 4px;
                    word-wrap: break-word;
                }
    
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
    
            <div class="logo-container">
                <img src="${WGL_logo}" alt="WGL Logo" />
                <span>Washington Gas</span>
            </div>
    
            <h2>${reportTitleOnly}</h2>
    
            <p><strong>MarketerName:</strong> ${data?.marketerReportDtos?.[0]?.MarketerName || ''}</p>
            <p><strong>Month & year:</strong> ${data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''}</p>
            <p><strong>Date published:</strong> ${formatDate(new Date())}</p>
    
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h.header}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${data.supplierActiveCustomerReport.map(row => `
                        <tr>${headers.map(h => `<td>${row[h.accessorKey] || ''}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
    
        </body>
        </html>
        `;
    
        const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
        saveAs(blob, `${reportTitleOnly}.doc`);
    };
    
    const downloadMHTML = () => {
        if (!data?.supplierActiveCustomerReport) return;
        let mhtmlContent = `
From: <Saved by Blink>
Subject: ${reportName}
Date: ${new Date().toUTCString()}
MIME-Version: 1.0
Content-Type: multipart/related;
    type="text/html";
    boundary="----MultipartBoundary--${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}--"

------MultipartBoundary--${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}--
Content-Type: text/html;
    charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Location: ${reportName}.htm

<!DOCTYPE html>
<html>
<head>
    <title>${reportName}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .logo-container { position: absolute; top: 10px; right: 10px; text-align: right; }
        .logo { height: 50px; }
        h2 { text-align: center; }
        p { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="logo-container">
        <img src="cid:wgl_logo" alt="WGL Logo" class="logo">
        <div>Washington Gas</div>
    </div>
    <h2>${reportName}</h2>
    <p><strong>MarketerName:</strong> ${data?.marketerReportDtos?.[0]?.MarketerName || ''}</p>
    <p><strong>Month & year:</strong> ${data?.GasDay ? formatGasDayMonthYear(data.GasDay) : ''}</p>
    <p><strong>Date published:</strong> ${formatDate(new Date())}</p>
    <table>
        <thead>
            <tr>${headers.map(h => `<th>${h.header}</th>`).join('')}</tr>
        </thead>
        <tbody>
            ${data.supplierActiveCustomerReport.map(row => `
            <tr>${headers.map(h => `<td>${row[h.accessorKey] || ''}</td>`).join('')}</tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
------MultipartBoundary--${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}--
Content-Type: image/png
Content-Transfer-Encoding: base64
Content-Location: wgl_logo

${WGL_logo?.split(',')[1]}
------MultipartBoundary--${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}----
`;
        const blob = new Blob([mhtmlContent], { type: 'message/rfc822' });
        saveAs(blob, `${reportName}.mhtml`);
    };

    const downloadTIFF = async () => {
        const tableElement = document.getElementById("table-container");
    
        if (!tableElement) {
          console.error("Table element not found!");
          return;
        }
    
        try {
          const canvas = await html2canvas(tableElement);
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, "Supplier Active Customers Report.tiff");
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
                className='Download'
                color="primary"
                onClick={handleClick}
                disabled={!data?.supplierActiveCustomerReport?.length > 0}
            >
                <img src={materialsymbolsdownload} alt="Download" style={{ marginRight: 6 }} />
                Download
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => { handleClose(); downloadExcel(); }}>Excel</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadCSV(); }}>CSV</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadPDF(); }}>PDF</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadXML(); }}>XML</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadWord(); }}>Word</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadMHTML(); }}>MHTML</MenuItem>
                <MenuItem onClick={() => { handleClose(); downloadTIFF(); }}>TIFF</MenuItem>
            </Menu>
        </>
    );
};

export default SupplierActiveCustomerDownload;