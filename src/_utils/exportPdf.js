import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import images from 'images';
import dayjs from 'dayjs';
import { pdfIcon } from '../images';

const exportPDF = (rows, columns, filename) => {
  const doc = new jsPDF();

  const tableHeaders = columns.map((c) => c.header);

  const formattedData = rows.map(row => {
    const formattedRow = {};
    columns.forEach(col => {
      const value = row[col.accessorKey];
      formattedRow[col.header] = dayjs(value).isValid() ? dayjs(value).format('MM/DD/YYYY') : value;
    });
    return Object.values(formattedRow);
  });
  doc.addImage(pdfIcon, 'PNG', 10, 10, 50, 20);
  autoTable(doc, {
    startY: 50,
    pageBreak: 2,
    head: [tableHeaders],
    body: formattedData,
  });

  doc.save(`${filename}.pdf`);
};

export default exportPDF;
