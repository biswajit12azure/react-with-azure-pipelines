import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Button, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { CheckCircleRounded } from '@mui/icons-material';
import {} from "_utils";
import { alertActions } from "_store";
import { convertToBase64,base64ToFile ,fileExtension ,fileSizeReadable,fileTypeAcceptable} from '_utils';
import { uploadLabels } from "_utils/labels";
import ModalPopup from "./ModalPopup";
import { materialsymbolsupload  , materialsymbolsdownload ,Delete} from '../images';
const UploadFiles = ({
    portalKey,
    selectedDocumentType,
    multiple = true,
    documentTypes,
    supportedFormats,
    maxFiles = Infinity,
    maxFileSize = 5 * 1024 * 1024,
    minFileSize = 0,
    onFileChange,
    initialFiles = [],
    exsistingFiles=[]
}) => {
    const [files, setFiles] = useState(initialFiles);
    const [open, setOpen] = useState(false);
    const [fileToRemove, setFileToRemove] = useState(null);
    const dispatch = useDispatch();
    const idCounter = useRef(1);
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
        setFiles(initialFiles);
    }, [initialFiles]);

    const handleError = (error, file) => {
        dispatch(alertActions.error(error.message));
    };

    const handleChange = async (event) => {
        event.preventDefault();
        let filesAdded = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        if (documentTypes && documentTypes.length > 0 && !selectedDocumentType) {
            dispatch(alertActions.error({
                message: 'Please select any Document Type',
                header: "Validation Error"
            }));
            return;
        }

        if (multiple === false && filesAdded.length > 1) {
            filesAdded = [filesAdded[0]];
        }

        const fileResults = [];
        for (let i = 0; i < filesAdded.length; i += 1) {
            const file = filesAdded[i];

            file.DocumentTypeID = documentTypes && documentTypes.length > 0 ? selectedDocumentType : `files-${idCounter.current}`;

            file.extension = fileExtension(file);
            file.sizeReadable = fileSizeReadable(file.size);

            if (file.size > maxFileSize) {
                // handleError({
                //     code: 2,
                //     message: `File size cannot exceed 5MB`,
                // }, file);
                dispatch(alertActions.error({
                    message: `File size cannot exceed 5MB`, 
                    header:`File Upload`
                }));
                break;
            }

            if (file.size < minFileSize) {
                // handleError({
                //     code: 3,
                //     message: `${file.name} is too small`,
                // }, file);
                dispatch(alertActions.error({
                    message: `${file.name} is too small`, 
                    header:`File Upload`
                }));
                break;
            }

            if (!fileTypeAcceptable(supportedFormats, file)) {
                // handleError({
                //     code: 1,
                //     message: `Inavalid file format.`,
                // }, file);
                 dispatch(alertActions.error({
                                message: `Invalid file format.`, 
                                header:`File Upload`
                            }));
                break;
            }

            const oldFileData= exsistingFiles?.find(f=>f.DocumentTypeID===file.DocumentTypeID);
            const base64 = await convertToBase64(file);
            const fileData = {
                ID: oldFileData?.ID || null, // This will be updated if replacing an existing file
                AdditionalID: oldFileData?.AdditionalID || 0,
                DocumentTypeID: file.DocumentTypeID,
                FileName: file.name,
                Format: file.extension,
                Size: file.size,
                PortalKey: portalKey, // Replace with actual portal key if needed
                File: base64,
                Url: oldFileData?.Url || null
            };

            fileResults.push(fileData);
        }

       
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.map(prevFile => {
                const newFile = fileResults.find(newFile => newFile.DocumentTypeID === prevFile.DocumentTypeID);
                return newFile ? {
                    ...newFile, ID: prevFile.ID,
                    AdditionalID: prevFile.AdditionalID || 0,
                    Url: prevFile.Url || ''
                } : prevFile;
            });

            const newUniqueFiles = fileResults.filter(newFile =>
                !prevFiles.some(prevFile => prevFile.DocumentTypeID === newFile.DocumentTypeID)
            );

            const newFiles = [...updatedFiles, ...newUniqueFiles];
            onFileChange(newFiles);
            return newFiles;
        });
    };

    const handleFileRemove = (documentTypeId) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter(prevFile => prevFile.DocumentTypeID !== documentTypeId);
            onFileChange(updatedFiles); // Notify parent component of file changes
            return updatedFiles;
        });
        setOpen(false);
        setFileToRemove(null); // Reset fileToRemove state
    };

    const handleDialogOpen = (documentTypeId) => {
        setFileToRemove(documentTypeId);
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setFileToRemove(null); // Reset fileToRemove state
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle file input change
        }
    };

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };

    return (
        <Typography component="div" className="UploadContainer">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={12}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        className={`Uploadfiles ${!selectedDocumentType ? 'disabled' : ''}`}
                        startIcon={<img src={materialsymbolsupload} alt="Upload" />}
                    >
                        <span> Upload your files here</span>
                        <span type="file" onChange={handleFileInputChange} className="Browsechoose"> Browse and choose the file(s) you want to upload </span>
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleChange}
                            disabled={!selectedDocumentType}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <Typography component="div" className="SupportedFormats">
                        <Typography component="h3">Supported Formats</Typography>
                        <Typography component="div" className="fileformatlist">
                            {supportedFormats && supportedFormats.map(format => <span key={format}>{format}</span>)}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <Typography component="div" className="SupportedFormats Personal-Informationsheading">
                        <Typography component="h2">Uploaded Documents</Typography>
                        <Typography component="div" className="fileformat">
                            {documentTypes && documentTypes.map(type => {
                                const uploadedDocument = files.filter(x => x.DocumentTypeID === type.DocumentTypeID);
                                if (uploadedDocument && uploadedDocument.length > 0) {
                                    return (
                                        <div className="mar-top-16" key={type.DocumentTypeID}>
                                            <Typography component="div" >
                                                <CheckCircleRounded fontSize="small" style={{ color: green[500] }} />
                                                <Typography component="p" className="DocumentDescription">{type.DocumentDescription}</Typography> 
                                                <Typography component="div" className="DocumentTypeID">
                                                    <Grid container>
                                                        <Typography className="textwordwrap">{uploadedDocument[0].FileName}</Typography>
                                                    <IconButton onClick={() => handleDownload(uploadedDocument[0].File, uploadedDocument[0].FileName)}>
                                                  
                                                  <img src={materialsymbolsdownload} alt='download'></img>                                              
                                               </IconButton>
                                               <IconButton onClick={() => handleDialogOpen(type.DocumentTypeID)}>
                                               {/* <Delete variant="contained" color="secondary" /> */}
                                                <img src={Delete} alt="Delete" ></img>
                                               </IconButton>
                                                    </Grid>
                                               
                                                </Typography>
                                            </Typography>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="mar-top-16" key={type.DocumentTypeID}>
                                            <Typography component="div"><CheckCircleRounded fontSize="small" color="disabled" /><Typography component="span" className="DocumentDescription"> {type.DocumentDescription}</Typography></Typography>
                                        </div>
                                    );
                                }
                            })}
                        </Typography>
                    </Typography>
                </Grid>
            </Grid>
            {open && <ModalPopup
                header={uploadLabels.header}
                message1={uploadLabels.message1}
                btnPrimaryText={uploadLabels.btnPrimaryText}
                btnSecondaryText={uploadLabels.btnSecondaryText}
                handlePrimaryClick={() => handleFileRemove(fileToRemove)}
                handleSecondaryClick={handleDialogClose} 
            />}
        </Typography>
    );
};

export default UploadFiles;