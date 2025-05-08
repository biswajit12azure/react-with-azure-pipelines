import React from "react";
import Link from "@material-ui/core/Link";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiOtpInput } from "mui-one-time-password-input";
import { useDispatch, useSelector } from "react-redux";
import { alertActions, authActions, userActions } from '_store';
import { resetFailedLabels, resetSuccessLabels } from "_utils/labels";
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
    const dispatch = useDispatch();
    const user = useSelector(x => x.users?.userDetails);

    const userId = user?.UserID;
    const email = user?.EmailID;
    const { handleSubmit, control, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(otpValidationSchema)
    });

    async function onSubmit(data) {
        const otp = data?.otp;
        handleOTPSubmit(otp);
    }

    const handleResendOtp = async() => {
        const generateOtpResult = await dispatch(authActions.generateOtp({ email }));
        dispatch(alertActions?.success({message:`Verification code resent successfully.`, header:`Reset Password`}));
        if (generateOtpResult?.error) {
          dispatch(alertActions.error({
            showAfterRedirect: true,
            message: generateOtpResult?.payload || generateOtpResult?.error.message,
            header: resetFailedLabels.header
          }));
          return;
        }
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
                        <Typography component="p" className="modalpopupcontent">A verification code has been sent to your registered email address. Please enter the code below to complete your password reset.</Typography>

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
                                <Box>
                                    <Grid container direction="row" spacing={2} className="">
                                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className="Loginbutton cancelbutton"
                                                onClick={handleOtpClose}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className="Loginbutton cancelbutton"
                                            onClick={handleResendOtp}
                                            >
                                                Resend OTP
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Box>
                            
                            </Box>
                        </form>
                    </Grid>
                </Box>
            </Box >
        </Modal >
    );
}

export default OTPVerification;