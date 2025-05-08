import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { Edit, PushPin, PushPinOutlined,  Download  } from '@mui/icons-material';
import { Typography, IconButton, Checkbox, Button } from '@mui/material';
import { Delete} from 'images';
import dayjs from 'dayjs';
import {materialsymbolsdownload} from 'images';
import { base64ToFile } from '_utils';
import { alertActions, announcementAction } from '_store';

const AnnouncementDetails = ({ announcementData, onEditClick, handleRefresh }) => {
    const dispatch = useDispatch();
    const [pinnedAnnouncements, setPinnedAnnouncements] = useState({});
    const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);

    useEffect(() => {
        const initialPinnedState = {};
        announcementData?.forEach(data => {
            initialPinnedState[data.ID] = data.IsPinned;
        });
        setPinnedAnnouncements(initialPinnedState);
    }, [announcementData, setPinnedAnnouncements]);

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };

    const onDeleteClick = async (id) => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(announcementAction.deleteAnnouncement(id));

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload?.Message || result?.error.message, header: "Announcement" }));
                return;
            } else {
                handleRefresh();
                dispatch(alertActions.success({ message: "Deleted the Announcement Successfully.", header: "Announcement", showAfterRedirect: true }));

            }
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Delete Failed" }));
        }
    };

    const onBulkDeleteClick = async () => {
        dispatch(alertActions.clear());
        try {           
            const result = await dispatch(announcementAction.deleteAllAnnouncement(selectedAnnouncements));

            if (result?.error) {
                dispatch(alertActions.error({ message: "Failed to delete some announcements.", header: "Announcement" }));
                return;
            } else {
                handleRefresh();
                setSelectedAnnouncements([]);
                dispatch(alertActions.success({ message: result?.payload?.Message, header: "Announcement", showAfterRedirect: true }));

            }
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Delete Failed" }));
        }
    };

    const onPinClick = async (id) => {
        const newPinStatus = !pinnedAnnouncements[id];
        try {
            const transformedData = {
                AnnouncementID: id,
                IsPinned: newPinStatus
            };
            const result = await dispatch(announcementAction.pin({ transformedData }));

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Announcement" }));
                return;
            }
            setPinnedAnnouncements(prevState => ({
                ...prevState,
                [id]: newPinStatus
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Update Failed" }));
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedAnnouncements(prevState =>
            prevState.includes(id) ? prevState.filter(item => item !== id) : [...prevState, id]
        );
    };

    return (
        <Typography className='Announcementsdetails'>
            {/* <Typography variant="h3" component="h3" className="Announcements-text">Announcements</Typography> */}
            <Typography className='containedLoginbutton containedLoginbuttonlist'><Button className="Loginbutton" variant="contained" color="secondary" onClick={onBulkDeleteClick} disabled={selectedAnnouncements.length === 0}>
                Delete
            </Button>
            </Typography>
            <Typography className='Announcementcontainer' component="div">
                {announcementData && announcementData.length > 0 ? (
                    announcementData.map((data, index) => (
                        <Typography key={index} className='Announcementsnew' component="div">
                            <Grid container>
                                <Grid size={{ xs: 4, sm: 3, md: 3 }}>
                                    <Typography component="div" className="dateMonth dateMonthlist">
                                        <Checkbox
                                            checked={selectedAnnouncements.includes(data.ID)}
                                            onChange={() => handleCheckboxChange(data.ID)}
                                        />
                                        <Typography component='div'>
                                            <Typography component="h2">
                                                {dayjs(data.StartDate).format('DD')}
                                            </Typography>
                                            <Typography component="span">
                                                {dayjs(data.StartDate).format('MMM')}
                                            </Typography>
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="padding-left-15">
                                    <Typography component="div">
                                        <Typography component="h3" className='title'>{data.Title}</Typography>
                                        <Typography component="p" className='content'>{data.Data}</Typography>
                                        {/* {data?.FileData &&
                                            <Typography component="div">
                                                <Typography component="span" className="DocumentDescription">{data?.FileData.FileName}</Typography>
                                                <Typography component="div" className="DocumentTypeID">
                                                    <IconButton onClick={() => handleDownload(data?.FileData.File, data?.FileData.FileName)}>                                        
                                                        <img src={materialsymbolsdownload} alt='download'></img>
                                                    </IconButton>
                                                </Typography>
                                            </Typography>
                                        } */}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 2, sm: 3, md: 3 }} className='Announcementiconslist-flex'>
                                    <Typography component="div" className='Announcementiconslist'>

                                        <IconButton aria-label="pin" onClick={() => onPinClick(data.ID)}>
                                            {pinnedAnnouncements[data.ID] ? <PushPin color="primary" className='PushPinOutlined' /> : <PushPinOutlined color="default" className='PushPinOutlined'/>}
                                        </IconButton>
                                        <IconButton aria-label="edit" onClick={() => onEditClick(data)}>
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton aria-label="delete" className='Delete' onClick={() => onDeleteClick(data.ID)}>
                                            {/* <Delete color="secondary" /> */}
                                            <img src={Delete} alt="Delete" ></img>
                                        </IconButton>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                    ))
                ) : (
                    <Typography component="p">No announcements available.</Typography>
                )}
            </Typography>
        </Typography>
    );
}

export default AnnouncementDetails;