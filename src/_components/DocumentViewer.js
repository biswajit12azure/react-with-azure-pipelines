import React from 'react';
import FileViewer from 'react-file-viewer';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // This makes the modal scrollable
};

const DocumentViewer = ({ open, handleClose, file, type }) => {
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Box sx={style}>
          <Box className="row modalpopupinner">
            <FileViewer
              fileType={type}
              filePath={file} />
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default DocumentViewer;
