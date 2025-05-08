
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { alertActions, authActions } from '_store';
import { Modal, Button, TextField, Typography } from '@mui/material';
import { resetValidationSchema } from "_utils/validationSchema";
import Grid from "@material-ui/core/Grid";
import { emailSentLabels, labels } from "_utils/labels";
import Link from "@material-ui/core/Link";
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { logo, icoutlineemail } from '../../images';
const ResetPassword = ({ open, handleClose, onSubmitToOTP }) => {
    const dispatch = useDispatch();
    const formOptions = { resolver: yupResolver(resetValidationSchema) };
    const { register, handleSubmit, trigger, formState: { errors, isValid } } = useForm(formOptions);

    const onSubmit = async ({ email }) => {
        try {
            const result = await dispatch(authActions.forgotPasswordRequest({ email }));
             if (result?.error) {                
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: result?.error.message,
                    header: emailSentLabels.header
                }));
                return;
             }
             await handleClose();
             // onSubmitToOTP();
             dispatch(alertActions.success({
                showAfterRedirect: true,
                message: emailSentLabels.message1,
                header: emailSentLabels.header
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Forgot Password" }));                                              
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName); // Trigger validation for the field
    };

    return (
        <Modal
            open={open}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modalpopup">
                <Box className="row modalpopupinner">
                    <Grid item xs={12} className="forgotpassword p-0">
                        <Link href="#" variant="logo" className="wgllogo">
                            <img src={logo} alt="logo"></img>
                            {labels.eServicePortal}
                        </Link>
                        <Typography component="h2" variant="body1">
                            Forgot your password?
                        </Typography>
                        <Typography component="p" variant="body1">
                            Enter your email and we will send you a link/code to reset your password.
                        </Typography>
                    </Grid>
                    <form className="form forgotpasswordcontainer p-0" onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ '& > :not(style)': { m: 1 } }} className="standardEamil">
                            <TextField
                                id="input-with-icon-textfield"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                onBlur={handleBlur}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src={icoutlineemail} alt="Email icon" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="Loginbutton"
                            disabled={!isValid}
                        >
                            Send link to email
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="buttonCancel"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </form>
                </Box>
            </Box>
        </Modal>
    );
}

export default ResetPassword;