import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

const LoadingOverlay = ({ loading }) => {
    return (
        loading && (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    );
};

export default LoadingOverlay;