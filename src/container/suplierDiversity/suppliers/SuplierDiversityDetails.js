import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SuplierDiversityDetails = ({ }) => {
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
                        <Typography component="h2" className='userInformation'>request details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>

                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">regISTRATION date</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">11/12/2024</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Marketer</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">Remex LTD</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Contact Person</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">Maria Rodriguez</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Email</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">m.rodr@remex.COM</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Phone Number</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}> 
                                            <Typography component="span" className="textright">555-455-3321</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">  Status:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}> 
                                            <Typography component="span" className="textright"> <span className='textrighttext'> SUBMITTED</span></Typography>
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

export default SuplierDiversityDetails;