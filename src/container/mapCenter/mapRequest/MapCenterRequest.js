import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Button } from '@mui/material';
import { IconButton } from "@material-ui/core";
import Grid from "@mui/material/Grid2";
import { alertActions, mapCenterAction, masterActions } from '_store';
import { additionalDetailsValidationSchema, companyPOCValidationSchema, companyValidationSchema, mapCenterValidationSchema } from "_utils/validationSchema";
import { supportedFormat } from '_utils/constant';
import { base64ToFile } from '_utils';
import { AutocompleteInput, UploadFiles, UnderConstruction } from '_components';
import { CompanyDetails, AdditionalDetails, CompanyPOC } from "container/user";
import { mapCenterRegistrationLabels } from '_utils/labels';
import { raphaelinfo, materialsymbolsdownload } from '../../../images';
import MapCenterRequestlist from 'container/user/ProfileDetails/MapCenterRequestlist';
import MapCenterRequestlistRight from 'container/user/ProfileDetails/MapCenterRequestlistRight';

const MapCenterRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { portalkey, id } = useParams();
    const header = 'Map Center';
    const user = useSelector(x => x.mapcenter?.userData);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
    const [files, setFiles] = useState([]);
    const documentTypeData = user?.DocumentData || [];
    const states = user?.State || [];
    const exsistingFiles = user?.FileData || [];

    const documentData = documentTypeData.map(x => ({
        label: x.DocumentDescription,
        value: x.DocumentTypeID
    }));

    const stateData = states.map(x => ({
        label: x.StateName,
        value: x.StateId
    }));

    // const combinedSchema = additionalDetailsValidationSchema
    //     .concat(companyValidationSchema)
    //     .concat(companyPOCValidationSchema);

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(mapCenterValidationSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(mapCenterAction.clear());
                const user = await dispatch(mapCenterAction.get({ id })).unwrap();
                const data = user?.Data;
                sessionStorage.setItem('mapcenterUserID', id);
                reset(data);
                if (data?.FileData) {
                    setFiles(data?.FileData.map(file => ({
                        ID: file.ID,
                        AdditionalID: file.AdditionalID,
                        DocumentTypeID: file.DocumentTypeID,
                        FileName: file.FileName,
                        Format: file.Format,
                        Size: file.Size,
                        PortalKey: file.PortalKey,
                        File: file.File,
                        Url: file.Url
                    })));
                }
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: header
                }));
                reset(user);
            }
        };
        fetchData();
    }, [id, dispatch, reset, portalkey]);

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            // Validate that all required document types have files
            const missingDocumentTypes = documentTypeData.filter(docType =>
                !files.some(file => file.DocumentTypeID === docType.DocumentTypeID)
            );

            if (!documentData || missingDocumentTypes.length > 0) {
                const missingDescriptions = missingDocumentTypes.map(docType => docType.DocumentDescription).join(', ');
                dispatch(alertActions.error({
                    message: `Missing files for document types: ${missingDescriptions}`,
                    header: header
                }));
                return;
            }

            const transformedData = {
                UserID: id,
                FullName: data.FullName,
                AlternateEmail: user.AlternateEmail || '',
                DLState: data.DLState,
                DLNumber: data.DLNumber,
                HomeStreetAddress1: data.HomeStreetAddress1,
                HomeStreetAddress2: data.HomeStreetAddress2 || '',
                HomeCity: data.HomeCity,
                HomeState: data.HomeState,
                HomeZipCode: data.HomeZipCode,
                CompanyName: data.CompanyName,
                TaxIdentificationNumber: data.TaxIdentificationNumber,
                CompanyStreetAddress1: data.CompanyStreetAddress1,
                CompanyStreetAddress2: data.CompanyStreetAddress2 || '',
                CompanyCity: data.CompanyCity,
                CompanyState: data.CompanyState,
                CompanyZipCode: data.CompanyZipCode,
                CompanyContactName: data.CompanyContactName,
                CompanyContactTelephone: data.CompanyContactTelephone,
                CompanyContactEmailAddress: data.CompanyContactEmailAddress,
                AuthorizedWGLContact: data.AuthorizedWGLContact,
                AdditionalID: user?.AdditionalID || 0,
                StatusID: 1,
                PhoneNumber: user.MobileNumber,
                EmailID: user.EmailID,
                ModifiedBy: data.FullName,
                FileData: files
            };
            let result;
            if (user?.AdditionalID !== 0) {
                result = await dispatch(mapCenterAction.update({ id, transformedData }));
            } else {
                result = await dispatch(mapCenterAction.insert({ id, transformedData }));
            }

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            sessionStorage.removeItem('mapcenterUserID');
            navigate('/');
            dispatch(alertActions.success({ message: mapCenterRegistrationLabels.message1, header: mapCenterRegistrationLabels.header, showAfterRedirect: true }));

        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName); // Trigger validation for the field
    };

    const handleOnChange = (event, newvalue) => {
        setSelectedDocumentType(newvalue);
    };

    const handleFileChange = (newFiles) => {
        setFiles(newFiles);
    };

    const handleDownload = async () => {
        try {
            const result = await dispatch(masterActions.getNondisclosureDocument()).unwrap();
            if (!result?.error) {
                base64ToFile(result.File, result.FileName);
            }

        }
        catch (error) {
            dispatch(alertActions.error({
                message: error?.message || error,
                header: header
            }));
        }
    };

    const handleCancelClick=()=>
    {
        navigate('/');
    }

    return (
        <>
            {/* {!(user?.loading || user?.error) && ( */}
                <Typography component="div" className="MapCenterAccecss">
                    <Typography component="div" className="MapCenterAccecssheading">
                        <Typography component="h1" variant="h5">Map Center Access</Typography>
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography className="Personal-Information-container" component="div">
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6, md: 6 }} className="Personal-Information">
                                                    <Typography component="div" className="mapcontainer">
                                                        
                                                        <MapCenterRequestlist
                                                            handleBlur={handleBlur}
                                                            register={register}
                                                            control={control}
                                                            stateData={stateData}
                                                            errors={errors}
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6 }} className="Personal-Information">
                                                    <Typography component="div" className="mapcontainer">
                                                         
                                                        <MapCenterRequestlistRight
                                                            handleBlur={handleBlur}
                                                            register={register}
                                                            errors={errors}
                                                            control={control}
                                                            stateData={stateData}
                                                        />
                                                    </Typography>
                                                </Grid>
                                                
                                            </Grid>
                                            
                                        </Grid>
                                     
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Typography>
                      
                        <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                            <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" className="CompleteRegistration" color="primary" disabled={!isValid} >
                                Complete Registration
                            </Button>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="containedLoginbuttonleft">
                    <Typography component="div" className="containedLoginbutton ResetPasswordbutton">
                        <Button
                            type="submit"
                            variant="contained"
                            className='Rejectbutton'
                            color="primary"
                             
                        >
                            DENY
                        </Button>
                        <Button type="submit" variant="contained" className="CompleteRegistration" color="primary"   >
                        Review
                            </Button>
                    </Typography>
                    </Grid>
                        </Grid>
                    </form>
                </Typography>
            {/* )} */}
            {/* {user?.error && <UnderConstruction />} */}
        </>
    );
};

export default MapCenterRequest;