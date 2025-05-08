import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alertActions, userActions } from '_store';

const UserProfileDetails = ({ userData, roles, userProfiles, portalAccess, portalId, handleReject, singleUserUpdate, handleResetPassword, onLockToggle }) => {

    const header = " Individual User Profile";
    const dispatch = useDispatch();
    const id = userData?.UserID;
    const roleName = roles.find((item) => item?.value === userData.RoleID);
    const marketerName = userProfiles?.Marketer.find((item) => item?.MarketerID === userData?.MarketerID);
    const agencyIDs = userData?.AgencyID?.split(',');
    const jurisdictionIDs = userData?.JurisdictionID?.split(',');

    const agencyNames = agencyIDs?.map(id => {
        const agency = userProfiles?.Agency?.find(item => item?.AgencyID.toString() === id);
        return agency ? agency.AgencyName : null;
    }).filter(name => name !== null).join(', ');

    const jurisdictionNames = jurisdictionIDs?.map(id => {
        const jurisdiction = userProfiles?.Jurisdictions?.find(item => item?.JurisdictionID.toString() === id);
        return jurisdiction ? jurisdiction.JurisdictionName : null;
    }).filter(name => name !== null).join(', ');

    const user = useSelector(x => x.users?.userDetails);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(userActions.clear());
            try {
                const result = await dispatch(userActions.getUserDetailsById(id)).unwrap();

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
                <Accordion component="div" defaultExpanded>
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
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Full Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.FullName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Company Name:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.CompanyName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Email Address:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.EmailID}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                {portalId !== 5 && <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Phone Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.MobileNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                {portalId === 5 && <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Phone Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.MobileNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                }
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Portal Access :</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{portalAccess}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Portal Role :</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{roleName?.label}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                {[1, 2].includes(portalId) &&
                                    <Typography component="div" className="UserName">
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                                <Typography component="span" className="textleft">Agency :</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                                <Typography component="span" className="textright">{agencyNames}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                }
                                {[2].includes(portalId) && <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Jurisdiction :</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{jurisdictionNames}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                }
                                {[4].includes(portalId) && <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Marketer :</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{marketerName?.MarketerName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                }
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="ResetPasswordbutton">
                     <> <Button
                        type="submit"
                        variant="contained"
                        className='ResetPassword'
                        color="primary"
                        onClick={() => handleResetPassword(userData?.EmailID)}
                        disabled={userData?.Status.toLowerCase() !== 'approved'}
                    >
                        Reset Password
                    </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className='ResetPassword'
                            color="primary"
                            onClick={() => onLockToggle(userData)}
                            disabled={userData?.Status.toLowerCase() !== 'approved' || !userData.IsAccountLock}
                        >
                            Unlock Account
                        </Button>
                    </>
                    
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="containedLoginbuttonleft">
                    {/* <Typography component="div" className="containedLoginbutton ResetPasswordbutton">
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
                    </Typography> */}
                   {userData?.Status.toLowerCase() !== 'approved' &&  <Button
                        type="submit"
                        variant="contained"
                        className='Loginbutton'
                        color="primary"
                        onClick={() => singleUserUpdate(userData)}
                        disabled={userData?.Status.toLowerCase() !== 'submitted'}
                    >
                        Approve
                    </Button>
                   }
                </Grid>

            </Grid>
        </Box>
    );
};

export default UserProfileDetails;