import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DisplayUploadedFile } from '_components';
import { alertActions, mapCenterAction } from '_store';

const UserProfileDetailsMC = ({ userData, roles, handleReject, singleUserUpdate, handleResetPassword }) => {
    const header = " Individual User Profile";
    const dispatch = useDispatch();
    const id = userData.UserID;
    const RoleName = roles.filter((item) => item?.value === userData.RoleID);
    const user = useSelector(x => x.mapcenter?.userData);

    const dlStateName = user?.State?.find(state => state.StateId === user?.DLState)?.StateName;
    const companyStateName = user?.State?.find(state => state.StateId === user?.CompanyState)?.StateName;
    const homeStateName = user?.State?.find(state => state.StateId === user?.HomeState)?.StateName;

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(mapCenterAction.get({ id })).unwrap();

                if (result?.error) {
                    dispatch(alertActions.error({
                        message: result.error?.message,
                        header: header
                    }));
                }
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: header
                }));
            }
        };
        fetchData();
    }, [id, dispatch]);

    return (
        <Box>
            <Box className="userInformationcontainer">
                <Accordion component="div">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        component="div"
                    >
                        <Typography component="h2" className='userInformation'>User Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">User Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{user?.FullName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Company Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{userData?.CompanyName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Email:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{userData?.EmailID}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Phone Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{user?.CompanyContactTelephone}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Portal Role :</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{RoleName[0]?.label}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Box className="userInformationcontainer p-0">
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Accordion component="div">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        component="div"
                                    >
                                        <Typography className="p-0" component="h2">PERSONAL INFORMATION</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft" >Full Name</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.FullName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Street Address:</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.HomeStreetAddress1}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">City:</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.HomeCity}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">State</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{homeStateName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Zip Code</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.HomeZipCode}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Driving License</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.DLNumber}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">License State</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{dlStateName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Box className="userInformationcontainer p-0">
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography className="p-0" component="h2">COMPANY INFORMATION</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Company Name</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{userData?.CompanyName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Tax TaxIdentification Number</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.TaxIdentificationNumber}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Street Address:</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyStreetAddress1}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">City:</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyCity}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Company State</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{companyStateName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Zip Code</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyZipCode}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Box className="userInformationcontainer p-0">
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography className="p-0" component="h2">COMPANY POINT OF CONTACT</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Company Contact Name</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyContactName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Email Address</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyContactEmailAddress}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Phone Number</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyContactTelephone}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Authorized WGL Contact</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.AuthorizedWGLContact}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>

                        </Grid>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Box className="userInformationcontainer p-0">
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                <DisplayUploadedFile exsistingFiles={user?.FileData} />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="ResetPasswordbutton">
                    <Button
                        type="submit"
                        variant="contained"
                        className='ResetPassword'
                        color="primary"
                        onClick={()=>handleResetPassword(userData?.EmailID)}
                    >
                        Reset Password
                    </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="containedLoginbuttonleft">
                    <Typography component="div" className="containedLoginbutton ResetPasswordbutton">
                        <Button
                            type="submit"
                            variant="contained"
                            className='Rejectbutton'
                            color="primary"
                            disabled={userData?.Status.toLowerCase() === 'approved'}
                            onClick={() => handleReject(userData)}
                        >
                            Reject
                        </Button>
                    </Typography>
                    <Button
                        type="submit"
                        variant="contained"
                        className='Loginbutton'
                        color="primary"
                        disabled={userData?.Status.toLowerCase() === 'approved'}
                        onClick={() => singleUserUpdate(userData)}
                    >
                        Approve
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfileDetailsMC;