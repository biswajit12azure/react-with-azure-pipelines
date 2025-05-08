import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { alertActions, authActions, userActions } from '_store';
import Grid from "@material-ui/core/Grid";
import Box from '@mui/material/Box';
import Link from "@material-ui/core/Link";
import { Modal, Button, Typography } from '@mui/material';
import { PasswordCheck, PasswordInput, OTPVerification } from "_components";
import { passwordValidationSchema } from "_utils/validationSchema";
import { resetFailedLabels, resetSuccessLabels } from "_utils/labels";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { labels } from "_utils/labels";
import { logo } from '../../images';
const NewPassword = ({ isModalOpen, handleCloseModal, usersID }) => {
  const header = "New Password"
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
  const [modalState, setModalState] = useState({ open: true, otpOpen: false });

  const { handleSubmit, control, formState: { errors, isValid }, watch, trigger,reset } = useForm({
    resolver: yupResolver(passwordValidationSchema(FullName)),
  });
  const password = watch('Password', '');

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
    reset({ Password: '' });
    setModalState({ open: false, otpOpen: false });
   if(handleCloseModal) {handleCloseModal(); }
  
  };
  const handleOtpOpen = () => setModalState({ ...modalState, open: false, otpOpen: true });
  const handleOtpClose = () => setModalState({ ...modalState, otpOpen: false });

  const handleBlur = async (e) => {
    const fieldName = e.target.name;
    await trigger(fieldName);
  };

  const onSubmit = async (data) => {
    try {
      dispatch(alertActions.clear());
      const result = await dispatch(authActions.generateOtp({ email }));
      if (result?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: result?.payload || result?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      await setNewPassword(data.Password);
      await handleClose();
      await handleOtpOpen();
    } catch (error) {
       dispatch(alertActions.error({ message: error?.message || error, header: "New Password" }));
    }
  };

  const handlePasswordValidation = (isValid) => {
    setIsPasswordValid(isValid);
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

      const resetResult = await dispatch(authActions.resetPasswordRequest({ userId, newPassword }));

      if (resetResult?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: resetResult?.payload || resetResult?.error.message,
          header: resetFailedLabels.header
        }));
        return;
      }

      await handleOtpClose();
      await navigate('/');
      await dispatch(alertActions.success({
        showAfterRedirect: true,
        message: resetSuccessLabels.message1,
        header: resetSuccessLabels.header
      }));
    } catch (error) {
       dispatch(alertActions.error({ message: error?.message || error, header: "New Password" }));
    }
  }

  return (
    <>
      {!(user?.loading || user?.error) && (
        <>
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
                      New Password
                    </Typography>
                    <Typography component="p" variant="body1">
                      {`Hi ${user?.FullName}, Enter your new password.`}
                    </Typography>
                  </Grid>
                  <form onSubmit={handleSubmit(onSubmit)} className='newpassword-list form forgotpasswordcontainer p-0'>
                    <PasswordInput
                      control={control}
                      name="Password"
                      label="Password"
                      rules={{ required: 'Password is required' }}
                      errors={errors}
                      handleBlur={handleBlur}
                      isPasswordValid={isPasswordValid}
                    />
                    <PasswordCheck password={password} userName={FullName} onValidationChange={handlePasswordValidation} />
                    <Box>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="Loginbutton"
                        disabled={!isValid}
                      >
                        RESET PASSWORD
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

export default NewPassword;