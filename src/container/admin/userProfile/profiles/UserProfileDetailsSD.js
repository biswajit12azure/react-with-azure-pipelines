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
import { alertActions, supplyDiversityAction } from '_store';
import { SignalCellularConnectedNoInternet2BarTwoTone } from "@mui/icons-material";

const UserProfileDetailsSD = ({ userData, roles, handleReject, singleUserUpdate }) => {
    const header = " Individual User Profile";
    const dispatch = useDispatch();
    const id = userData.UserID;
    const RoleName = roles.filter((item) => item?.value === userData.RoleID);
    const user = useSelector(x => x.supplydiversity?.userData);

    const agencyState = user?.State1?.find(state => state.StateId === user?.AgencyStateID)?.StateName;
    const state = user?.State1?.find(state => state.StateId === user?.State)?.StateName;

  // Extracting classification names by comma-separated IDs
    const classificationIdArray = user?.ClassificationID?.split(',').map(id => parseInt(id, 10));
    const classificationNames = user?.Classification
    ?.filter(classification => classificationIdArray?.includes(classification.ClassificationID))
    .map(classification => classification.ClassificationName);

    const classifications = classificationNames?.join(', ');

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(supplyDiversityAction.get({ id })).unwrap();
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
                        <Typography component="h2" className='userInformation'>USER INFORMATION</Typography>
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
                                            <Typography component="span" className="textright">{userData?.FullName}</Typography>
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
                                            <Typography component="span" className="textright">{user?.PhoneNumber}</Typography>
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
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography className="p-0" component="h2">PERSONAL INFORMATION</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Company Name</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Company Website</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CompanyWebsite}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Contact Person</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.ContactPerson}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Agency</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.AgencyID}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Agency State</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{agencyState}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Services Products Provided</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.ServicesProductsProvided}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Street Address:</Typography>

                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.Street}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">City:</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.City}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">State</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{state}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Zip Code</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.ZipCode}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Category</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.CategoryID}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">Classification</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{classifications}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
										<Typography component="div" className="UserName">
                                            <Grid container>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textleft">ExpiryDate</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <Typography component="span" className="textright">{user?.ExpiryDate}</Typography>
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
                        onClick={() => singleUserUpdate(userData)}
                    >
                        Approve
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfileDetailsSD;