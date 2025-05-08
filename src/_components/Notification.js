import React,{useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { alertActions, authActions } from '_store';
import TimerModal from "./TimerModal";
import { genericlabels } from "_utils/labels";

const Notification = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const alert = useSelector(x => x.alert.value);
    const logout = () => dispatch(authActions.logout());

    useEffect(() => {
        // clear alert on location change
        dispatch(alertActions.clear());
    }, [location]);

    if (!alert) return null;

    const handleClose=()=>{
        dispatch(alertActions.clear());
        if(alert.islogout){
            logout();
        }
    }

    return (
        <>
         <TimerModal
                alertType={alert.type}
                timerCountdown={60}
                header={alert.header}
                message1={alert.message}
                message2={alert.message2||''}
                btnSecondaryText={alert.buttonText || genericlabels.lblClose}
                handleBtnSecondaryClick={handleClose}
            />
      </>
    );
};

export default Notification;
