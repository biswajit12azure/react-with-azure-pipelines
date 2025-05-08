import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alertActions } from "_store";
import { fileExtension, fileSizeReadable, fileTypeAcceptable } from '_utils';
import * as XLSX from 'xlsx';
import { materialsymbolsupload } from 'images';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const FirmUpload = ({
    multiple = true,
    supportedFormats,
    data,
    setData,
    setSelectedDate,
    setIsSaveButtonEnabled
}) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [fileNames, setFileNames] = useState([]);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleError = (error, file) => {
        dispatch(alertActions.error(error.message));
        setIsSaveButtonEnabled(false);
    };

    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const convertToNumber = (value) => parseInt(value.replace(/,/g, ''), 10);

    // const handleChange = async (event) => {
    //     dispatch(alertActions.clear());
    //     event.preventDefault();

    //     let filesAdded = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    //     if (multiple === false && filesAdded.length > 1) {
    //         filesAdded = [filesAdded[0]];
    //     }

    //     const newFileNames = [];

    //     for (let i = 0; i < filesAdded.length; i += 1) {
    //         const file = filesAdded[i];
    //         newFileNames.push(file.name);

    //         file.extension = fileExtension(file);
    //         file.sizeReadable = fileSizeReadable(file.size);

    //         if (!fileTypeAcceptable(supportedFormats, file)) {
    //             handleError({ code: 1, message: 'Invalid file format. Only Excel files are supported.' }, file);
    //             return;
    //         }

    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const arrayBuffer = e.target.result;
    //             const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    //             const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //             const jsonData = XLSX.utils.sheet_to_json(sheet);

    //             if (jsonData.length === 0) {
    //                 handleError({ code: 2, message: 'The uploaded file contains no data.' }, file);
    //                 return;
    //             }

    //             const requiredColumns = ['__EMPTY', '__EMPTY_1', '__EMPTY_2',];
    //             const isSchemaValid = jsonData.slice(3)[requiredColumns[2]]!==null;

    //             if (!isSchemaValid) {
    //                 handleError({ code: 4, message: 'The uploaded file does not match the required format.' }, file);
    //                 return;
    //             }

    //             let month = 'January';
    //             let datePublished = dayjs().format('YYYY-MM-DD');
    //             try {
    //                 const monthText = jsonData[0]?.["Summary Adjustment Activity Firm"];
    //                 const dateText = jsonData[1]?.["Summary Adjustment Activity Firm"];
    //                 if (monthText?.includes('month')) {
    //                     month = monthText.split(' ').pop();
    //                 }
    //                 if (dateText?.includes('Date published')) {
    //                     datePublished = dateText.split(': ')[1];
    //                 }
    //             } catch {
    //                 handleError({ code: 5, message: 'Date or month format is incorrect in the file.' }, file);
    //                 return;
    //             }

    //             const year = new Date(datePublished).getFullYear();
    //             const currentDate = dayjs();
    //             const parsedDate = dayjs(`${year}-${month}-${currentDate.date()}`);
    //             const formattedDate = parsedDate.isValid() ? parsedDate.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss');

    //             const tableDetails = jsonData.slice(3);
    //             const isColumnEmpty = !(tableDetails[0]?.__EMPTY_1 && tableDetails[0]?.__EMPTY_2);

    //             if (isColumnEmpty) {
    //                 handleError({ code: 3, message: 'Monthly Imbalance Adjustment or Firm Group column is empty.' }, file);
    //                 return;
    //             }

    //             const tableData = tableDetails.map(row => ({
    //                 AllocationGroup: row.__EMPTY,
    //                 MonthlyGroupImbalance: row.__EMPTY_1 && formatNumber(row.__EMPTY_1),
    //                 ImbalanceAdjustedVolume: row.__EMPTY_2 && formatNumber(row.__EMPTY_2),
    //                 PreviousBalanceFirm: row.__EMPTY_3 && formatNumber(row.__EMPTY_3),
    //             }));

    //             const validateData = tableData.slice();

    //             if (data.length === 0) {
    //                 const updatedData = validateData.map(item => ({
    //                     ...item,
    //                     ImbalanceAdjustedVolume: item.ImbalanceAdjustedVolume,
    //                     EffectiveDate: formattedDate,
    //                     isEditing: true
    //                 }));
    //                 setData(updatedData);
    //             } else {
    //                 const validData = [];
    //                 const invalidGroupNames = [];
    //                 const inactiveGroupNames = [];

    //                 validateData.forEach(row => {
    //                     const original = data.find(item => item.AllocationGroup === row.AllocationGroup);
    //                     if (!original) invalidGroupNames.push(row.AllocationGroup);
    //                     else if (original.isInactive) inactiveGroupNames.push(row.AllocationGroup);
    //                     else validData.push(row);
    //                 });

    //                 const updatedData = data.map(item => {
    //                     const adjustment = validData.find(adj => adj.AllocationGroup === item.AllocationGroup);
    //                     return {
    //                         ...item,
    //                         ImbalanceAdjustedVolume: adjustment ? adjustment.ImbalanceAdjustedVolume : item.ImbalanceAdjustedVolume,
    //                         EffectiveDate: formattedDate,
    //                         isEditing: adjustment ? item.ImbalanceAdjustedVolume !== convertToNumber(adjustment.ImbalanceAdjustedVolume) : false
    //                     };
    //                 });

    //                 setData(updatedData);
                    

    //                 if (invalidGroupNames.length > 0) {
    //                     dispatch(alertActions.error({ message: `${invalidGroupNames.length} invalid firm group(s) skipped.` }));
    //                     return;
    //                 }
    //                 if (inactiveGroupNames.length > 0) {
    //                     dispatch(alertActions.error({ message: `${inactiveGroupNames.length} inactive firm group(s) skipped.` }));
    //                     return;
    //                 }
    //             }
    //         };

    //         reader.readAsArrayBuffer(file);
    //     }

    //     setFileNames(newFileNames);

    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = '';
    //     }
    // };

    const handleChange = async (event) => {
        dispatch(alertActions.clear());
        event.preventDefault();
    
        let filesAdded = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    
        if (multiple === false && filesAdded.length > 1) {
            filesAdded = [filesAdded[0]];
        }
    
        const newFileNames = [];
    
        for (let i = 0; i < filesAdded.length; i += 1) {
            const file = filesAdded[i];
            newFileNames.push(file.name);
    
            file.extension = fileExtension(file);
            file.sizeReadable = fileSizeReadable(file.size);
    
            if (!fileTypeAcceptable(supportedFormats, file)) {
                handleError({ code: 1, message: 'Invalid file format. Only Excel files are supported.' }, file);
                return;
            }
    
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
    
                if (jsonData.length === 0) {
                    handleError({ code: 2, message: 'The uploaded file contains no data.' }, file);
                    return;
                }
    
                // Extract header mapping
                const headersRow = jsonData[2];
                const headerKeys = Object.keys(headersRow);
                const headerMap = {
                    AllocationGroup: headerKeys.find(k => headersRow[k] === 'Firm Group Name' || headersRow[k] === undefined),
                    MonthlyGroupImbalance: headerKeys.find(k => headersRow[k] === 'Monthly Group Imbalance'),
                    ImbalanceAdjustedVolume: headerKeys.find(k => headersRow[k] === 'Monthly Imbalance Adjustment'),
                    PreviousBalanceFirm: headerKeys.find(k => headersRow[k] === 'Ending Monthly Inventory Balance'),
                };
    
                const tableDetails = jsonData.slice(3);
                const firstDataRow = tableDetails[0];
    
                if (
                    !firstDataRow ||
                    !firstDataRow[headerMap.MonthlyGroupImbalance] ||
                    !firstDataRow[headerMap.ImbalanceAdjustedVolume]
                ) {
                    handleError({ code: 3, message: 'Monthly Imbalance Adjustment or Firm Group column is empty.' }, file);
                    return;
                }
    
                const isSchemaValid = headerMap.ImbalanceAdjustedVolume in firstDataRow;
    
                if (!isSchemaValid) {
                    handleError({ code: 4, message: 'The uploaded file does not match the required format.' }, file);
                    return;
                }
    
                let month = 'January';
                let datePublished = dayjs().format('YYYY-MM-DD');
                try {
                    const monthText = jsonData[0]?.["Summary Adjustment Activity Firm"];
                    const dateText = jsonData[1]?.["Summary Adjustment Activity Firm"];
                    if (monthText?.includes('month')) {
                        month = monthText.split(' ').pop();
                    }
                    if (dateText?.includes('Date published')) {
                        datePublished = dateText.split(': ')[1];
                    }
                } catch {
                    handleError({ code: 5, message: 'Date or month format is incorrect in the file.' }, file);
                    return;
                }
    
                const year = new Date(datePublished).getFullYear();
                const currentDate = dayjs();
                const parsedDate = dayjs(`${year}-${month}-${currentDate.date()}`);
                const formattedDate = parsedDate.isValid() ? parsedDate.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss');
    
                const tableData = tableDetails.map(row => ({
                    AllocationGroup: row[headerMap.AllocationGroup],
                    MonthlyGroupImbalance: row[headerMap.MonthlyGroupImbalance] && formatNumber(row[headerMap.MonthlyGroupImbalance]),
                    ImbalanceAdjustedVolume: row[headerMap.ImbalanceAdjustedVolume] && formatNumber(row[headerMap.ImbalanceAdjustedVolume]),
                    PreviousBalanceFirm: row[headerMap.PreviousBalanceFirm] && formatNumber(row[headerMap.PreviousBalanceFirm]),
                }));
    
                const validateData = tableData.slice();
    
                if (data.length === 0) {
                    const updatedData = validateData.map(item => ({
                        ...item,
                        ImbalanceAdjustedVolume: item.ImbalanceAdjustedVolume,
                        EffectiveDate: formattedDate,
                        isEditing: true
                    }));
                    setData(updatedData);
                } else {
                    const validData = [];
                    const invalidGroupNames = [];
                    const inactiveGroupNames = [];
    
                    validateData.forEach(row => {
                        const original = data.find(item => item.AllocationGroup === row.AllocationGroup);
                        if (!original) invalidGroupNames.push(row.AllocationGroup);
                        else if (original.isInactive) inactiveGroupNames.push(row.AllocationGroup);
                        else validData.push(row);
                    });
    
                    const updatedData = data.map(item => {
                        const adjustment = validData.find(adj => adj.AllocationGroup === item.AllocationGroup);
                        return {
                            ...item,
                            ImbalanceAdjustedVolume: adjustment ? adjustment.ImbalanceAdjustedVolume : item.ImbalanceAdjustedVolume,
                            EffectiveDate: formattedDate,
                            isEditing: adjustment ? item.ImbalanceAdjustedVolume !== convertToNumber(adjustment.ImbalanceAdjustedVolume) : false
                        };
                    });
    
                    setData(updatedData);
                    setIsSaveButtonEnabled(data.length > 0);
    
                    if (invalidGroupNames.length > 0) {
                        dispatch(alertActions.error({ message: `${invalidGroupNames.length} invalid firm group(s) skipped.` }));
                        return;
                    }
                    if (inactiveGroupNames.length > 0) {
                        dispatch(alertActions.error({ message: `${inactiveGroupNames.length} inactive firm group(s) skipped.` }));
                        return;
                    }
                }
            };
    
            reader.readAsArrayBuffer(file);
        }
    
        setFileNames(newFileNames);
    
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <Typography component="div" className="UploadContainer">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button
                        component="label"
                        variant="contained"
                        className="Uploadfiles"
                        startIcon={<img src={materialsymbolsupload} alt="Upload" />}
                    >
                        <span> Upload your files here</span>
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleChange}
                            ref={fileInputRef}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        <strong>Supported Formats:</strong>{" "}
                        {supportedFormats && supportedFormats.map(format => <span key={format}>{format} </span>)}
                    </Typography>
                </Grid>
            </Grid>
        </Typography>
    );
};

export default FirmUpload;
