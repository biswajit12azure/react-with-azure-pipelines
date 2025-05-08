import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ModalPopup } from '_components';
import { verifiedRegistrationLabels, notVerifiedRegistrationLabels, genericlabels, emailSentLabels } from '_utils/labels';
import { registrationActions } from '_store/registration.slice';
import TimerModal from '_components/TimerModal';
import { alertActions } from '_store';

const VerifiedRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userVerify = useSelector((x) => x.registration?.verifiedUserData);
    const data = userVerify?.Data;
    const isVerified = data?.IsVerified;
    const portalKey = data?.PortalKey || '';
    const portalID = data?.PortalID || 0;
    const isRequiredCompleteRegistration = portalKey.toLowerCase() === 'mc' || portalKey.toLowerCase() === 'sd';
   
    const verifyId = new URLSearchParams(location.search).get('verifyId');
    const id = data?.UserId;
    const emailAddress = data?.Email;

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await dispatch(registrationActions.getVerifiedUserData(verifyId));
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
            localStorage.setItem('portalID', portalID);
            if (portalKey.toLowerCase() === 'mc') {
                navigate(`/registration/mapCenter/${portalKey}/${id}`);
            }
            else if (portalKey.toLowerCase() === 'sd') {
                navigate(`/registration/diversity/${portalKey}/${id}`);
            }
        }
        return;
    };

    const handleSubmit = async () => {
        try {
            var result = await dispatch(registrationActions.resendVerificationLink({emailAddress, id}));
            if (result?.error) {
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: "Resend email failed.",
                    header: "Resend email failed."
                }));
                return;
            }

            dispatch(alertActions.success({
                showAfterRedirect: true,
                message: emailSentLabels.message1,
                header: emailSentLabels.header
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Verification Failed" }));

        }
    }

    if (!verifyId) return null;

    return (

        <>
            {(userVerify && !(userVerify?.loading || userVerify?.error)) && <div>

                {(isVerified && isRequiredCompleteRegistration) && <ModalPopup
                    header={verifiedRegistrationLabels.header}
                    message1={verifiedRegistrationLabels.message1}
                    message2={verifiedRegistrationLabels.message2}
                    btnPrimaryText={verifiedRegistrationLabels.btnPrimaryText}
                    btnSecondaryText={verifiedRegistrationLabels.btnSecondaryText}
                    handlePrimaryClick={() => handleClick()}
                    className="verifiedRegistrationpopup"
                />
                }
                {(isVerified && !isRequiredCompleteRegistration) && <TimerModal
                    timerCountdown={60}
                    header={verifiedRegistrationLabels.header}
                    message1={verifiedRegistrationLabels.message1}
                    message2={verifiedRegistrationLabels.message2NonRegistration}
                    btnSecondaryText={genericlabels.lblClose}
                    handleBtnSecondaryClick={() => handleClick()}
                />
                }
                {!isVerified && <ModalPopup
                    header={notVerifiedRegistrationLabels.header}
                    message1={notVerifiedRegistrationLabels.message1}
                    message2={notVerifiedRegistrationLabels.message2}
                    btnPrimaryText={notVerifiedRegistrationLabels.btnPrimaryText}
                    btnSecondaryText={notVerifiedRegistrationLabels.btnSecondaryText}
                    handlePrimaryClick={() => handleSubmit()}
                     className="verifiedRegistrationpopup"
                />
                }
            </div>
            }
        </>);
}

export default VerifiedRegistration;