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

const UserProfileDetails = ({ userData, roles, handleReject, singleUserUpdate, handleResetPassword }) => {

    const header = " Individual User Profile";
    const dispatch = useDispatch();
    const id = userData?.UserID;
    const RoleName = roles.filter((item) => item?.value === userData.RoleID);

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
                                            <Typography component="span" className="textright">{user?.CompanyName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textleft">Email Address:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                            <Typography component="span" className="textright">{user?.EmailID}</Typography>
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
                                            <Typography component="span" className="textright">{user?.MobileNumber}</Typography>
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
            <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="ResetPasswordbutton">
                    <Button
                        type="submit"
                        variant="contained"
                        className='ResetPassword'
                        color="primary"
                        onClick={() => handleResetPassword(userData?.EmailID)}
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

export default UserProfileDetails;