import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { authActions, alertActions } from '_store';
import { labels } from '_utils/labels';
import { Button, Link, Typography } from '@mui/material';
import { loginValidationSchema } from "_utils/validationSchema";
import { ForgotPassword } from "container/loginPage";
import Grid from "@material-ui/core/Grid";
import { CustomFormControl, PasswordInput } from "_components";
import msalInstance from "authConfig";

const Login = () => {
    const [modalState, setModalState] = useState({ open: false, otpOpen: false, manageUseropen: false, error: null });
    const [account, setAccount] = useState(null);
    const dispatch = useDispatch();

    // form validation rules 
    const { register, handleSubmit, control, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(loginValidationSchema),
        mode: 'onBlur'
    });

    const onSubmit = async ({ Email, Password }) => {
        try {
            dispatch(authActions.login({ Email, Password }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Login Failed" }));
        }
    };

    const handleSSOLogin = async () => {
        try {
            await msalInstance.initialize();
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["User.Read"],
            });
            console.log('SSO Response', loginResponse);
            setAccount(loginResponse.account);
            if (loginResponse.account) {
                // Assuming you have a way to determine if the user is internal
                const isInternalUser = determineIfInternalUser(loginResponse.account);
                sessionStorage.setItem('isInternalUser', JSON.stringify(isInternalUser));
                const MicroEntraToken = loginResponse.account.idToken;
                console.log('MicroEntraToken',MicroEntraToken);
                dispatch(authActions.loginSSO({ MicroEntraToken }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const determineIfInternalUser = (account) => {
        // Implement your logic to determine if the user is internal
        // For example, you might check the domain of the user's email
        return account.username.endsWith(process.env.REACT_APP_INTERNAL_USER_EMAIL_DOMAIN);
    };

    // const callApi = async (account) => {
    //     try {
    //         const tokenResponse = await msalInstance.acquireTokenSilent({
    //             scopes: ["api://YOUR_API_SCOPE/.default"],
    //             account: account,
    //         });
    //         const response = await fetch("https://yourapi.example.com/api/authenticate", {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${tokenResponse.accessToken}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 username: "user@example.com",
    //                 password: "userpassword",
    //             }),
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleOpen = () => setModalState({ ...modalState, open: true });
    const handleClose = () => setModalState({ ...modalState, open: false });
    const handleOtpOpen = () => setModalState({ ...modalState, open: false, otpOpen: true });
    const handleOtpClose = () => setModalState({ ...modalState, otpOpen: false });

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    return (
        <div>
            <Typography component="div" className="mobilebanner">
                <Typography component="div" className="loginheader">
                    <Typography component="h1" variant="h5" className="Logincontent">
                        {labels.loginHeader}
                    </Typography>
                </Typography>
                <div className="paper">
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <CustomFormControl
                            id="Email"
                            label="Email Address"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                        />
                        <Typography component="div" className="PasswordInput">
                            <PasswordInput
                                control={control}
                                name="Password"
                                label="Password"
                                rules={{ required: 'Password is required' }}
                                errors={errors}
                                handleBlur={handleBlur}
                                isPasswordValid={true}
                            />
                        </Typography>
                        <Link href="#" onClick={handleOpen} variant="body2" className="ResetPassword">
                            {labels.resetPwdButtonLabel}
                        </Link>
                        <Typography component="div" className="loginbuttonfixed">
                            <Typography component="div" className="loginbuttonfixedbutton">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className="Loginbutton Loginbuttonheight"
                                    disabled={!isValid}
                                >
                                    Login External Users
                                </Button>
                                <Typography className="Orcontent">or</Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className="cancelButton"
                                    onClick={handleSSOLogin}
                                >
                                    Login WG Users Only
                                </Button>
                                <Grid container>
                                    <Grid item className="accountSignup">
                                        <div>Don’t have an account? </div>
                                        <Link href="./register" variant="body2">
                                            {labels.signUpLabel}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Typography>
                    </form>
                </div>
            </Typography>
            <ForgotPassword open={modalState.open} handleClose={handleClose} onSubmitToOTP={handleOtpOpen} />
        </div>
    );
}

export default Login;
