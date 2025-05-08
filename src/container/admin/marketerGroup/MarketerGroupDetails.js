import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
        <Box className="userInformationcontainer">
            <Accordion component="div">
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
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <Typography component="div" className="UserName">
                                <Typography component="span" className="textleft"><strong>BalancingModel History:</strong></Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Balancing Model Name</TableCell>
                                                <TableCell>Start Month</TableCell>
                                                <TableCell>End Month</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {balancingModelHistory && balancingModelHistory.map((model, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{model.BalancingModelName}</TableCell>
                                                    <TableCell>{dayjs(model.StartMonth).format('MMMM YYYY')}</TableCell>
                                                    <TableCell>{dayjs(model.EndMonth).format('MMMM YYYY')}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default MarketerGroupDetails;