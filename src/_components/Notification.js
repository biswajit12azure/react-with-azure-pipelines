import React,{useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import { Modal, Box } from '@mui/material';
import { alertActions } from '_store';
import images from "images";
import TimerModal from "./TimerModal";
import { genericlabels } from "_utils/labels";
import { Stack,Alert } from '@mui/material';

const Notification = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const alert = useSelector(x => x.alert.value);

    useEffect(() => {
        // clear alert on location change
        dispatch(alertActions.clear());
    }, [location]);

    if (!alert) return null;

    const handleClose=()=>{
        dispatch(alertActions.clear());
    }

    return (
        <>
         <TimerModal
                alertType={alert.type}
                timerCountdown={60}
                header={alert.header}
                message1={alert.message}
                message2={alert.message2||''}
                btnSecondaryText={genericlabels.lblClose}
                handleBtnSecondaryClick={handleClose}
            />
      </>
    );
};

export default Notification;
