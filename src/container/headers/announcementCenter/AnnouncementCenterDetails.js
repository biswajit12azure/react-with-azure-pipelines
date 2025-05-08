import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';

const AnnouncementCenterDetails = ({row}) => {
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
                        <Typography component="h2" className='userInformation'>{dayjs(row.StartDate).format('MM/DD/YYYY hh:mm:ss A')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Typography component="span"  className='announcementcentertitile'>{row.Data}</Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>

    );
};

export default AnnouncementCenterDetails;