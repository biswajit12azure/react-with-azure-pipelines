import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button,Box } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { profileInformationSchema } from "_utils/validationSchema";
import Grid from "@material-ui/core/Grid";
import { UnderConstruction } from '_components';
import { alertActions, userActions } from '_store';
import { myProfileLabels } from '_utils/labels';
import ProfileInformation from './ProfileInformation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";

const MyProfileDetails = () => {
    const header = 'My Profile';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useSelector(x => x.auth?.userId);
    const user = useSelector(x => x.users?.userDetails);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const states = user?.State || [];

    const stateData = states.map(x => ({
        label: x.StateName,
        value: x.StateId
    }));

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(profileInformationSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch(userActions.clear());
            try {
                const result = await dispatch(userActions.getUserDetailsById(id)).unwrap();
                const userData = result?.Data;
                const data = { ...userData, MobileNumber: formatPhoneNumber(userData.MobileNumber) };
                reset(data);
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
                reset(user);
            }
        };
        fetchData();
    }, [id, dispatch]);

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(userActions.updateUserProfileDetails({ data }));

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            dispatch(alertActions.success({ message: myProfileLabels.message1, header: myProfileLabels.header, showAfterRedirect: true }));

        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
       // console.log(`Triggering validation for: ${fieldName}`);
         await trigger(fieldName);
       // console.log(`Validation result for ${fieldName}:`, result);
    };

    const handleCancel = () => {
        reset(user);
    }

    const handleReset = () => {
        setIsResetPassword(true);
        handleOpenModal();
    }

    const handleDelete = async () => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(userActions.deleteUserById(id));

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            await navigate('/');
            dispatch(alertActions.success({ message: myProfileLabels.deleteMessage, header: myProfileLabels.header, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    }

    return (
        <>
            <Typography component="div" className="suportcontent">
                {/* <Typography component="div" className="MapCenterAccecssheading">
                    <Typography component="h1" variant="h5" className='userprofilelistcontent '>My Profile</Typography>
                </Typography> */}
                {!(user?.loading || user?.error) && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography className="suportcontentcontainer" component="div">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12} >
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12} md={12} className="Personal-Information">
                                            <Typography component="div" className="mapcontainer">
                                                <Accordion key={`11-personalinformation`} className="AccordionSummaryheadingcontent">
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel11-personalinformation-content"
                                                        id="panel11-personalinformation-header"
                                                    >
                                                        <Typography component="div" className="Personal-Informationsheading">
                                                            <Typography component="h2" variant="h5" className='margin-bottom-12'>Personal Information</Typography>
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails className="p-0">
                                                        <Typography className="AccordionDetailslistcontent">
                                                            <ProfileInformation
                                                                register={register}
                                                                errors={errors}
                                                                control={control}
                                                                stateData={stateData}
                                                                handleBlur={handleBlur}
                                                                trigger={trigger}
                                                            />
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Typography>
                        <Box className="popup-button" spacing={{ xs: 2, md: 3 }} >
                            <Button
                                variant="contained"
                                className='cancelButton'
                                color="primary"
                                onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit"
                                variant="contained"
                                className='Savebutton'
                                color="primary"
                                disabled={!isValid}
                            >
                                Save
                            </Button>
                        </Box>
                        {/* <Grid item xs={12} sm={12} md={12} className="userprofilebutton">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={6} >

                                    <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="secondary" className="submitbutton  ResetPassword" onClick={() => handleReset()} >
                                        Reset Password
                                    </Button>

                                </Grid>
                                <Grid item xs={12} sm={12} md={6} >

                                    <Button type="submit" variant="contained" className='submitbutton save' color="primary" disabled={!isValid}>
                                        Save
                                    </Button>
                                    <Button variant="contained" className="delete" onClick={() => handleDelete()} >
                                        Delete Profile
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid> */}
                    </form>
                )}
                {/* {isResetPassword && <NewPassword usersID={id} isModalOpen={isModalOpen}
                    handleCloseModal={handleCloseModal}></NewPassword>} */}
                {user?.error && <UnderConstruction />}
            </Typography>
        </>
    );
};

export default MyProfileDetails;