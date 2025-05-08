import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { labels } from "_utils/labels";
import { Link, Typography} from '@mui/material';
import { logo  , error , Check} from 'images';
const TimerModal = ({alertType, timerCountdown, header, message1, message2, btnPrimaryText, btnSecondaryText, handleBtnPrimaryClick ,handleBtnSecondaryClick}) => {
  const [open, setOpen] = useState(true);
  const [countdown, setCountdown] = useState(timerCountdown); // Set initial countdown value

  const handleClose = () => {
    setOpen(false);
    handleBtnSecondaryClick();
  };

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setOpen(false);
      handleBtnSecondaryClick();
    }
  }, [open, countdown]);

 
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"        
      >
        <Typography component="div" className="Verifyemail width590">
        <Link href="#" variant="logo" className="wgllogo">
                            <img src={logo} alt="logo"></img>
                            {labels.eServicePortal}
                        </Link> 
                        <DialogTitle id="alert-dialog-title"  className="headercontent mobile-none" >{header}</DialogTitle>
        <DialogContent className='p-0 alertpopup'>
        <Typography component="div"  className='alertTypeinner'>
         { alertType && <img src={ alertType==='error' ? error : Check} alt="Check"></img>}                  
         </Typography>
         <DialogTitle id="alert-dialog-title"  className="headercontent mobile-block" >{header}</DialogTitle>
          <DialogContentText id="alert-dialog-description" className="p-0">
            {message1 && <p className="modalpopupcontent">{message1}</p>}
            {message2 && <p className="modalpopupcontent">{message2}</p>}
            <p className="modalpopupcontent modalpopupcontenterror" >It will close automatically in {countdown} seconds.</p>
          </DialogContentText>
         
        </DialogContent>
        <DialogActions className='p-0'>
          {btnPrimaryText && <Button  className="Loginbutton" onClick={handleBtnPrimaryClick} color="primary">
            {btnPrimaryText}
          </Button>
          }
          {btnSecondaryText && <Button className="closebutton" onClick={handleClose} color="primary">
            {btnSecondaryText}
          </Button>
          }
        </DialogActions>
        </Typography>
      </Dialog>
    </div>
  );
}

export default TimerModal;