import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { raphaelinfo } from '../../../images';
import { AutocompleteInput, UploadFiles, UnderConstruction, ModalPopup } from '_components';
import { useForm } from 'react-hook-form';
import { IconButton } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import { alertActions, filehubAction, fileSubTypeAction } from '_store';
import { fileHubSupportedFormat, fileHubUETSupportedFormat } from '_utils/constant';
import Grid from "@mui/material/Grid2";
import { materialsymbolsupload, materialsymbolsdownload, Delete } from 'images';
import { convertToBase64, base64ToFile, fileExtension, fileSizeReadable, fileTypeAcceptable } from '_utils';

const FileHubUpload = ({ setIsDataChanged, marketerGridData, onSubmit, setfiles, marketerData = [], DocumentTypes = [], isAdmin, setUploadFileType, setuploadUETPayload, isEnableUpload }) => {
    const header = "FileHub";
    const [MarkterSelectedVal, setMarkterSelectedVal] = useState({})
    const [selectedDocumentType, setSelectedDocumentType] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [duplicateFile, setDuplicateFile] = useState(null);
    const [fileSubType, setFileSubType] = useState([]);
    const [fileSubTypesSeletedVal, setFileSubTypesSeletedVal] = useState([]);
    const [isMarkterDisplay, setIsMarkterDisplay] = useState(true);
    const [isFileSubTypedisplay, setIsFileSubTypedisplay] = useState(false);
    const [isFileUPloadEnable, setIsFileUPloadEnable] = useState(false);
    const [fileNameSupportedFormat, setFileNameSupportedFormat] = useState();
    const [isStandardUser, setIsStandardUser] = useState(false);
    const dispatch = useDispatch();
    const maxFileSize = 5000000;
    const minFileSize = 0;
    const multiple = true;
    const id = useSelector(x => x.auth?.userId);
    const authUser = useSelector(x => x.auth?.value);
    const user = authUser?.Data;
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

    useEffect(() => {
        const userAccess = user?.UserAccess;
        const isStandardUser = userAccess?.some(access => access.Role === "Standard User");

        if (isStandardUser) {
            setIsStandardUser(true);
        }
    }, []);

    const downloadSample = async () => {
        dispatch(alertActions.clear());
        const transformed = { "FileName": "DRV_Sample.xlsx" };

        try {
            if (selectedDocumentType?.label === 'DRV') {
                const result = await dispatch(filehubAction.get(transformed)).unwrap();
                handleDownload(result?.File, result?.FileName);
            }
            if (selectedDocumentType?.label === 'UET') {
                const fileName = `${fileSubTypesSeletedVal.label}.xml`;
                const UETPaylod = { "FileName": fileName }
                const result = await dispatch(filehubAction.get(UETPaylod)).unwrap();
                handleDownload(result?.File, result?.FileName);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            dispatch(alertActions.error({ message: error?.message || error, header: `${header} Failed` }));
        }
    };

    const handleDownload = async (base64String, fileName) => {
        await base64ToFile(base64String, fileName);
    };

    const handleDownloadSampleFormate = () => { };

    const DocumentList = DocumentTypes?.map(x => ({
        label: x.DocName,
        value: x.DocID
    })) || [];

    const marketerList = marketerData?.map(x => ({
        label: x.MarketerName,
        value: x.MarketerID
    })) || [];


    const handleError = (error, file) => {
        dispatch(alertActions.error({
            message: error.message,
            header: `File Error: ${file.name}`
        }));
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        let filesAdded = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        if (multiple === false && filesAdded.length > 1) {
            filesAdded = [filesAdded[0]];
        }
        const fileResults = [];
        for (let i = 0; i < filesAdded.length; i += 1) {
            const file = filesAdded[i];
            file.extension = fileExtension(file);
            file.sizeReadable = fileSizeReadable(file.size);

            // Check for file size validation
            if (file.size > maxFileSize) {
                handleError({ code: 2, message: `${file.name} is too large` }, file);
                return;
            }

            if (file.size < minFileSize) {
                handleError({ code: 3, message: `${file.name} is too small` }, file);
                return;
            }

            if (!fileTypeAcceptable(fileHubSupportedFormat, file) && selectedDocumentType?.label === 'DRV') {
                dispatch(alertActions.error({
                    message: `Invalid file format. Only excel files are supported.`,
                    header: 'FileHub'
                }));
                return;
            }

            if (selectedDocumentType?.label === 'UET' && file.extension !== 'xml') {
                // Show the pop-up for invalid file format
                dispatch(alertActions.error({
                    message: `Invalid ${file.name} format. Only XML files are supported.`,
                    header: 'FileHub'
                }));
                return;
            }

            if (selectedDocumentType?.label === 'UET' && file.extension === 'xml') {
                const fileContent = await file.text();
                if (!fileContent.trim()) {
                    dispatch(alertActions.error({
                        message: `The uploaded file contains no data.`,
                        header: 'FileHub'
                    }));
                    return;
                }
            }

            // Check if a file with the same name already exists in 'Uploaded' or 'Failed to Process' status
            const findExistingFile = uploadedFiles.some(uploadedFile =>
                uploadedFile.FileName === file.name
            );

            if (findExistingFile) {
                // If the file exists, trigger a confirmation dialog
                setDuplicateFile({
                    FileName: file.name,
                    Base64File: await convertToBase64(file),
                });
                setOpenDialog(true);  // Show the confirmation dialog
                return;
            }

            const base64 = await convertToBase64(file);
            const fileNameWithXML = file.name.endsWith('.xml') ? file.name : `${file.name}.xml`;
            const fileData = {
                File: base64,
                FileName: file.name,
                FileSubType: fileSubTypesSeletedVal?.label,
                url: ''
            };
            fileResults.push(fileData);
            setUploadedFiles(prevFiles => [...prevFiles, fileData]);
        }

        setfiles(prevFiles => [...prevFiles, ...fileResults]);
        setIsDataChanged(true);
        setUploadFileType(selectedDocumentType?.value);
        setuploadUETPayload({
            "Data": {
                "UserName": user?.UserDetails?.FirstName,
                "MarketerID": MarkterSelectedVal?.value,
                "MarketerName": MarkterSelectedVal?.label,
                "FileHubName": fileSubTypesSeletedVal.label,
                "Files": fileResults
            }
        });
    };

    // Handle the dialog confirmation (overwrite or cancel)
    const handleConfirmOverwrite = () => {
        const updatedFiles = uploadedFiles.filter(file => file.FileName !== duplicateFile.FileName);
        setUploadedFiles([...updatedFiles, duplicateFile]);
        setfiles(prevFiles => prevFiles.filter(file => file.FileName !== duplicateFile.FileName).concat(duplicateFile));
        setOpenDialog(false);
        setIsDataChanged(true);
    };

    // Handle cancel overwrite action
    const handleCancelOverwrite = () => {
        setOpenDialog(false);  // Close the dialog
    };


    const handleRemoveFile = (fileName) => {
        setUploadedFiles(prevFiles => prevFiles.filter(file => file.FileName !== fileName));
        setIsDataChanged(true);
    };

    const fetchFileSubType = async (markterselectedVal) => {
        if (markterselectedVal) {
            const result = await dispatch(fileSubTypeAction.getSupplierMessages(markterselectedVal)).unwrap();
            setFileSubType(result?.Data)
        }


    }

    const handleOnChange = (type, event, newValue) => {
        let markterselectedVal;
        let fileTypeSelectedVal;

        // Handle Marketer change
        if (type === 'marketer') {
            let Markter = {
                value: newValue,
                label: event.target.innerText
            };
            setMarkterSelectedVal(Markter);
            markterselectedVal = Markter?.value;
            setFileSubType([]);
            fetchFileSubType(markterselectedVal);
        }
        // Handle File Type change
        if (type === 'filetype') {
            
            let doumentypeSelectedVal = {
                value: newValue,
                label: event.target.innerText
            };

            setSelectedDocumentType(doumentypeSelectedVal);
            fileTypeSelectedVal = doumentypeSelectedVal?.label;

            if (fileTypeSelectedVal === "UET") {
                setIsMarkterDisplay(true);
                setIsFileSubTypedisplay(true);
                if (isStandardUser && newValue) {
                    setFileSubTypesSeletedVal([]);
                    const markterId = marketerGridData[0].MarketerID;
                    const markterName = marketerGridData[0].MarketerName;
    
                    let Markter = {
                        value: markterId,
                        label: markterName
                    };
                    setMarkterSelectedVal(Markter);
                    fetchFileSubType(markterId);
                }
            } else if (fileTypeSelectedVal === "DRV") {
                setIsMarkterDisplay(false);
                setIsFileSubTypedisplay(false);
                setIsFileUPloadEnable(true);
            } else if(fileTypeSelectedVal === "DC Nomination"){
                setIsMarkterDisplay(true);
                setIsFileSubTypedisplay(false);
                setIsFileUPloadEnable(true);
            }
            else {
                setIsFileSubTypedisplay(false);
            }
        }
    };

    const handleOnChangeFileSubType = (event, newValue) => {
        let fileSubTypeSelectedValue = {
            value: newValue,
            label: event.target.innerText
        }
        const supportedFileName = `${fileSubTypeSelectedValue.label}_YYYYMMDD.xml`;
        setFileNameSupportedFormat(supportedFileName);
        setFileSubTypesSeletedVal(fileSubTypeSelectedValue);
        fileSubTypeSelectedValue?.value ? setIsFileUPloadEnable(true) : setIsFileUPloadEnable(false);
    }

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger, getValues } = useForm({});

    return (
        <>
            <Typography component="div" className="SupportedFormats">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography component="div" className="Personal-Informationsheading">
                        <Typography component="h2" variant="h5" className="marbottom0">
                            Documents upload
                            <img onClick={downloadSample} src={raphaelinfo} alt='raphaelinfo' />
                        </Typography>

                        <Typography component="div" className='marbottom0 selecticon'>
                            <AutocompleteInput
                                control={control}
                                name="doctype"
                                label="File Type"
                                options={DocumentList}
                                onChange={(event, newValue) => {
                                    handleOnChange('filetype', event, newValue);
                                }}
                            />
                        </Typography>

                        {!isStandardUser && isMarkterDisplay && <Typography component="div" className='marbottom0 selecticon'>
                            <AutocompleteInput
                                control={control}
                                name="marketer"
                                label="Marketer"
                                options={marketerList}
                                getOptionLabel={(option) => String(option?.label) || 'No label available'}
                                onChange={(event, newValue) => {
                                    handleOnChange('marketer', event, newValue);
                                }}
                            />
                        </Typography>}

                        {/* Conditionally render File SubType Dropdown when 'UET' is selected */}
                        {isFileSubTypedisplay && (
                            <Typography component="div" className="marbottom0 selecticon">
                                <AutocompleteInput
                                    control={control}
                                    name="filesubtype"
                                    label="File SubType"
                                    options={fileSubType?.map(subType => ({
                                        label: subType.Description,
                                        value: subType.MessageTypeId
                                    })) || []}
                                    getOptionLabel={(option) => option?.label || 'No label available'}
                                    onChange={(event, newValue) => {
                                        handleOnChangeFileSubType(event, newValue);
                                    }}
                                />
                            </Typography>
                        )}

                        <Typography component="div" className="UploadContainer">
                            <Grid container>
                                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        className="Uploadfiles"
                                        startIcon={<img src={materialsymbolsupload} alt="Upload" />}
                                        disabled={!isFileUPloadEnable}
                                    >
                                        <span> Upload your files here</span>
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleUpload}
                                            multiple
                                        />
                                    </Button>
                                </Grid>

                                {openDialog && <ModalPopup
                                    header="FileHub"
                                    message1="File name already exists. Do you want to overwrite?"
                                    btnPrimaryText="No"
                                    btnSecondaryText="Yes"
                                    handlePrimaryClick={handleCancelOverwrite}
                                    handleSecondaryClick={handleConfirmOverwrite}
                                />}


                                {/* Render uploaded files */}
                                {uploadedFiles.length > 0 && (
                                    <Typography component="div" className={`UploadedFilesSection ${!isEnableUpload ? 'disabled' : ''}`}>
                                        <Typography component="h3" variant="h6">Uploaded Files</Typography>
                                        <div>
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="UploadedFile">
                                                    <Typography component="span">{file.FileName}</Typography>
                                                    <IconButton
                                                        onClick={() => handleRemoveFile(file.FileName)}
                                                        disabled={!isEnableUpload}
                                                    >
                                                        <img src={Delete} alt="Delete" />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </div>
                                    </Typography>

                                )}

                                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                    <Typography component="div" className="SupportedFormats">
                                        <Typography component="h3">Supported Formats</Typography>
                                        <Typography component="div" className="fileformatlist">
                                            {selectedDocumentType?.label === 'DRV' && fileHubSupportedFormat?.map(format => <span key={format}>{format}</span>)}
                                            {selectedDocumentType?.label === 'UET' && fileHubUETSupportedFormat?.map(format => <span key={format}>{format}</span>)}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                    <Typography component="div" className="SupportedFormats">
                                        <Typography component="h3">Supported FileName Formats</Typography>
                                        <Typography component="div" className="fileformatlist">
                                            {selectedDocumentType?.label === 'UET' && <span >{fileNameSupportedFormat}</span>}
                                        </Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <Typography component="div" className="SupportedFormats">
                            <Typography component="h3">Download Template</Typography>
                            <div className="mar-top-16">
                                {(selectedDocumentType?.label === 'DRV' || selectedDocumentType?.label === 'UET') && <Typography component="div">Sample File Format
                                    <IconButton onClick={downloadSample}>
                                        <img src={materialsymbolsdownload} alt="material-symbols_download" />
                                    </IconButton>
                                </Typography>}
                            </div>
                        </Typography>
                    </Typography>
                </form>
            </Typography>
        </>
    );
}

export default FileHubUpload;
