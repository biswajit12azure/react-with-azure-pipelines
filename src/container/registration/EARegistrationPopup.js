import React, { useState } from "react";
import { Box, Modal, Button, Link, Checkbox, FormControlLabel } from '@mui/material';
import { logo } from 'images';
import Grid from "@material-ui/core/Grid";
import { aggrementEALabel, labels } from "_utils/labels";

const EARegistrationPopup = ({ header, message1, btnPrimaryText, btnSecondaryText, handlePrimaryClick, handleSecondaryClick }) => {
  const [open, setOpen] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (handleSecondaryClick) {
      handleSecondaryClick();
    }
  };

  const handlePrimaryButtonClick = () => {
    if (isChecked) {
      handlePrimaryClick();
    } else {
      alert("Please check the box before proceeding.");
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        className="displayblock"
      >
        <Box className="modalpopup">
          <Box className="row modalpopupinner">
            <Grid item xs={12} className="p-0">
              <Link href="#" variant="logo" className="wgllogo">
                <img src={logo} alt="logo" />
                {labels.eServicePortal}
              </Link>
              <h3 className="headercontent"><b>{aggrementEALabel.confText}</b></h3>
              <Box display="flex" alignItems="flex-start">                
                <p className="modalpopupcontent">{message1}</p>
              </Box>
              <Box display="flex" alignItems="flex-start" className="cheboxinline">
              <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  name="consentCheckbox"
                  color="primary"
                /> <p className="modalpopupcontent marginauto">{aggrementEALabel.agreeText}</p>
                </Box>
              {btnPrimaryText && (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="Loginbutton mar-48"
                  onClick={handlePrimaryButtonClick}
                  disabled={!isChecked}
                >
                  {btnPrimaryText}
                </Button>
              )}
              {btnSecondaryText && (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className="closebutton"
                  onClick={handleClose}
                >
                  {btnSecondaryText}
                </Button>
              )}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default EARegistrationPopup;