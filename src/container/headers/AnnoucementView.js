import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { Typography, IconButton } from '@mui/material';
import { materialsymbolsdownload } from '../../images';
import dayjs from 'dayjs';
import { base64ToFile } from '_utils';
import { alertActions, announcementAction } from '_store';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const AnnouncementView = ({ isCardDashboard }) => {
    const dispatch = useDispatch();
    // const header = "Notifications";
    const announcementsData = useSelector(x => x.announcement?.allAnnouncements);
    const data = announcementsData?.AnnouncementData || [];
    const authUser = useSelector(x => x.auth?.value);
    const id = useSelector(x => x.auth?.userId);
    const user = authUser?.Data;
    const userAccess = user?.UserAccess;
    const portalsList = userAccess ? userAccess.map(access => ({
        PortalId: access.PortalId,
        PortalName: access.PortalName,
        PortalKey: access.PortalKey,
    })) : [];

    const portalIdList = portalsList.map(portal => portal.PortalId);

    const portalIds = portalIdList.join(',');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(alertActions.clear());
                await dispatch(announcementAction.getAllAnnouncements({id, portalIds})).unwrap();
            } catch (error) {
                console.log(error?.message || error);
            }
        };
        fetchData();
    }, [dispatch, id,portalIds]);

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };

    const currentAndFutureAnnouncements = useMemo(() => {
        return data.filter(announcement => dayjs(announcement.StartDate).isSameOrAfter(dayjs(), 'day'));
    }, [data]);

    // const notificationCount = currentAndFutureAnnouncements.length || 0;

    return (
        <Typography className="Announcementcontainerlist ">
            {!isCardDashboard && (
                <Typography variant="h4" gutterBottom className="Announcementcontent">
                    Notifications
                </Typography>
            )}
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