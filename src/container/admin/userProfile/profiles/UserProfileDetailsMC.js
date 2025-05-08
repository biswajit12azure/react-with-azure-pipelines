import React, { useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { Button, Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alertActions, userActions } from '_store';

const UserProfileDetailsMC = ({ userData, roles, portalAccess, handleResetPassword, onLockToggle, setSelectedUser, setshowDetailSection, singleUserUpdate }) => {
    const header = " User Details";
    const dispatch = useDispatch();
    // const [open, setOpen] = useState(false);
    const id = userData.UserID;
    const RoleName = roles.filter((item) => item?.value === userData.RoleID);
    const user = useSelector(x => x.users?.userDetails);
    const authUser = useSelector(x => x.auth.value);
    const userAccess = authUser?.Data?.UserAccess;
    // const userdetails = authUser?.Data?.UserDetails;
    // const isReviewer = userAccess?.some(access => access.Role.toLowerCase().includes('reviewer'));
    const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));

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

    // const handleRejectClick = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    // const handleRejectConfirm = (reason, comments) => {
    //     handleReject(userData, reason, comments);
    //     setOpen(false);
    // };

    const handleReviewChange = () => {
        setSelectedUser(userData);
        setshowDetailSection(true);
    }

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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography component="div" className="UserName">
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                            <Typography component="span" className="textleft">Phone Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                                            <Typography component="span" className="textright">{user?.MobileNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
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
                    {isAdmin && <> <Button
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
                    }
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 6 }} className="containedLoginbuttonleft">
                    {isAdmin && userData?.Status.toLowerCase() !== 'approved' &&
                     <Button
                        type="submit"
                        variant="contained"
                        className='Loginbutton'
                        color="primary"
                        disabled={!((userData.Status.toLowerCase() == "verified") || (userData.Status.toLowerCase() == "partially approved"))}
                        onClick={() => singleUserUpdate(userData)}>
                        Approve
                    </Button>
                    }
                    <Button
                        type="submit"
                        variant="contained"
                        className='Loginbutton buttonmarginleft-20'
                        color="primary"
                        onClick={() => handleReviewChange(userData)}
                    >
                        Review Request
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfileDetailsMC;