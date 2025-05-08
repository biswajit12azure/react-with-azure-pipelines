import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Link } from '@mui/material';
import { alertActions, masterActions, registrationActions } from '_store';
import { registerValidationSchema } from '_utils/validationSchema';
import { PersonalDetails } from 'container/user';
import { ModalPopup } from '_components';
import Grid from "@material-ui/core/Grid";
import { aggrementEALabel, genericlabels, verifyEmailLabels } from '_utils/labels';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
    const header = "Registration";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [openAgreeModal, setOpenAgreeModal] = useState(false);
    const [eaData, setEAData] = useState(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const portals = useSelector((x) => x.master?.portalData);
    const portalData = (!portals?.loading && !portals?.error) ? portals?.map(x => ({
        label: x.PortalDescription,
        value: x.PortalID
    })) : [];

    const { register, handleSubmit, control, formState: { errors, isValid }, watch, trigger, resetField } = useForm({
        resolver: yupResolver(registerValidationSchema),
        mode: 'onChange',
        defaultValues: {
            PortalId: null,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(masterActions.getPortalData());
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: `${header} Failed`
                }));
            }
        };
        fetchData();
    }, [dispatch]);

    const onSubmit = async (data) => {
        const portalKey = portals?.find(p => p.PortalID === data.PortalId)?.PortalKey;
        if (portalKey && portalKey.toLowerCase() === 'ea' && !isAgreed) {
            setEAData(data);
            setOpenAgreeModal(true);
            return;
        }
        handleRegister(data);
    };

    const handleRegister = async (data) => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(registrationActions.register(data)).unwrap();
          
            if (result?.error) {
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: result?.payload || result?.error.message,
                    header: `${header} Failed`
                }));
                return;
            }
            navigate('/');
            dispatch(alertActions.success({
                showAfterRedirect: true,
                message: verifyEmailLabels.message1,
                //message2: verifyEmailLabels.message2,
                header: verifyEmailLabels.header
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Registration Failed" }));
        }
    }

    const handleClose = () => {
        setOpenAgreeModal(false);
        setIsAgreed(false);
    };

    const handleConfirmClick = async () => {
        await setOpenAgreeModal(false);
        await setIsAgreed(true);
        handleRegister(eaData);
    };

    return (
        <Typography component="div" className="Registrationcontainerlist">
            <Typography component="h1" variant="h5" className="Logincontent">Registration</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                <PersonalDetails
                    isPasswordValid={isPasswordValid}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                    resetField={resetField}
                    trigger={trigger}
                    setIsPasswordValid={setIsPasswordValid}
                    portalData={portalData}
                    portalList={portals}
                    setIsAgreed={setIsAgreed}
                />
                <Typography component="div" className="loginbuttonfixed">
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className='Loginbutton'
                        color="primary"
                        disabled={!isValid || !isPasswordValid}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item className="accountSignup">
                            <div>Do you already have an account? Login</div>
                            <Link component={RouterLink} to="/" variant="body2">
                                here
                            </Link>
                        </Grid>
                    </Grid>
                </Typography>
            </form>
            {openAgreeModal && <ModalPopup
                header={aggrementEALabel.header}
                message1={aggrementEALabel.message1}
                btnPrimaryText={aggrementEALabel.btnPrimaryText}
                btnSecondaryText={aggrementEALabel.btnSecondaryText}
                handlePrimaryClick={handleConfirmClick}
                handleSecondaryClick={handleClose}
            />}
        </Typography>
    );
};

export default Register;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh', // Ensure the modal does not exceed the viewport height
    overflowY: 'auto' // Add vertical scroll bar
};