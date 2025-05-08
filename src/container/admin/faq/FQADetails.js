import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Edit } from '@mui/icons-material';
import { Delete } from 'images';
import { alertActions, faqAction } from '_store';
import { useDispatch } from 'react-redux';

const FAQDetails = ({ faqData, portalData, onEditClick, handleRefresh }) => {
    const header = "FQA";
    const dispatch= useDispatch();
    const portalMap = portalData?.reduce((acc, portal) => {
        acc[portal.value] = portal.label;
        return acc;
    }, {});

    const groupedData = faqData?.reduce((acc, item) => {
        if (!acc[item.PortalID]) {
            acc[item.PortalID] = [];
        }
        acc[item.PortalID].push(item);
        return acc;
    }, {});

    const onDeleteClick = async (id) => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(faqAction.deleteFaq(id));

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload?.Message || result?.error.message, header: header }));
                return;
            } else {
                handleRefresh();
                dispatch(alertActions.success({ message: "Deleted the FQA Successfully.", header: header, showAfterRedirect: true }));
            }
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Delete Failed" }));
        }
    };

    return (
        <Typography   className=' FAQContainer-right'>
            <Typography variant="div" component="div" className="">
                <Typography variant="h3" component="h3" className="Announcements-text">FAQ’s by Portal</Typography>
                <Typography className='Announcementcontainer' component="div">
                    <div>
                        {groupedData ? (
                            Object.keys(groupedData).map((portalID) => (
                                <Accordion key={portalID} className='AccordionSummary'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${portalID}-content`}
                                        id={`panel${portalID}-header`}
                                        className='AccordionSummary'
                                    >
                                        <Typography component="span">{portalMap[portalID]}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {groupedData[portalID].map((q) => (
                                            <div key={q.ID}>
                                                <Typography component="h5">{q.Question}</Typography>
                                                <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 9 }}>
                                                <Typography>{q.Answer}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 3 }} className='Announcementiconslist-flex'>
                                                    <Typography component="div" className='Announcementiconslist'>
                                                        <IconButton aria-label="edit" onClick={() => onEditClick(q)}>
                                                            <Edit color="primary" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" className='Delete' onClick={() => onDeleteClick(q.ID)}>
                                                            <img src={Delete} alt="Delete" ></img>
                                                        </IconButton>
                                                    </Typography>
                                                </Grid>
                                                </Grid>
                                            </div>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Typography component="p">No FAQ available.</Typography>
                        )}
                    </div>
                </Typography>
            </Typography>
        </Typography>
    );
};

export default FAQDetails;