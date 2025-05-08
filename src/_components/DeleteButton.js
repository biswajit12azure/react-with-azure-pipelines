import React from "react";
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

const DeleteButton = ({ onDelete, disabled }) => {
    return (
      <Grid size={{ xs: 12, sm: 12, md: 12 }} className="containedLoginbutton">
        <Button
          type="delete"
          variant="contained"
          className="Loginbutton"
          color="primary"
          onClick={onDelete} 
          disabled={disabled}
        >
          Delete
        </Button>
      </Grid>
    );
  };

export default DeleteButton;