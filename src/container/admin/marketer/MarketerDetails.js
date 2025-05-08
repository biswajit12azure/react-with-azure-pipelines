import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const MarketerDetails = ({ marketer, uetFileData }) => {
    const [uetFileTypes, setUetFileTypes] = useState([]);

    useEffect(() => {
        // Convert comma-separated string to an array of IDs
        const uetArray = marketer?.UETFileID.split(',').map(id => parseInt(id.trim(), 10));
        setUetFileTypes(uetArray);
    }, [marketer.UETFileID]);

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
                <Accordion component="div">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        component="div"
                    >
                        <Typography component="h2" className='userInformation'>Marketer Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>

                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Portal ID:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketer.PortalID}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Marketer Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketer.MarketerName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Service Provider Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketer.ServiceProvider}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Start Date:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{new Date(marketer.StartDate)?.toLocaleDateString()}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Status:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketer.IsActive ? 'Active' : 'Inactive'}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>

                        </Grid>
                      




                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box className="userInformationcontainer">
                            <Accordion component="div">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    component="div"
                                >
                                    <Typography component="h2" className='userInformation'>UET File Types</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                            <Typography component="div" className="UserName">
                                                
                                                <FormGroup className='FormGrouplist'>
                                                    {uetFileData.map(file => (
                                                        <FormControlLabel
                                                            key={file.UETFileID}
                                                            control={
                                                                <Checkbox
                                                                    disabled={true}
                                                                    checked={uetFileTypes.includes(file.UETFileID)}
                                                                    name={file.UETFileID?.toString()}
                                                                />
                                                            }
                                                            label={file.UETFileName}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </Typography>

                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                        </Box>

        </>

    );
};

export default MarketerDetails;