import { mkConfig, generateCsv, download } from 'export-to-csv';
import dayjs from 'dayjs';

const exportCSV = (rows,columns, filename ) => {
    const options = mkConfig({
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        useKeysAsHeaders: false,
        showColumnHeaders:true,
        columnHeaders: columns.map(col => col.header), // Use display headers,
        filename:filename
    });

    const formattedData = rows.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
            const value=row[col.accessorKey];
        formattedRow[col.header] = dayjs(value).isValid() ? dayjs(value).format('MM/DD/YYYY') : value;
        });
        return formattedRow;
    });

    const csv = generateCsv(options)(formattedData);
    download(options)(csv);
};

export default exportCSV;




