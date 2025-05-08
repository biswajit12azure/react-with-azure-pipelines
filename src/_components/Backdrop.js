import React from 'react';
import { Box } from '@mui/material';

const Backdrop = ({ open, onClick }) => {
  return (
    open && (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1200, // Ensure it is above other elements
        }}
        onClick={onClick}
      />
    )
  );
};

export default Backdrop;