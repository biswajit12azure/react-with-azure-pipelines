import React from 'react';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';

const FileHubDetails = ({ rowDetail }) => {

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD-MM-YYYY');
    };

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
                        <Typography component="h2" className='userInformation'>File Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textleft">File Name:</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textright">{rowDetail.FileData[0].FileName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textleft">Marketer Name:</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textright">{rowDetail.MarketerName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textleft">Last Update:</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textright">{formatDate(rowDetail.LastUpdate)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textleft">File Type:</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textright">{rowDetail.FileType}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textleft">Status:</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <Typography component="span" className="textright">{rowDetail.Status}</Typography>
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

export default FileHubDetails;
