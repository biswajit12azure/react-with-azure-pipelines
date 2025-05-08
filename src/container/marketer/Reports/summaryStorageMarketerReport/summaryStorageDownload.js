import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
    ShadingType,
} from "docx";

const SummaryStorageDownload = ({ data, fileName = "Summary Storage by Marketer Report", tableRef }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const currentDate = new Date().toLocaleDateString();

    // ✅ Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
    };

    const generateTableRows = (data) => {
        const rows = data.storageSummaryReportResponses.map((item) => [
            item.ShortName,
            item.Injection,
            item.Withdrawl,
            item.InventoryBalance,
        ]);

        if (data.totalSum) {
            rows.push([
                "Total",
                data.totalSum.TotalSumInjection,
                data.totalSum.TotalSumWithdrawal,
                data.totalSum.TotalSumInventoryBalance,
            ]);
        }

        return rows;
    };

    const handleDownload = async (callback) => {
        await callback();
        handleClose();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(fileName, 14, 10);
        doc.setFontSize(10);
        doc.text(`Date Published: ${currentDate}`, 14, 16);
        if (data?.totalSum?.GasDay) {
            doc.text(`Gas Day: ${formatDate(data.totalSum.GasDay)}`, 14, 22);
        }

        const headers = [["Marketer", "Injections", "Withdrawals", "Inventory Balance"]];
        const rows = generateTableRows(data);
        const totalRowIndex = rows.length - 1;

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 30,
            theme: "grid",
            styles: { halign: "center", fontSize: 10 },
            headStyles: { fillColor: "#0F3557", textColor: "FFFFFF", fontSize: 10 },
            didDrawCell: (dataCell) => {
                if (data.totalSum && dataCell.row.index === totalRowIndex) {
                    const { cell } = dataCell;
                    doc.setFillColor(0, 0, 255);
                    doc.setTextColor(255, 255, 255);
                    doc.rect(cell.x, cell.y, cell.width, cell.height, "F");
                    doc.text(String(cell.text), cell.x + 2, cell.y + cell.height / 2 + 2);
                }
            },
            didDrawPage: (data) => {
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;
                doc.setFontSize(10);
                doc.text("Dth Dry", pageWidth - 25, pageHeight - 10);
            },
        });

        doc.save(fileName.replace(/\s+/g, "_") + ".pdf");
    };

    const downloadExcel = () => {
        if (!data || !Array.isArray(data.storageSummaryReportResponses)) return;

        const worksheetData = [
            [fileName],
            [data?.totalSum?.GasDay ? `Gas Day: ${formatDate(data.totalSum.GasDay)}` : ""],
            [`Date Published: ${currentDate}`],
            [],
            ["Marketer", "Injections", "Withdrawals", "Inventory Balance"],
        ];

        generateTableRows(data).forEach((row) => worksheetData.push(row));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        worksheet["!cols"] = Array(4).fill({ wch: 25 });
        worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

        const safeSheetName = fileName.substring(0, 31); // max length for Excel
        XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
        XLSX.writeFile(workbook, fileName.replace(/\s+/g, "_") + ".xlsx");
    };

    const downloadCSV = () => {
        const headers = ["Marketer", "Injections", "Withdrawals", "Inventory Balance"];
        const csvRows = [headers.join(",")];

        generateTableRows(data).forEach((row) => {
            csvRows.push(row.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, fileName.replace(/\s+/g, "_") + ".csv");
    };

    const escapeXML = (str) => {
        return str?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&apos;") || "";
    };

    const downloadXML = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<SummaryStorageByMarketerReport>\n`;

        data.storageSummaryReportResponses.forEach((item) => {
            xml += `  <Record>\n`;
            xml += `    <Marketer>${escapeXML(item.ShortName)}</Marketer>\n`;
            xml += `    <Injections>${escapeXML(String(item.Injection))}</Injections>\n`;
            xml += `    <Withdrawals>${escapeXML(String(item.Withdrawl))}</Withdrawals>\n`;
            xml += `    <InventoryBalance>${escapeXML(String(item.InventoryBalance))}</InventoryBalance>\n`;
            xml += `  </Record>\n`;
        });

        xml += `</SummaryStorageByMarketerReport>`;
        const blob = new Blob([xml], { type: "application/xml;charset=utf-8;" });
        saveAs(blob, fileName.replace(/\s+/g, "_") + ".xml");
    };

    const downloadWordDocument = () => {
        const headers = ["Marketer", "Injections", "Withdrawals", "Inventory Balance"];
        const rows = generateTableRows(data);
        const totalRowIndex = rows.length - 1;

        const tableRows = [
            new TableRow({
                children: headers.map((header) =>
                    new TableCell({
                        shading: { type: ShadingType.CLEAR, color: "auto", fill: "0000FF" },
                        children: [new Paragraph({ text: header, bold: true, color: "FFFFFF" })],
                    })
                ),
            }),
            ...rows.map((row, i) =>
                new TableRow({
                    children: row.map((cell) =>
                        new TableCell({
                            shading: data.totalSum && i === totalRowIndex ? { type: ShadingType.CLEAR, color: "auto", fill: "0000FF" } : undefined,
                            children: [new Paragraph({ text: cell?.toString() || "", color: data.totalSum && i === totalRowIndex ? "FFFFFF" : undefined })],
                        })
                    ),
                })
            ),
        ];

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({ text: fileName, heading: "Heading1", alignment: AlignmentType.LEFT }),
                        data?.totalSum?.GasDay && new Paragraph({ text: `Gas Day: ${formatDate(data.totalSum.GasDay)}` }),
                        new Paragraph({ text: `Date Published: ${currentDate}` }),
                        new Paragraph(" "),
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: tableRows,
                        }),
                    ].filter(Boolean),
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, fileName.replace(/\s+/g, "_") + ".docx");
        });
    };

    const downloadHTML = () => {
        const headers = ["Marketer", "Injections", "Withdrawals", "Inventory Balance"];
        const rows = generateTableRows(data);

        let tableRows = "";
        rows.forEach((row, i) => {
            const isLast = data.totalSum && i === rows.length - 1;
            tableRows += `<tr style="${isLast ? "background-color: #0F3557; color: white;" : ""}">`;
            row.forEach((cell) => {
                tableRows += `<td>${cell}</td>`;
            });
            tableRows += `</tr>`;
        });

        const html = `
        <html>
        <head><title>${fileName}</title></head>
        <body>
            <h2>${fileName}</h2>
            <p>Date Published: ${currentDate}</p>
            ${data?.totalSum?.GasDay ? `<p>Gas Day: ${formatDate(data.totalSum.GasDay)}</p>` : ""}
            <table border="1" cellpadding="5" cellspacing="0">
                <thead style="background-color: #0F3557; color: white;">
                    <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </body>
        </html>
        `;

        const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName.replace(/\s+/g, "_") + ".html";
        link.click();
    };

    const downloadTiff = async () => {
        if (tableRef?.current) {
            const canvas = await html2canvas(tableRef.current);
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, fileName.replace(/\s+/g, "_") + ".tiff");
                }
            });
        }
    };

    return (
        <div>
            <Button variant="contained" className="Download" color="primary" onClick={handleClick}  disabled={!data}>
                <img src={materialsymbolsdownload} alt="Download" /> Download
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleDownload(downloadPDF)}>PDF</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadExcel)}>Excel</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadCSV)}>CSV</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadXML)}>XML</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadWordDocument)}>Word</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadHTML)}>HTML</MenuItem>
                <MenuItem onClick={() => handleDownload(downloadTiff)}>TIFF</MenuItem>
            </Menu>
        </div>
    );
};

export default SummaryStorageDownload;
