import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { alertActions, authActions, userActions } from '_store';
import Grid from "@material-ui/core/Grid";
import Box from '@mui/material/Box';
import Link from "@material-ui/core/Link";
import { Modal, Button, Typography } from '@mui/material';
import { PasswordCheck, PasswordInput, OTPVerification } from "_components";
import { resetPasswordValidationSchema } from "_utils/validationSchema";
import { resetFailedLabels, resetSuccessLabels } from "_utils/labels";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { labels } from "_utils/labels";
import { logo } from '../../images';
import { LoginLayout } from "container/layout";

const ResetProfilePassword = ({ isModalOpen, handleCloseModal, usersID }) => {
  const header = "Reset Password"
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(x => x.users?.userDetails);

  const userId = user?.UserID;
  const email = user?.EmailID;

  const id = new URLSearchParams(location.search).get('verifyId') || usersID;
  const FullName = user?.FullName;

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [modalState, setModalState] = useState({ open: true, otpOpen: false });
 const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const { handleSubmit, control, formState: { errors, isValid }, watch, trigger, reset } = useForm({
    resolver: yupResolver(resetPasswordValidationSchema(FullName)),
  });
  const password = watch('Password', '');
  const confirmPassword = watch('ConfirmPassword', '');
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

  useEffect(() => {
    if (isModalOpen) {
      handleOpen();
    }
  }, [isModalOpen]);

  const handleOpen = () => setModalState({ ...modalState, open: true });
  const handleClose = () => {
    reset({ Password: '', CurrentPassword:'' });
    setModalState({ open: false, otpOpen: true });
  };
  const handleOtpOpen = () => setModalState({ ...modalState, open: false, otpOpen: true });
  const handleOtpClose = () => {
    setModalState({ ...modalState, otpOpen: false });
    handleNavigateLogin();
    if (handleCloseModal) { handleCloseModal(); }
  }

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
    await trigger(fieldName);
  };

  const onSubmit = async (data) => {
    try {
      dispatch(alertActions.clear());
      const result = await dispatch(authActions.userPasswordVerification({ userId,newPassword:data.Password,currentPassword:data.CurrentPassword }));
      if (result?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: result?.payload || result?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      const generateOtpResult = await dispatch(authActions.generateOtp({ email }));
      if (generateOtpResult?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: generateOtpResult?.payload || generateOtpResult?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      await setNewPassword(data.Password);
      await setCurrentPassword(data.CurrentPassword);
      await handleClose();
      await handleOtpOpen();
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: "Reset Password" }));
    }
  };
  useEffect(() => {
    if (errors.Password) {
        setShowPasswordCheck(true);
    } else {
        setShowPasswordCheck(false);
    }
}, [errors.Password]);
  const handlePasswordValidation = (isValid) => {
    setIsPasswordValid(isValid);
    if (isValid) {
      setShowPasswordCheck(false);
  }
  };

  const handleOTPSubmit = async (otp) => {
    try {
      dispatch(alertActions.clear());
      const result = await dispatch(authActions.validateOtp({ email, otp }));

      if (result?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: result?.payload || result?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      const resetResult = await dispatch(authActions.resetPasswordByUser({ userId, newPassword,currentPassword }));

      if (resetResult?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: resetResult?.payload || resetResult?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      await handleOtpClose();
      await dispatch(alertActions.success({
        showAfterRedirect: true,
        message: resetResult?.payload?.Message, 
        header: resetSuccessLabels.header,
        islogout: true
      }));
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: "Reset Password" }));
    }
  }

  const handleNavigateLogin = () => {
    if (!usersID) {
      navigate('/');
    }
  }

  const handleCancel = () => {
    reset({ Password: '', CurrentPassword:'' });
    setModalState({ open: false, otpOpen: false });
    handleNavigateLogin();
    if (handleCloseModal) { handleCloseModal(); }
  }
  const handlePasswordFocus = () => {
    if (!isPasswordValid) {
        setShowPasswordCheck(true);
    }
};
  return (
    <>
      {!(user?.loading || user?.error) && (
        <>
          {!usersID && <LoginLayout />}
          <Modal
            open={modalState.open}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
            className="displayblock"
          >
            <Box className="modalpopup">
              <Box className=" modalpopupinner">
                <Grid container>
                  <Grid item xs={12} className="forgotpassword p-0">
                    <Link href="#" variant="logo" className="wgllogo">
                      <img src={logo} alt="logo"></img>
                      {labels.eServicePortal}
                    </Link>
                    <Typography component="h2" variant="body1">
                      Reset Password
                    </Typography>
                    <Typography component="p" variant="body1">
                      {`Hi ${user?.FullName}, Enter your new password.`}
                    </Typography>
                  </Grid>
                  <form onSubmit={handleSubmit(onSubmit)} className='newpassword-list form forgotpasswordcontainer p-0'>
                    <PasswordInput
                      control={control}
                      name="CurrentPassword"
                      label="Current Password"
                      rules={{ required: 'Current Password is required' }}
                      errors={errors}
                      handleBlur={handleBlur}
                      isPasswordValid={true}
                    />
                    <PasswordInput
                      control={control}
                      name="Password"
                      label="New Password"
                      rules={{ required: 'Password is required' }}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleFocus={handlePasswordFocus}
                      isPasswordValid={isPasswordValid}
                    />
                    <PasswordInput
                      control={control}
                      name="ConfirmPassword"
                      label="Re-Enter New Password"
                      errors={errors}
                      handleBlur={handleBlur}
                      isPasswordValid={isPasswordValid}
                    />
                  {showPasswordCheck && (  <PasswordCheck password={password} userName={FullName} onValidationChange={handlePasswordValidation} />
                  )}
                    <Box>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="Loginbutton"
                        disabled={!isValid || password !== confirmPassword}
                      >
                        RESET PASSWORD
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="buttonCancel"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </Grid>
              </Box>
            </Box>
          </Modal>
          <OTPVerification fullName={FullName} open={modalState.otpOpen}
            handleOTPSubmit={(otp) => handleOTPSubmit(otp)} handleOtpClose={() => handleOtpClose()} />
        </>
      )}
    </>
  );
}

export default ResetProfilePassword;