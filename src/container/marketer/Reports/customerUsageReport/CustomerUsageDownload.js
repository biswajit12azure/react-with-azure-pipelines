import React, { useState } from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { materialsymbolsdownload } from 'images';
import dayjs from 'dayjs';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import {WGL_logo} from '../../../../images';
const CustomerUsageDownload = ({ data, fromDate, toDate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const usageData = data?.CustomerUsageData || [];

  // ✅ Filter by shipment date
  const filteredData = usageData.filter(entry =>
    dayjs(entry.ShipmentDate).isBetween(dayjs(fromDate), dayjs(toDate), null, '[]')
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const generateTableRows = () =>
    filteredData.map(entry => [
      entry.AccountNumber || "N/A",
      dayjs(entry.ShipmentDate).format("YYYY-MM-DD"),
      entry.DailyUsage,
      entry.IsAccountActive ? "Yes" : "No"
    ]);

  const exportToPDF = () => {
    const doc = new jsPDF();
  // Logo on the left
  const logoX = 14;
  const logoY = 15;
  const logoWidth = 10;
  const logoHeight = 10;
  doc.addImage(WGL_logo, 'JPG', logoX, logoY, logoWidth, logoHeight);

  // Title and dates next to the logo
  const textStartX = logoX + logoWidth + 4; // Padding between logo and text
  const titleY = logoY + 6;
  const dateY = titleY + 7;
    doc.setFontSize(16);
    doc.text("Customer Usage Report", 30, 22);

    doc.setFontSize(12);
    doc.text(`From: ${dayjs(fromDate).format("MMM DD, YYYY")}    To: ${dayjs(toDate).format("MMM DD, YYYY")}`, 30, 27);

    autoTable(doc, {
      startY: 30,
      head: [["Account Number", "Shipment Date", "Daily Usage", "Is Active"]],
      body: generateTableRows(),
    });

    doc.save(`CustomerUsageReport_${dayjs(fromDate).format("YYYYMMDD")}_to_${dayjs(toDate).format("YYYYMMDD")}.pdf`);
    handleClose();
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["Account Number", "Shipment Date", "Daily Usage", "Is Active"],
      ...generateTableRows()
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Usage");

    XLSX.writeFile(workbook, `CustomerUsage_${dayjs(fromDate).format("YYYYMMDD")}_to_${dayjs(toDate).format("YYYYMMDD")}.xlsx`);
    handleClose();
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      AccountNumber: item.AccountNumber,
      ShipmentDate: dayjs(item.ShipmentDate).format("YYYY-MM-DD"),
      DailyUsage: item.DailyUsage,
      IsActive: item.IsAccountActive ? "Yes" : "No"
    })));
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CustomerUsage_${dayjs(fromDate).format("YYYYMMDD")}_to_${dayjs(toDate).format("YYYYMMDD")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const exportToXML = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?><CustomerUsageReport>`;
    filteredData.forEach(item => {
      xml += `<Record>`;
      xml += `<AccountNumber>${item.AccountNumber || "N/A"}</AccountNumber>`;
      xml += `<ShipmentDate>${dayjs(item.ShipmentDate).format("YYYY-MM-DD")}</ShipmentDate>`;
      xml += `<DailyUsage>${item.DailyUsage}</DailyUsage>`;
      xml += `<IsActive>${item.IsAccountActive ? "Yes" : "No"}</IsActive>`;
      xml += `</Record>`;
    });
    xml += `</CustomerUsageReport>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CustomerUsage_${dayjs(fromDate).format("YYYYMMDD")}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const exportToWord = () => {
    let html = `
      <html><head><meta charset="utf-8"></head><body>
      <h2>Customer Usage Report</h2>
      <p>From: ${dayjs(fromDate).format("MMM DD, YYYY")} To: ${dayjs(toDate).format("MMM DD, YYYY")}</p>
      <table border="1"><tr><th>Account Number</th><th>Shipment Date</th><th>Daily Usage</th><th>Is Active</th></tr>
    `;
    filteredData.forEach(entry => {
      html += `<tr>
        <td>${entry.AccountNumber || "N/A"}</td>
        <td>${dayjs(entry.ShipmentDate).format("YYYY-MM-DD")}</td>
        <td>${entry.DailyUsage}</td>
        <td>${entry.IsAccountActive ? "Yes" : "No"}</td>
      </tr>`;
    });
    html += "</table></body></html>";

    const blob = new Blob(['\ufeff', html], {
      type: "application/msword"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CustomerUsageReport_${dayjs(fromDate).format("YYYYMMDD")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const exportToTIFF = async () => {
    const tableElement = document.getElementById('table-container');
  
    if (!tableElement) {
      console.error('Table element not found!');
      return;
    }
  
    try {
      const canvas = await html2canvas(tableElement, {
        scale: 2, // optional: higher quality output
        useCORS: true
      });
  
      canvas.toBlob((blob) => {
        if (blob) {
          const filename = `CustomerUsage_${dayjs(fromDate).format("YYYYMMDD")}_to_${dayjs(toDate).format("YYYYMMDD")}.tiff`;
          saveAs(blob, filename);
        } else {
          console.error('Failed to create TIFF blob.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing table:', error);
    }
  
    handleClose();
  };

  const exportToHTML = () => {
    const tableElement = document.getElementById("table-container1");
  
    if (!tableElement) {
      console.error("Table element not found!");
      return;
    }
  
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Customer Usage Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            border: 1px solid #ccc;
            text-align: left;
          }
          thead {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2>Customer Usage Report</h2>
        <p>From: ${dayjs(fromDate).format("MMM DD, YYYY")} To: ${dayjs(toDate).format("MMM DD, YYYY")}</p>
        ${tableElement.innerHTML}
      </body>
      </html>
    `;
  
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const filename = `CustomerUsage_${dayjs(fromDate).format("YYYYMMDD")}_to_${dayjs(toDate).format("YYYYMMDD")}.html`;
    saveAs(blob, filename);
  
    handleClose();
  };
  const exportTIFF = async () => {
    const tableElement = document.getElementById('table-container1');
  
    if (!tableElement) {
      console.error('Table element not found!');
      return;
    }
  
    try {
      const canvas = await html2canvas(tableElement,{scale: 2});
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'Customer_Usage_Report.tiff');
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
      <Button variant="contained" className='Download' color="primary" onClick={handleClick}>
        <img src={materialsymbolsdownload} alt="Download" /> Download
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={exportToPDF}>PDF</MenuItem>
        <MenuItem onClick={exportToExcel}>Excel</MenuItem>
        <MenuItem onClick={exportToCSV}>CSV</MenuItem>
        <MenuItem onClick={exportToXML}>XML</MenuItem>
        <MenuItem onClick={exportToWord}>Word</MenuItem>
        <MenuItem onClick={exportToHTML}>HTML</MenuItem>
        <MenuItem onClick={exportTIFF}>TIFF</MenuItem>
      </Menu>
    </>
  );
};

export default CustomerUsageDownload;
