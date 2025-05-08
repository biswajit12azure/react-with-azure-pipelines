import React from 'react';
import { Button, Typography, IconButton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EnergyAssistanceChart from "./EnergyAssistanceChart"
import {materialsymbolsdownload} from 'images';
const EnergyAssistanceDetails = () => {
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
            <Grid container spacing={2} className="EnergyAssistanccontainer">
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Box className="userInformationcontainer">
                        <Accordion component="div" defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                component="div"
                            >
                                <Typography component="h2" className='userInformation'>Profile Information</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>

                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Phone Number</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">202-2020-20002</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Service Address</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">15 St. Se Washington 200035 </Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Billing Address</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">15 St. Se Washington 200035</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </Grid>

                                    

                                </Grid>





                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Box className="userInformationcontainer EnergyAssistanceChartcontainer">
                        <Accordion component="div" defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                component="div"
                            >
                                <Typography component="h2" className='userInformation'>ENERGY USAGE</Typography>
                                <IconButton size="small" color="primary" className='downloadenergy'>
                                <img src={materialsymbolsdownload} alt='download'></img>
                                        </IconButton>
                            </AccordionSummary>
                            <AccordionDetails>
                               <Grid container>
                               <Grid size={{ xs: 12, sm: 12, md: 12  }}  >
                                    <EnergyAssistanceChart/>
                                    </Grid>
                               </Grid>





                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Box className="userInformationcontainer">
                        <Accordion component="div" defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                component="div"
                            >
                                <Typography component="h2" className='userInformation'>Current Billing</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>

                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Amount Due</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright"> <span className='textrighttext'>388.17</span></Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">BILL DATE</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">11/31/2025</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Due Date</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">11/31/2025</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                   

                                    
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Past Due</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">m.rodr@remex.COM</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Open balance</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">909</Typography>
                                                </Grid>
                                            </Grid>
                                    </Typography>
                                    </Grid>
                                    </Grid>

                                 





                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Box className="userInformationcontainer">
                        <Accordion component="div" defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                component="div"
                            >
                                <Typography component="h2" className='userInformation'>Grant information & History</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>

                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Amount Due</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright"> <span className='textrighttext'>388.17</span></Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">BILL DATE</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">11/31/2025</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Due Date</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">11/31/2025</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                   

                                    
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Past Due</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">m.rodr@remex.COM</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>

                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Open balance</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">909</Typography>
                                                </Grid>
                                            </Grid>
                                    </Typography>
                                    </Grid>
                                    </Grid>

                                 





                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6  }}>
                    <Box className="userInformationcontainer">
                        <Accordion component="div" defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                component="div"
                            >
                                <Typography component="h2" className='userInformation'>Billing & Payment History </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
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
                                        {/* 
                                        <Typography component="div" className="UserName">
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Account Holder</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">John Adam</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography> */}


                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Billingcontainer">
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <th colSpan={2} >INVOICE</th>
                                                        <th>PAYMENT</th>
                                                        <th>PMT Date</th>
                                                        <th>BALANCE</th>
                                                    </tr>
                                                    </tbody>
                                                    <tr>
                                                        <td>JAN</td>
                                                        <td>Maria Anders</td>
                                                        <td>Germany</td>
                                                        <td>Germany</td>
                                                        <td>Germany</td>
                                                    </tr>
                                                    <tr>
                                                        <td>FEB</td>
                                                        <td>Francisco Chang</td>
                                                        <td>Mexico</td>
                                                        <td>Mexico</td>
                                                        <td>Germany</td>
                                                    </tr>
                                                    <tr>
                                                        <td>March</td>
                                                        <td>Francisco Chang</td>
                                                        <td>Mexico</td>
                                                        <td>Mexico</td>
                                                        <td>Germany</td>
                                                    </tr>
                                                </table>
                                            </Grid>
                                           
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
             
                                <Grid size={{ xs: 6, sm: 6, md: 6 }} justifyContent={'left'} className="containedLoginbuttonleft">
                                   <Button
                                        type="submit"
                                        variant="contained"
                                        className='Loginbutton'
                                        color="primary"
                                        
                                         
                                    >
                                       Pledge Amount
                                    </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className='Loginbutton'
                                            color="primary"
                                            
                                        >
                                           Reconnect
                                        </Button>
                                   
                                    
                                </Grid>
                
                                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="containedLoginbuttonleft">
                                   
                                     <Button
                                        type="submit"
                                        variant="contained"
                                        className='Loginbutton backgroundcolorred'
                                        color="primary"
                                         
                                    >
                                        Emergency Hold
                                    </Button>
                                   
                                </Grid>
                
                            </Grid>
        
      
        </>

    );
};

export default EnergyAssistanceDetails;