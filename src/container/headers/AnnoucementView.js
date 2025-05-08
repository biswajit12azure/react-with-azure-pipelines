import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { Edit, PushPin, PushPinOutlined, Download } from '@mui/icons-material';
import { Typography, IconButton, Checkbox, Button } from '@mui/material';
import { materialsymbolsdownload } from '../../images';
import dayjs from 'dayjs';
import { base64ToFile } from '_utils';
import { alertActions, announcementAction } from '_store';
import { announcementData } from '_utils/constant';

const AnnouncementView = ({ isCardDashboard }) => {
    const dispatch = useDispatch();
    const header = "Notifications";
    const announcementsData = useSelector(x => x.announcement?.allAnnouncements);
    const data = announcementsData?.AnnouncementData || [];
    const authUserId = useSelector(x => x.auth?.userId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(alertActions.clear());
                await dispatch(announcementAction.getAllAnnouncements(authUserId)).unwrap();
            } catch (error) {
                console.log(error?.message || error);
            }
        };
        fetchData();
    }, [dispatch, authUserId]);

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };
    return (
        <Typography className="Announcementcontainerlist ">
            {!isCardDashboard && <Typography variant="h4" gutterBottom className="Announcementcontent ">
                Notifications
            </Typography>
            }
            <Typography className='Announcementcontainer' component="div">
                {data && data.length > 0 ? (
                    data.map((data, index) => (
                        <Typography key={index} className='Announcementsnew' component="div">
                            <Grid container>
                                <Grid size={{ xs: 4, sm: 4, md: 3 }}>
                                    <Typography component="div" className="dateMonth dateMonthlist">
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
                                <Grid size={{ xs: 8, sm: 8, md: 9 }} className="padding-left-15">
                                    <Typography component="div">
                                        <Typography component="h3" className='title'>{data.Title}</Typography>
                                        <Typography component="p" className='content'>{data.Data}</Typography>
                                        {data?.FileData &&
                                            <Typography component="div">
                                                <Typography component="span" className="DocumentDescription">{data?.FileData.FileName}</Typography>
                                                <Typography component="div" className="DocumentTypeID">
                                                    <IconButton onClick={() => handleDownload(data?.FileData.File, data?.FileData.FileName)}>

                                                        <img src={materialsymbolsdownload} alt='download'></img>
                                                    </IconButton>
                                                </Typography>
                                            </Typography>
                                        }
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

export default AnnouncementView;