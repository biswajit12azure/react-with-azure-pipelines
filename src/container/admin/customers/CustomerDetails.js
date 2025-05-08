
import React from 'react';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
const CustomerDetails = ({customerInfo}) => {

    // const customerDetails = customerInfo[0];
    const data = Array.isArray(customerInfo) ? customerInfo[0] : customerInfo;
    console.log("hsafdfsahdfahfdhsafdhfsad",customerInfo);
    const marketerName = data?.Marketer?.find(
        (item) => item.MarketerID === data?.CompanyID
      )?.MarketerName || "";
    // const marketerName = customerDetails?.Marketer?.filter((item)=> item.MarketerID === customerDetails?.CompanyID);
    const marketerGroupName = data?.MarketerGroup?.find(
        (item) => item.ID === data?.AllocationGroupID
      )?.GroupName || "";
//     const marketerGroupName = customerDetails?.MarketerGroup?.filter((item)=> item.ID === customerDetails?.AllocationGroupID);
// console.log("marketerName",marketerName);
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
                        <Typography component="h2" className='userInformation'>customer Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>

                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Customer Number</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{data?.AccountNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Marketer</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketerName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Group</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{marketerGroupName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                {/* <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>

                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Account Number</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">1200001234567</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography> */}

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Association Start</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{dayjs(data.EffectiveDate).format("MM-YYYY")}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>

                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Association End</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{ data.EndDate?dayjs(data.EndDate).format("MM-YYYY"):" - "} </Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box className="userInformationcontainer">
                <Accordion component="div" defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        component="div"
                    >
                        <Typography component="h2" className='userInformation'>ACCOUNT HISTORY</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Billingcontainer">
                                <table className='Billingcontainertable'>
                                    <tbody>
                                        <tr>
                                            <th  >marketer</th>
                                            <th>group</th>
                                            <th>start month</th>
                                            <th>End month</th>
                                        </tr>
                                    </tbody>

                                    {data?.AccountAssociationHistories?.map((row) => (
            <tr >
              <td>{row.CompanyName}</td>
              <td>{row.AllocationGroup}</td>
              <td>{dayjs(row.EffectiveDate).format("MM-YYYY")}</td>
              <td>{row.EndDate?dayjs(row.EndDate).format("MM-YYYY"):" - "}</td>
            </tr>
          ))}
                                   
                                </table>
                            </Grid>


                        </Grid>





                    </AccordionDetails>
                </Accordion>
            </Box>



        </>
    )
}

export default CustomerDetails