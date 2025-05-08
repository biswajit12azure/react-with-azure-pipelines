import React from 'react';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';

const MarketerGroupDetails = ({ marketerGroup, balancingModels }) => {

    const balancingModelName = balancingModels?.find(bal => bal.value === marketerGroup?.BalancingModelID)?.label;
    const balancingModelHistory = marketerGroup?.BalancingModelHistory;

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
                        <Typography component="h2" className='userInformation'>Marketer Group Detail</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Marketer Group Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketerGroup.GroupName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Group Type:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketerGroup.GroupType}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Jurisdiction:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketerGroup.JurisdictionName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Start Month:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{dayjs(marketerGroup.StartMonth).format('MMMM YYYY')}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">End Month:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{dayjs(marketerGroup.EndMonth).format('MMMM YYYY')}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">BalancingModel:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{balancingModelName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>

                        </Grid>
                    </AccordionDetails>
                </Accordion>



            </Box>
            <Box className="userInformationcontainer">
                <Typography component="div" className="UserName">
                    <Accordion component="div" defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            component="div"
                        >
                            <Typography component="h2" className='userInformation'><strong>Balancing Model History</strong></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={1} className="BalancingModel">
                                <Grid size={{ xs: 4, sm: 4, md: 4 }}> <Typography>Balancing Model Name</Typography>
                                </Grid>
                                <Grid size={{ xs: 4, sm: 4, md: 4 }}><Typography>Start Month</Typography></Grid>
                                <Grid size={{ xs: 4, sm: 4, md: 4 }} justifyContent="flex-end"><Typography>End Month</Typography></Grid>
                            </Grid>
                            {balancingModelHistory && [...balancingModelHistory]
                                .sort((a, b) => new Date(b?.CreatedDate) - new Date(a?.CreatedDate)).map((model, index) => (
                                    <Grid container key={index} className="BalancingModeldata">
                                        <Grid size={{ xs: 4, sm: 4, md: 4 }}><Typography>{model.BalancingModelName}</Typography></Grid>
                                        <Grid size={{ xs: 4, sm: 4, md: 4 }} justifyContent="flex-center"><Typography>{dayjs(model.StartMonth).format('MMMM YYYY')}</Typography></Grid>
                                        <Grid size={{ xs: 4, sm: 4, md: 4 }} justifyContent="flex-end"><Typography>{dayjs(model.EndMonth).format('MMMM YYYY')}</Typography></Grid>

                                    </Grid>
                                ))}

                        </AccordionDetails>
                    </Accordion>
                </Typography>
            </Box >
        </>
    );
};

export default MarketerGroupDetails;