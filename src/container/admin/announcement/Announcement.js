import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from '_store';
import { useForm } from 'react-hook-form';
import { AutocompleteInput, CustomFormControl, CustomStaticDateRangePicker, CustomTextArea, MultiSelectInput } from '_components';
import { styled } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AnnouncementDetails from './AnnouncementDetails';
import { supportSupportedFormat } from '_utils/constant';
import { newAnnounceMentSchema } from '_utils/validationSchema';
import { base64ToFile, convertToBase64, fileExtension, fileSizeReadable, fileTypeAcceptable } from '_utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link } from '@material-ui/core';
import { announcementAction } from '_store/announcement.slice';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const maxFileSize = 5000000;
const minFileSize = 0;

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

const Announcement = () => {
    const header = "Announcement";
    const dispatch = useDispatch();

    const [data, setData] = useState(null);
    const authUser = useSelector(x => x.auth?.value);
    const authUserId = useSelector(x => x.auth?.userId);
    const user = authUser?.Data;

    const [selectedPortal, setSelectedPortal] = useState(null);
    const [selectedRoleID, setSelectedRoleID] = useState(null);
    const [roleData, setRoleData] = useState([]);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [files, setFiles] = useState(null);

    const adminList = user?.UserAccess?.filter(access => access.Role.toLowerCase() === "admin");
    const portalsList = adminList ? adminList.map(admin => ({
        PortalId: admin.PortalId,
        PortalName: admin.PortalName,
        PortalKey: admin.PortalKey,
    })) : [];

    const portalData = portalsList ? portalsList.map(x => ({
        label: x.PortalName,
        value: x.PortalId
    })) : [];

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(newAnnounceMentSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        fetchData();
    }, [dispatch, reset, authUserId]);

    useEffect(() => {
        setValue('PortalID', selectedPortal);
    }, [selectedPortal, setValue]);

    useEffect(() => {
        setValue('RoleID', selectedRoleID);
    }, [selectedRoleID, setValue]);

    const fetchData = async () => {
        try {
            dispatch(alertActions.clear());
            const result = await dispatch(announcementAction.get(authUserId)).unwrap();
            setData(result?.Data);
        } catch (error) {
            dispatch(alertActions.error({
                message: error?.message || error,
                header: header
            }));
        }
    };

    const onSubmit = async (formData) => {
        dispatch(alertActions.clear());
        try {
            const formattedAnnouncementStartDate = dayjs(formData.SelectedDate[0]).utc().format('YYYY-MM-DDTHH:mm:ss');
            const formattedAnnouncementEndDate = dayjs(formData.SelectedDate[1]).utc().format('YYYY-MM-DDTHH:mm:ss');
            const transformedData = {
                ID: editingAnnouncement?.ID || 0,
                UserID: authUserId,
                PortalID: formData.PortalID,
                RoleID: formData.RoleID,
                Title: formData.Title,
                Data: formData.Data,
                StartDate: formattedAnnouncementStartDate,
                EndDate: formattedAnnouncementEndDate,
                IsPinned: editingAnnouncement?.IsPinned || false,
                IsActive: true,
                FileData: files
            };

            let result;
            if (editingAnnouncement && editingAnnouncement?.ID) {
                result = await dispatch(announcementAction.update({ id: editingAnnouncement.ID, transformedData }));
            } else {
                result = await dispatch(announcementAction.insert({ transformedData }));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            resetAllValues();
            handleRefresh();
            dispatch(alertActions.success({ message: "Announcement published Successfully.", header: header, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const handleRefresh = async () => {
        await fetchData();
        clearFileInput();
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const handleRoleChange = (newValue) => {
        setSelectedRoleID(newValue);
    };

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };

    const handleError = (error) => {
        dispatch(alertActions.error(error.message));
    };

    const handleChange = async (event) => {
        event.preventDefault();
        let filesAdded = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        const file = filesAdded[0];

        file.extension = fileExtension(file);
        file.sizeReadable = fileSizeReadable(file.size);

        if (file.size > maxFileSize) {
            handleError({ code: 2, message: `${file.name} is too large` });
            return;
        }

        if (file.size < minFileSize) {
            handleError({ code: 3, message: `${file.name} is too small` });
            return;
        }

        if (!fileTypeAcceptable(supportSupportedFormat, file)) {
            handleError({ code: 1, message: `${file.name} is not a valid file type` });
            return;
        }

        const base64 = await convertToBase64(file);
        const existingFiles = editingAnnouncement?.FileData;

        const fileData = {
            ID: existingFiles?.ID || null,
            AdditionalID: editingAnnouncement?.ID || 0,
            DocumentTypeID: 0,
            FileName: file.name,
            Format: file.extension,
            Size: file.size,
            PortalKey: existingFiles?.PortalKey || "AM",
            File: base64,
            Url: null
        };
        setFiles(fileData);
    };

    const fileInputRef = useRef(null);

    const clearFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleEditClick = async (announcement) => {
        setEditingAnnouncement(announcement);
        setValue('Title', announcement.Title);
        setValue('Data', announcement.Data);
        setValue('SelectedDate', [dayjs(announcement.StartDate), dayjs(announcement.EndDate)]);
        setValue('PortalID', announcement.PortalID);
        setValue('RoleID', announcement.RoleID);
        setSelectedPortal(announcement.PortalID);
        await setRoleChange(announcement.PortalID);
        setSelectedRoleID(announcement.RoleID);
        setFiles(announcement.FileData || null); // Reset files state
        clearFileInput();

        // Append class to title element
        const titleElement = document.getElementById('Title'); // Use the ID of your title element
        if (titleElement) {
            titleElement.classList.add('editlabel'); // Replace with the class you want to add
        }

        await trigger();
    };

    const handleCancelClick = () => {
        resetAllValues();
        clearFileInput();
    };

    const resetAllValues = () => {
        setEditingAnnouncement(null);
        setValue('Title', null);
        setValue('Data', null);
        setValue('SelectedDate', null);
        setValue('PortalID', null);
        setValue('RoleID', null);
        setSelectedPortal(null);
        setSelectedRoleID(null);
        setFiles(null);
        reset();
    };

    const handlePortalChange = (e, newValue) => {
        setSelectedPortal(newValue);
        setRoleChange(newValue);
    };

    const setRoleChange = (portalId) => {
        const portalRole = data?.Roles?.filter(x => x.PortalID === portalId);
        const roles = portalRole ? portalRole.map(x => ({
            label: x.RoleName,
            value: x.RoleID.toString()
        })) : [];
        setRoleData(roles);
    };

    return (
        <Box className="Announcementcontainerlist">
            <Typography component="h2" className='Announcementcontent'>ANNOUNCEMENTS</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                <Grid container direction="row" spacing={{ xs: 2, md: 3 }} >
                    <Grid size={{ xs: 12, sm: 12, md: 4 }} className='CardDetailContainer-right'>
                        <Typography variant="div" component="div" className="">
                            {data &&
                                <AnnouncementDetails announcementData={data.AnnouncementData} onEditClick={handleEditClick} handleRefresh={handleRefresh} />
                            }
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} className='CardDetailContainer' >
                        <Grid container direction="row" spacing={{ xs: 2, md: 3 }} >
                            <Grid size={{ xs: 12, sm: 12, md: 8 }}  >
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}  >
                                        <Grid container  >
                                            <Grid size={{ xs: 12, sm: 12, md: 12 }}  >
                                                <Typography component="div" className='passwordcheck '>
                                                    <AutocompleteInput
                                                        id="PortalID"
                                                        control={control}
                                                        name="PortalID"
                                                        label="Select Portal"
                                                        options={portalData}
                                                        error={!!errors.PortalID}
                                                        helperText={errors.PortalID?.message}
                                                        handleBlur={handleBlur}
                                                        onChange={handlePortalChange}
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                        <Grid container  >
                                            <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                                <Typography component="div" className='passwordcheck '>
                                                    <MultiSelectInput
                                                        id="RoleID"
                                                        control={control}
                                                        name="RoleID"
                                                        label="Select Recipent"
                                                        options={roleData}
                                                        value={selectedRoleID}
                                                        onChange={handleRoleChange}
                                                        error={!!errors.RoleID}
                                                        helperText={errors.RoleID?.message}
                                                        handleBlur={handleBlur}
                                                        setValue={setValue}
                                                        trigger={trigger}
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>


                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <Grid container >
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }} className="SelectedDate">
                                        <Typography component="div" className="passwordcheck border-none">
                                            <CustomStaticDateRangePicker
                                                id="SelectedDate"
                                                control={control}
                                                trigger={trigger}
                                                name="SelectedDate"
                                                label="Select Dates"
                                                error={!!errors.SelectedDate}
                                                helperText={errors.SelectedDate?.message}
                                                handleBlur={handleBlur}
                                                minimumDate={new Date()}
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                        <CustomFormControl
                            id="Title"
                            name="Title"
                            label="Title"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                        />
                        <Box className="ComposeAnnouncement">
                            <CustomTextArea
                                id="Data"
                                label="Compose Announcement"
                                register={register}
                                errors={errors}
                            />
                        </Box>
                        <Box>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                className="Uploadfiles"
                                startIcon={<AttachFileIcon />}
                            >
                                <span type="file" className="Browsechoose">Attach Document </span>
                                {files &&
                                    <Link onClick={() => handleDownload(files?.File, files?.FileName)}>{` - ${files?.FileName}`}</Link>
                                }
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleChange}
                                    ref={fileInputRef}
                                />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} className="Personal-Information">
                    <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                    <Button type="submit"
                        fullWidth
                        variant="contained"
                        color="primary" className='submitbutton'
                        disabled={!isValid}
                    >publish</Button>
                </Grid>
            </form>
        </Box>
    );
};

export default Announcement;