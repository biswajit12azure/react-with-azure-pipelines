import React from "react";
import Link from "@material-ui/core/Link";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiOtpInput } from "mui-one-time-password-input";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { otpValidationSchema } from "_utils/validationSchema";
import { FormHelperText } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { logo } from '../images';
import { labels } from "_utils/labels";
const OTPVerification = ({ fullName, open, handleOTPSubmit, handleOtpClose }) => {
    const { handleSubmit, control, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(otpValidationSchema)
    });

    async function onSubmit(data) {
        const otp = data?.otp;
        handleOTPSubmit(otp);
    }

    return (
        <Modal
            open={open}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modalpopup modalpopupVerification">
                <Box className=" row modalpopupinner">
                    <Grid item xs={12} className="p-0">
                        <Link href="#" variant="logo" className="wgllogo">
                            <img src={logo} alt="logo"></img>
                            {labels.eServicePortal}
                        </Link>
                        <Typography component="h2" variant="h5" className="headercontent"> <b>{`Hello, ${fullName || ""}!`}</b></Typography>
                        <Typography component="p" className="modalpopupcontent">We have sent a Verification code to your registered Email Address.
                            Please enter the code below to verify your identity and proceed with the password reset.</Typography>

                        <form  onSubmit={handleSubmit(onSubmit)} className='newpassword-list form forgotpasswordcontainer p-0'>
                            <div className="App">
                                <Controller
                                    name="otp"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <MuiOtpInput
                                            length={6}
                                            autoFocus
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={!!errors.otp}
                                        />
                                    )}
                                />
                                {errors.otp && <FormHelperText className="error-text">{errors.otp.message}</FormHelperText>}
                            </div>
                            <Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className="Loginbutton"
                                disabled={!isValid}
                            >
                                VERIFY
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className="buttonCancel"
                                onClick={handleOtpClose}
                            >
                                Cancel
                            </Button>
                            </Box>
                        </form>
                    </Grid>
                </Box>
            </Box >
        </Modal >
    );
}

export default OTPVerification;