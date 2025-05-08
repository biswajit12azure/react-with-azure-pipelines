import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MapCenterDetails = ({ }) => {
    // const [uetFileTypes, setUetFileTypes] = useState([]);

    // useEffect(() => {
    //     // Convert comma-separated string to an array of IDs
    //     const uetArray = marketer?.UETFileID.split(',').map(id => parseInt(id.trim(), 10));
    //     setUetFileTypes(uetArray);
    // }, [marketer.UETFileID]);

    // const handleCheckboxChange = (event) => {
    //     const { name, checked } = event.target;
    //     const id = parseInt(name, 10);
    //     setUetFileTypes(prevState =>
    //         checked ? [...prevState, id] : prevState.filter(type => type !== id)
    //     );
    // };

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
                        <Typography component="h2" className='userInformation'>11/11/2024</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Typography component="span"  className='announcementcentertitile'>Columbia Pipeline will undergo scheduled maintenance on 24-Dec-2024 from 02:00 AM to 03:00 AM EST.
                                    Services may be temporarily unavailable during this time. We apologize for any inconvenience.</Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>

    );
};

export default MapCenterDetails;