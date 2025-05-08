import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Link, Typography, makeStyles, Slide } from "@material-ui/core";
import { labels } from "_utils/labels";
import { logo } from 'images';
import red from "@material-ui/core/colors/red";
const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: 0
  },
  button: {
    borderRadius: 0,
    textTransform: "none",
    padding: 5
  },
  logout: {
    color: "#fff",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  countdown: {
    color: red[700]
  }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SessionTimeoutDialog = ({ open, countdown, onLogout, onContinue }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.dialog }}
      TransitionComponent={Transition}>
      <Typography component="div" className="Verifyemail width590">
        <Link href="#" variant="logo" className="wgllogo">
          <img src={logo} alt="logo"></img>
          {labels.eServicePortal}
        </Link>
        <DialogTitle id="alert-dialog-title" className="headercontent  notificationtitle" >Session Timeout</DialogTitle>
        <DialogContent className='p-0 alertpopup'>
          <DialogContentText id="alert-dialog-description" className="p-0">
            <p>
              The current session is about to expire in{" "}
              <span className={classes.countdown}>{countdown}</span> seconds.
            </p>
            <p>{`Would you like to continue the session?`}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='p-0 successclosebutton'>
          <Button
            onClick={onLogout}
            variant="contained" color="red" className="cancelbutton" >
            Logout
          </Button>
          <Button
            onClick={onContinue}
            variant="contained"
            className='submitbutton'
            color="primary"
          >
            Continue Session
          </Button>
        </DialogActions>
      </Typography>
    </Dialog>
  );
}
export default SessionTimeoutDialog;