import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ModalPopup } from '_components';
import { verifiedRegistrationLabels, notVerifiedRegistrationLabels, genericlabels, emailSentLabels, verifyEmailLabels} from '_utils/labels';
import { registrationActions } from '_store/registration.slice';
import TimerModal from '_components/TimerModal';
import { alertActions } from '_store';
import { Login } from 'container/loginPage';
import { LoginLayout } from 'container/layout';

const VerifiedRegistration = () => {
    const header = "Verfication";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userVerify = useSelector((x) => x.registration?.verifiedUserData);
    const data = userVerify?.Data;
    const isVerified = data?.IsVerified || data?.Status?.toLowerCase() == 'submitted';
    const portalKey = data?.PortalKey || '';
    const portalID = data?.PortalID || 0;
    const isRequiredCompleteRegistration = portalKey.toLowerCase() === 'mc';

    const verifyId = new URLSearchParams(location.search).get('verifyId');
    const id = data?.UserId;
    const emailAddress = data?.Email;
    useEffect(() => {
        const verifyEmail = async () => {
            try {
               const  result =  await dispatch(registrationActions.getVerifiedUserData(verifyId));
               if (result?.error) {
                dispatch(alertActions.success({
                    showAfterRedirect: true,
                    message: result?.payload || result?.error.message,
                    header: `Verfication Completed`
                }));
                return;
            }
            
            } catch (error) {
                dispatch(alertActions.error({ message: error?.message || error, header: "Verification Failed" }));
            }
        };

        if (verifyId) {
            verifyEmail();
        } else {
            dispatch(alertActions.error({ message: "Email verification Id not found!", header: "Verification Failed" }));
        }
    }, [dispatch, verifyId]);

    const handleClick = () => {
        if (id) {
            sessionStorage.setItem('portalID', portalID);
            if (portalKey.toLowerCase() === 'mc') {
                navigate(`/registration/mapCenter/${portalKey}/${id}`);
                sessionStorage.setItem('mapcenterUserID', id);
            }
            else if (portalKey.toLowerCase() === 'sd') {
                navigate(`/registration/diversity/${portalKey}/${id}`);
            }
        }
        return;
    };

    const handleSubmit = async () => {
        try {
            var result = await dispatch(registrationActions.resendVerificationLink({ emailAddress, id }));
            if (result?.error) {
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: "Resend email failed.",
                    header: "Resend email failed."
                }));
                return;
            }
            handleClose();
            dispatch(alertActions.success({
                showAfterRedirect: true,
                message: emailSentLabels.message1,
                header: emailSentLabels.header
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Verification Failed" }));

        }
    }

    const handleClose = () => {
        navigate('/');
    }

    if (!verifyId) return null;

    return (

        <>
            <LoginLayout />
            {(userVerify && !(userVerify?.loading || userVerify?.error)) && <div>

                {(isVerified && isRequiredCompleteRegistration) && <ModalPopup
                    header={verifiedRegistrationLabels.header}
                    message1={verifiedRegistrationLabels.message1}
                    //message2={verifiedRegistrationLabels.message2}
                    btnPrimaryText={verifiedRegistrationLabels.btnPrimaryText}
                    btnSecondaryText={verifiedRegistrationLabels.btnSecondaryText}
                    handlePrimaryClick={() => handleClick()}
                    handleSecondaryClick={() => handleClose()}
                    className="verifiedRegistrationpopup"
                />
                }
                {(isVerified && !isRequiredCompleteRegistration) && <TimerModal
                    timerCountdown={60}
                    header={verifiedRegistrationLabels.header}
                   // message1={verifiedRegistrationLabels.message1}
                    message2={portalKey.toLowerCase() === 'sd' ? verifiedRegistrationLabels.messageSd: verifiedRegistrationLabels.message2NonRegistration}
                    btnSecondaryText={genericlabels.lblClose}
                    handleBtnSecondaryClick={() => handleClose()}
                />
                }
                {!isVerified && <ModalPopup
                    header={notVerifiedRegistrationLabels.header}
                    message1={notVerifiedRegistrationLabels.message1}
                    message2={notVerifiedRegistrationLabels.message2}
                    btnPrimaryText={notVerifiedRegistrationLabels.btnPrimaryText}
                    btnSecondaryText={notVerifiedRegistrationLabels.btnSecondaryText}
                    handlePrimaryClick={() => handleSubmit()}
                    handleSecondaryClick={() => handleClose()}
                    className="verifiedRegistrationpopup"
                />
                }
            </div>
            }
        </>);
}

export default VerifiedRegistration;