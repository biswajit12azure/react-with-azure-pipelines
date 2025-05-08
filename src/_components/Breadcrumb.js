import React from 'react';
import { Breadcrumbs, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Home } from '@mui/icons-material';

const Breadcrumb = ({ breadcrumb , handleHomeClick}) => {
    return (
        <>
            {(breadcrumb && breadcrumb !== '') && (
                <Breadcrumbs separator="" aria-label="breadcrumb">
                    <IconButton>
                        <Home onClick={handleHomeClick}></Home>
                    </IconButton>
                    {breadcrumb && (
                        <Typography color="textPrimary">
                            {breadcrumb}
                        </Typography>
                    )}
                </Breadcrumbs>)
            }
        </>
    );
};

Breadcrumb.propTypes = {
    breadcrumb: PropTypes.string.isRequired,
};

export default Breadcrumb;