import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';

const ActivityDetails = ({ data }) => {
    const status = data?.Status;
    const backgroundColor = status ? 'green' : 'red';
    const textColor = 'white';
    return (
        <>
            <Box className="userInformationcontainer">
                <Accordion component="div" defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        component="div"
                    >
                        <Typography component="h2" className='userInformation'>Activity Log</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Timestamp:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{dayjs(data.CreatedOn).format('MM/DD/YYYY HH:mm')}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">User:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{data.UserName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Organization:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{data.Organization}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Status:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright"><span style={{ backgroundColor, color: textColor, padding: '4px 8px', borderRadius: '4px' }}>
                                                {status ? 'Success' : 'Failed'}
                                            </span></Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Typography component="h2" className='userInformation'>Activity</Typography>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                            <Typography component="span" className="textleft">{data.Activity} :<span> {data.ActivityDetails}</span></Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    );
};

export default ActivityDetails;