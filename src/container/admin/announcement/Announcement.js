import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { alertActions } from '_store';
import { AutocompleteInput, CustomStaticDateRangePicker2, CustomTextArea, ModalPopup, MultiSelectInput } from '_components';
import { styled } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AnnouncementDetails from './AnnouncementDetails';
import { announcementFormat } from '_utils/constant';
import { newAnnounceMentSchema } from '_utils/validationSchema';
import { base64ToFile, convertToBase64, fileExtension, fileSizeReadable, fileTypeAcceptable } from '_utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link } from '@material-ui/core';
import { announcementAction } from '_store/announcement.slice';
import { Delete, materialsymbolsdownload } from 'images';

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
    const id = useSelector(x => x.auth?.userId);
    const user = authUser?.Data;

    const [selectedPortal, setSelectedPortal] = useState(null);
    const [selectedRoleID, setSelectedRoleID] = useState(null);
    const [roleData, setRoleData] = useState([]);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [files, setFiles] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formDate, setFormDate] = useState({ startDate: null, endDate: null });
    const adminList = user?.UserAccess?.filter(access => access.Role.toLowerCase() === "admin");
    const portalsList = adminList ? adminList.map(admin => ({
        PortalId: admin.PortalId,
        PortalName: admin.PortalName,
        PortalKey: admin.PortalKey,
    })) : [];

    const portalIdList = portalsList.map(portal => portal.PortalId);

    const portalIds = portalIdList.join(',');

    const portalData = portalsList ? portalsList.map(x => ({
        label: x.PortalName,
        value: x.PortalId
    })) : [];

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(newAnnounceMentSchema),
        defaultValues:{
            'SelectedDate':[dayjs(new Date()),dayjs(new Date())]
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        fetchData();
    }, [dispatch, reset, id,portalIds]);

    useEffect(() => {
        setValue('PortalID', selectedPortal);
    }, [selectedPortal, setValue]);

    useEffect(() => {
        setValue('RoleID', selectedRoleID);
    }, [selectedRoleID, setValue]);

    const fetchData = async () => {
        try {
            dispatch(alertActions.clear());
            const result = await dispatch(announcementAction.get({id, portalIds})).unwrap();
            setData(result?.Data);
        } catch (error) {
            dispatch(alertActions.error({
                message: error?.message || error,
                header: header
            }));
        }
    };

    const handleOpenModalAnnoucementCreate = () => {
        setIsModalOpen(true);
    };

    const CloseModalAnnouncementCreate = () => {
        setIsModalOpen(false);
    };

    const onSubmit = async (formData) => {
        dispatch(alertActions.clear());
        try {
            const formattedAnnouncementStartDate = dayjs(formDate.startDate).utc().format('YYYY-MM-DDTHH:mm:ss');
            const formattedAnnouncementEndDate = dayjs(formDate.endDate).utc().format('YYYY-MM-DDTHH:mm:ss');
            const transformedData = {
                ID: editingAnnouncement?.ID || 0,
                UserID: id,
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
            if(result.payload.Succeeded){
                dispatch(alertActions.success({ message: result.payload.Message, header: header, showAfterRedirect: true }));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            resetAllValues();
            handleRefresh();
            setFormDate({ startDate: null, endDate: null });

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

    const handleDeleteFile = () => {
        if (files) {
            setFiles(null);

            dispatch(alertActions.success({
                message: "Announcement attachment deleted successfully",
                header: "File Management",
            }));
        }
    };

    const handleDateRangeChange = (dateRange) => {
        setFormDate(dateRange);
        setValue('SelectedDate', [dayjs(dateRange.startDate), dayjs(dateRange.endDate)]);

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
            handleError({ code: 2, message: `File size cannot exceed 5MB` });
            return;
        }

        if (file.size < minFileSize) {
            handleError({ code: 3, message: `${file.name} is too small` });
            return;
        }

        if (!fileTypeAcceptable(announcementFormat, file)) {
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
        const startDate = dayjs(announcement.StartDate).toDate();
        const endDate = dayjs(announcement.EndDate).toDate();
        setValue('SelectedDate', [startDate, endDate]);
        setFormDate({ startDate, endDate });
        setEditingAnnouncement(announcement);
        setValue('Title', announcement.Title);
        setValue('Data', announcement.Data);
        setValue('PortalID', announcement.PortalID);
        setValue('RoleID', announcement.RoleID);
        setSelectedPortal(announcement.PortalID);
        await setRoleChange(announcement.PortalID);
        setSelectedRoleID(announcement.RoleID);
        setFiles(announcement.FileData || null);
        clearFileInput();

        // Append class to title element
        const titleElement = document.getElementById('Title');
        if (titleElement) {
            titleElement.classList.add('editlabel');
        }

        await trigger();
    };

    const handleCancelClick = () => {
        resetAllValues();
        clearFileInput();
        setFormDate({ startDate: null, endDate: null });
    };
    const resetAllValues = () => {
        setEditingAnnouncement(null);
        setValue('Title', null);
        setValue('Data', null);
        setValue('SelectedDate', [null, null]);
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
        <Box className="Announcementcontainerlist Announcementlist">
            <Typography component="h2" className='Announcementcontent'>ANNOUNCEMENTS</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                <Grid container direction="row" spacing={{ xs: 2, md: 3 }} >
                    <Grid size={{ xs: 12, sm: 12, md: 4 }} className='CardDetailContainer-right'>
                        <Typography variant="div" component="div" className="">
                            {data &&
                                <AnnouncementDetails
                                    announcementData={data.AnnouncementData}
                                    onEditClick={handleEditClick}
                                    handleRefresh={handleRefresh}
                                    portalData={portalData}
                                    roleData={data?.Roles}
                                />
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
                                                <Typography component="div" className='passwordcheck marbottom0 selecticon '>
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
                                                <Typography component="div" className='passwordcheck  marbottom0 selecticon'>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4 }} >
                                <Grid container >
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }} className="SelectedDate">
                                        <Typography component="div" className="passwordcheck border-none marbottom0 selecticon">
                                            <Controller
                                                name="SelectedDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomStaticDateRangePicker2
                                                        {...field}
                                                        startDate={formDate.startDate}
                                                        endDate={formDate.endDate}
                                                        onDateRangeChange={handleDateRangeChange}
                                                        label="Select Dates"
                                                        error={!!errors.SelectedDate}
                                                        helperText={errors.SelectedDate?.message}
                                                        minimumDate={new Date()}
                                                    />
                                                )}
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Typography className='marbottom0 titlemarginbottom'>
                            {/* <CustomFormControl
                                id="Title"
                                name="Title"
                                label="Title"
                                type="text"
                                register={register}
                                errors={errors}
                                handleBlur={handleBlur}
                            /> */}

                            <CustomTextArea
                                id="Title"
                                label="Title"
                                type="text"
                                maxLength={50}
                                register={register}
                                errors={errors}
                                handleBlur={handleBlur}
                            />

                        </Typography>
                        <Box className="ComposeAnnouncement">
                            <CustomTextArea
                                id="Data"
                                label="Compose Announcement"
                                maxLength={1000}
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
                            {files && (
                                <span className='tableicons'>
                                    <img
                                        src={materialsymbolsdownload}
                                        alt='Download'
                                        onClick={() => handleDownload(files?.File, files?.FileName)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <IconButton className='delete' onClick={handleOpenModalAnnoucementCreate}>
                                        <img
                                            src={Delete}
                                            alt="Delete"
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </IconButton>

                                    {isModalOpen && <ModalPopup
                                        header="File Delete"
                                        message1="Are you sure, you want to delete this Announcement attachment?"
                                        btnPrimaryText="Confirm"
                                        btnSecondaryText="Cancel"
                                        handlePrimaryClick={() => { handleDeleteFile(); setIsModalOpen(false); }}
                                        handleSecondaryClick={() => CloseModalAnnouncementCreate()}
                                    />
                                    }
                                </span>
                            )}
                        </Box>
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
                    </Grid>

                </Grid>
                {/* <Grid item xs={12} sm={12} md={12} className="Personal-Information">
                    <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                    <Button type="submit"
                        fullWidth
                        variant="contained"
                        color="primary" className='submitbutton'
                        disabled={!isValid}
                    >publish</Button>
                </Grid> */}
            </form>
        </Box>
    );
};

export default Announcement;
