import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FilterListOff } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { Edit, PushPin, PushPinOutlined } from '@mui/icons-material';
import { Typography, IconButton, Checkbox, Tooltip, Box } from '@mui/material';
import { Delete, Deletewhite } from 'images';
import dayjs from 'dayjs';
// import { base64ToFile } from '_utils';
import { alertActions, announcementAction, announcementFilterActions } from '_store';
import AnnouncementFilter from './AnnouncementFilter';
import { ModalPopup } from '_components';

const AnnouncementDetails = ({ announcementData, onEditClick, handleRefresh,portalData,roleData}) => {
    const dispatch = useDispatch();
    const [announcementDataList,setannouncementDataList] =useState(announcementData);
    const [pinnedAnnouncements, setPinnedAnnouncements] = useState({});
    const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [isSingleDelete,setIsSingleDelete] = useState(null);
    useEffect(() => {
        const initialPinnedState = {};
        announcementDataList?.forEach(data => {
            initialPinnedState[data.ID] = data.IsPinned;
        });
        setPinnedAnnouncements(initialPinnedState);
    }, [announcementDataList, setPinnedAnnouncements]);

    useEffect(()=>setannouncementDataList(announcementData),[announcementData])

    const onDeleteClick = async () => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(announcementAction.deleteAnnouncement(isSingleDelete));

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

    const handleFilterOpen = () => {
        setIsFilterOpen(true);
    };

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    const handleOpenModalAnnoucement = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSingleModalOpen(false);
        setSelectedAnnouncements([]);
    };

    const handleSingleOpenDelete = (data) => {
        setIsSingleDelete(data.ID)
        setIsSingleModalOpen(true);
    }

    const onApplyFilter = async (Data) => {
        const result = await dispatch(announcementFilterActions.getAnnouncements(Data));
      if(result?.payload?.Succeeded){
            setannouncementDataList(result?.payload?.Data)
        }
        if (result?.error) {
            dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Announcement" }));
            return;
        }
    }


    return (
        <Typography className='Announcementsdetails'>

            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                    }}
                >
                    <Tooltip title="clear filter" className='Deactivate'>
                        <div>
                            <IconButton onClick={handleRefresh}>
                                <FilterListOff variant="contained" color="secondary" />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip title="Delete Selected" className='DeleteSelected'>
                        <div>
                            <IconButton className='delete' onClick={handleOpenModalAnnoucement} disabled={selectedAnnouncements.length === 0}>
                                <img src={Deletewhite} alt="Delete" />
                            </IconButton>

                            {isModalOpen && <ModalPopup
                                header="File Delete"
                                message1={
                                    selectedAnnouncements.length > 1
                                        ? "Are you sure, you want to delete selected announcements?"
                                        : "Are you sure, you want to delete the announcement?"
                                }
                                btnPrimaryText="Confirm"
                                btnSecondaryText="Cancel"
                                handlePrimaryClick={() => { onBulkDeleteClick(); setIsModalOpen(false); }}
                                handleSecondaryClick={() => handleCloseModal()}
                            />
                            }
                        </div>
                    </Tooltip>
                </Box>
                <AnnouncementFilter
                    isOpen={isFilterOpen}
                    onClose={handleFilterClose}
                    onOpen={handleFilterOpen}
                    portalData={portalData}
                    roleData={roleData}
                    onApplyFilter={onApplyFilter}
                />
            </Box>
            <Typography className='Announcementcontainer' component="div">
                {announcementDataList && announcementDataList.length > 0 ? (
                    announcementDataList.map((data, index) => (
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

                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 2, sm: 3, md: 3 }} className='Announcementiconslist-flex'>
                                    <Typography component="div" className='Announcementiconslist'>

                                        <IconButton aria-label="pin" onClick={() => onPinClick(data.ID)}>
                                            {pinnedAnnouncements[data.ID] ? <PushPin color="primary" className='PushPinOutlined' /> : <PushPinOutlined color="default" className='PushPinOutlined' />}
                                        </IconButton>
                                        <IconButton aria-label="edit" onClick={() => onEditClick(data)}>
                                            <Edit color="primary" />
                                        </IconButton>
                                      
                                        <IconButton aria-label="delete" className='Delete' onClick={()=>handleSingleOpenDelete(data)}>
                                            <img src={Delete} alt="Delete" ></img>
                                        </IconButton>
                                        
                            {isSingleModalOpen && <ModalPopup
                                header="File Delete"
                                message1={`Are you sure, you want to delete the announcement?`}
                                btnPrimaryText="Confirm"
                                btnSecondaryText="Cancel"
                                handlePrimaryClick={() => { onDeleteClick(); setIsSingleModalOpen(false); }}
                                handleSecondaryClick={() => handleCloseModal()}
                            />
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

export default AnnouncementDetails;
