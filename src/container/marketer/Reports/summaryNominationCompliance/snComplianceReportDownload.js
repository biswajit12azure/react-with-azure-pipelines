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
import { DateRange } from "@mui/icons-material";

const SNComplianceReportDownload = ({ data, startDate, endDate ,tableRef}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const formatDate = (date) => dayjs(date).locale('en-gb').format('MM/DD/YYYY');

    const header = [
        "Marketer",
        "Marketer group",
        "Nominations by group (Dth)",
        "Forecast DRV (Dth)",
        "Actual DRV (Dth)",
        "Forecast imbalance (Dth)",
        "Penalty ($)"
    ];

    const getDetailRows = () =>
        data.filter(item => !item.isTotal).map(item => [
            item.CompanyName,
            item.AllocationGroup,
            item.TotalNominationAllocations,
            item.DailyRequiredVolume,
            item.TotalUsage,
            item.TotalForecastImbal,
            item.Penalty
        ]);

    const getCompanyTotals = () =>
        data.filter(item => item.isTotal && item.customCategory === "Company Total");

    const getFixedTotals = (type) =>
        data.find(item => item.isTotal && item.customCategory === "Fixed Total" && item.AllocationGroup.includes(type));

    const getGrandTotal = () =>
        data.find(item => item.isTotal && item.customCategory === "Fixed Total" && item.AllocationGroup === "Grand Total");

    const exportToExcel = () => {
        if (!data || data.length === 0) return;

        const workbook = XLSX.utils.book_new();
        const worksheetData = [
            ["Report name:", "Summary Nomination Compliance Report"],
            ["Date range:", `${formatDate(startDate)} - ${formatDate(endDate)}`],
            ["Date published:", formatDate(new Date())],
            [],
            header,
            ...getDetailRows(),
            [],
            ...getCompanyTotals().map(item => [
                "Company Total",
                "",
                item.TotalNominationAllocations,
                item.DailyRequiredVolume,
                item.TotalUsage,
                item.TotalForecastImbal,
                item.Penalty
            ]),
            [],
            ["Totals by firm", "", ...Object.values(getFixedTotals("FIRM") ?? {}).slice(2, 7)],
            ["Totals by interruptible", "", ...Object.values(getFixedTotals("Interruptible") ?? {}).slice(2, 7)],
            [],
            ["Grand totals", "", ...Object.values(getGrandTotal() ?? {}).slice(2, 7)],
            [],
            ["Quantity:", "Dth Dry"]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "SN Compliance Report");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelData, "SNComplianceReport.xlsx");
    };

    const exportToCSV = () => {
        if (!data || data.length === 0) return;

        const rows = [
            `Report name:,Summary Nomination Compliance Report`,
            `Date range:,${formatDate(startDate)} - ${formatDate(endDate)}`,
            `Date published:,${formatDate(new Date())}`,
            "",
            header.join(","),
            ...getDetailRows().map(row => row.join(",")),
            "",
            ...getCompanyTotals().map(item =>
                `Company Total,,${item.TotalNominationAllocations},${item.DailyRequiredVolume},${item.TotalUsage},${item.TotalForecastImbal},${item.Penalty}`
            ),
            "",
            `Totals by firm,,${Object.values(getFixedTotals("FIRM") ?? {}).slice(2, 7).join(",")}`,
            `Totals by interruptible,,${Object.values(getFixedTotals("Interruptible") ?? {}).slice(2, 7).join(",")}`,
            "",
            `Grand totals,,${Object.values(getGrandTotal() ?? {}).slice(2, 7).join(",")}`,
            "",
            "Quantity:,Dth Dry"
        ].join("\n");

        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, "SNComplianceReport.csv");
    };

    const exportToPDF = () => {
        if (!data || data.length === 0) return;

        const doc = new jsPDF();
        const reportName = "Summary Nomination Compliance Report";
        const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        const publishedDate = `Date published: ${formatDate(new Date())}`;

        const imgWidth = 20, imgHeight = 10;
        const text = "Washington Gas";
        const textWidth = doc.getTextWidth(text);
        const pageWidth = doc.internal.pageSize.getWidth();
        const xPositionImage = pageWidth - imgWidth - textWidth - 5;
        const xPositionText = pageWidth - textWidth;
        const yPositionHeader = 15;

        doc.addImage(WGL_logo, 'PNG', xPositionImage, 10, imgWidth, imgHeight);
        doc.setFont(undefined, 'bold');
        doc.text(text, xPositionText, 15);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(reportName, 15, yPositionHeader);
        doc.text(`Date range: ${dateRange}`, 15, yPositionHeader + 5);
        doc.text(publishedDate, 15, yPositionHeader + 10);

        doc.autoTable({
            head: [header],
            body: getDetailRows(),
            startY: yPositionHeader + 20,
            headStyles: { fillColor: [15, 53, 87] }
        });

        let currentY = doc.previousAutoTable.finalY + 10;

        doc.autoTable({
            body: getCompanyTotals().map(item => [
                "Company Total", "", item.TotalNominationAllocations, item.DailyRequiredVolume, item.TotalUsage, item.TotalForecastImbal, item.Penalty
            ]),
            startY: currentY
        });

        currentY = doc.previousAutoTable.finalY + 5;

        doc.autoTable({
            body: [
                ["Totals by firm", "", ...Object.values(getFixedTotals("FIRM") ?? {}).slice(2, 7)],
                ["Totals by interruptible", "", ...Object.values(getFixedTotals("Interruptible") ?? {}).slice(2, 7)]
            ],
            startY: currentY
        });

        currentY = doc.previousAutoTable.finalY + 5;

        doc.autoTable({
            body: [["Grand totals", "", ...Object.values(getGrandTotal() ?? {}).slice(2, 7)]],
            startY: currentY
        });

        doc.text("Quantity Dth Dry", 15, doc.internal.pageSize.getHeight() - 10);
        doc.save("SNComplianceReport.pdf");
    };

    const simpleExport = (extension, mimeType, contentGenerator) => {
        const blob = new Blob([contentGenerator()], { type: mimeType });
        saveAs(blob, `SNComplianceReport.${extension}`);
    };

    const render = (tag) => data.filter(item => !item.isTotal).map(item =>
        `<tr><td>${item.CompanyName}</td><td>${item.AllocationGroup}</td><td>${item.TotalNominationAllocations}</td><td>${item.DailyRequiredVolume}</td><td>${item.TotalUsage}</td><td>${item.TotalForecastImbal}</td><td>${item.Penalty}</td></tr>`
    ).join('');

    const exportToWord = () => {
        const reportName = "Summary Nomination Compliance Report";
        const publishedDate = `${dayjs().format('MM/DD/YYYY')}`;
      
        const content = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                xmlns:w='urn:schemas-microsoft-com:office:word' 
                xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <meta charset='utf-8'>
              <title>${reportName}</title>
              <style>
                th {
                  background-color: #007BFF;
                  color: white;
                }
                .right-align {
                  text-align: right;
                  font-weight: bold;
                  margin-top: 10px;
                }
                @media print {
                  .footer {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    text-align: right;
                    font-size: 10pt;
                    width: 100%;
                  }
                }
                .footer {
                  position: fixed;
                  bottom: 0;
                  right: 0;
                  text-align: right;
                  font-size: 10pt;
                  width: 100%;
                }
              </style>
            </head>
            <body>
              <h2>${reportName}</h2>
              <p><strong>Publish Date:</strong> ${publishedDate}</p>
              <p><strong>Date Range:</strong> ${startDate}-${endDate}</p>
      
              <div class="right-align">WGL_log</div>
      
              ${htmlTable()}
      
              <div class="footer">Quantity Dth Dry</div>
            </body>
          </html>
        `;
      
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      
      const htmlTable = () =>
        `<table border="1">
          <tr>
            <th>Marketer</th>
            <th>Group</th>
            <th>Nominations</th>
            <th>Forecast DRV</th>
            <th>Actual DRV</th>
            <th>Imbalance</th>
            <th>Penalty</th>
          </tr>
          ${render('html')}
        </table>`;

    const exportToXML = () => {
        simpleExport('xml', 'application/xml', () =>
            `<?xml version="1.0"?><Report>${data.map(item =>
                `<Entry>${Object.entries(item).map(([k, v]) => `<${k}>${v}</${k}>`).join('')}</Entry>`
            ).join('')}</Report>`
        );
    };

    // MHTML Export (approximation)
    const exportToMHTML = () => {
        const content = `
    MIME-Version: 1.0
    Content-Type: multipart/related; boundary="----=_NextPart_000_0000"; type="text/html"
    
    ------=_NextPart_000_0000
    Content-Type: text/html; charset="utf-8"
    Content-Transfer-Encoding: quoted-printable
    
    ${htmlTable()}
  `;
        const blob = new Blob([content], { type: 'multipart/related' });
        saveAs(blob, 'SNComplianceReport.mhtml');
    };

    // TIFF Export (via canvas)
    const exportToTIFF = async () => {
        const canvas = await html2canvas(document.body);
        canvas.toBlob(blob => {
            const tiffBlob = new Blob([blob], { type: 'image/tiff' });
            saveAs(tiffBlob, 'SNComplianceReport.tiff');
        }, 'image/tiff');
    };



    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary"
                onClick={handleClick}
                disabled={!data}
            >
                <img src={materialsymbolsdownload} alt="Download" style={{ marginRight: 6 }} />
                Download
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => { handleClose(); exportToExcel(); }}>Excel</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToCSV(); }}>CSV</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToPDF(); }}>PDF</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToXML(); }}>XML</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToWord(); }}>Word</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToMHTML(); }}>MHTML</MenuItem>
            <MenuItem onClick={() => { handleClose(); exportToTIFF(); }}>TIFF</MenuItem>
            </Menu>
        
    </>
  );
};

export default SNComplianceReportDownload;
