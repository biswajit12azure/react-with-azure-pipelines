import React, { useRef, useState } from "react";
import {useIdleTimer} from "react-idle-timer";
import SessionTimeoutDialog from "./SessionTimeoutDialog";
let countdownInterval;
let timeout;
const SessionTimeout =  ({ isAuthenticated, onLogout }) => {
  const sessionTimeoutTime= process.env.REACT_APP_SESSION_TIMEOUT_MINUTES || 20;
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  const idleTimer = useRef(null);
  const clearSessionTimeout = () => {
    clearTimeout(timeout);
  };
  const clearSessionInterval = () => {
    clearInterval(countdownInterval);
  };
  const handleLogout = async (isTimedOut = false) => {
      setTimeoutModalOpen(false);
      clearSessionInterval();
      clearSessionTimeout();
      onLogout();
  };
  const handleContinue = () => {
    setTimeoutModalOpen(false);
    clearSessionInterval();
    clearSessionTimeout();
  };
  const onActive = () => {
    if (!timeoutModalOpen) {
      clearSessionInterval();
      clearSessionTimeout();
    }
  };
  const onIdle = () => {
    const delay = 1000 * 1;
    if (isAuthenticated && !timeoutModalOpen) {
      timeout = setTimeout(() => {
        let countDown = 10;
        setTimeoutModalOpen(true);
        setTimeoutCountdown(countDown);
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown);
          } else {
            handleLogout(true);
          }
        }, 1000);
      }, delay);
    }
  };

  useIdleTimer({
    ref: idleTimer,
    timeout: 1000 * 60 * sessionTimeoutTime, // 10 minutes
    onIdle: onIdle,
    debounce: 500, // 500 milliseconds
    onActive:onActive
  });

  return (     
      <SessionTimeoutDialog
        countdown={timeoutCountdown}
        onContinue={handleContinue}
        onLogout={() => handleLogout(false)}
        open={timeoutModalOpen}
      />  
  );
}
export default SessionTimeout;