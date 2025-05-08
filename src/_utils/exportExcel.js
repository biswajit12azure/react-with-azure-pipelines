import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const exportExcel = (rows, columns, filename) => {
    const formattedData = rows.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
           const value=row[col.accessorKey];
           formattedRow[col.header] = dayjs(value).isValid() ? dayjs(value).format('MM/DD/YYYY') : value;       
        });
        return formattedRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob,`${filename}.xlsx`);
};

export default exportExcel;