import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Menu, Box, MenuItem, Tooltip, IconButton, Fab, Popover } from '@mui/material';
import { alertActions, userActions } from '_store';

import { base64ToFile } from '_utils';
import { useNavigate } from 'react-router-dom';
import {supporticon , materialsymbolsdownload } from '../../images';
import Grid from '@mui/material/Grid2';

const Support = () => {
    const header = "Support";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const support = useSelector(x => x.users?.supportDetails);
    const [files, setFiles] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    let portalID = sessionStorage.getItem('portalID') || 99;

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const result = await dispatch(userActions.getSupportDetails(portalID)).unwrap();
                if (result?.Data?.FileData) {
                    setFiles(result?.Data?.FileData);
                }
            } catch (error) {
                console.log(error?.message || error);
            }
        };
        if (portalID) {
            fetchData();
        }
    }, [dispatch]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEmailService = () => {
        handleClose();
        window.location.href = `mailto:${support?.EmailAddress}`;
    };

    const handleDownload = (base64String, fileName) => {
        base64ToFile(base64String, fileName);
    };

    return (
        <React.Fragment>
            <Fab color="primary" aria-label="chat" onClick={handleClick} style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <img src={supporticon} alt="supporticon" className='supporticonimg'></img>
            </Fab>
            <Popover
           
                id="support-popover"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                PaperProps={{
                    style: { marginBottom: 56 } // Add margin to avoid overlapping the button
                }}
            >
                <Box p={2}>
                    <Menu component="div"
                        className='support-list supporticonlist'
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                      //  onClick={handleClose}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Typography component="div" class="supportcontainer">
                        <Typography component="h3">support</Typography>
                       {support?.EmailAddress && <MenuItem onClick={handleEmailService} component="div">
                        <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <span className='EmailAddress'>Email Us</span>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <span className="DocumentDescription" >{`${support?.EmailAddress}`}</span>
                          </Grid>
                          </Grid>
                        </MenuItem>}
                      {support?.PhoneNumber &&  <MenuItem component="div">
                        <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <span className='EmailAddress'>Call Us</span>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                          <span >{support?.PhoneNumber}</span>
                          </Grid>
                          </Grid>
                           
                           
                        </MenuItem>}
                     {support?.Fax &&   <MenuItem component="div">
                        <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <span className='EmailAddress' >Fax Us</span>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                          <span >{support?.Fax}</span>
                          </Grid>
                          </Grid>
                       
                           
                        </MenuItem>}
                        <MenuItem component="div">
                        <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <span className='EmailAddress'>  Reference Documents </span>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                          {files && files.map((file) =>
                                <Typography component="div" key={file?.FileName} >
                                    <Typography component="div" >
                                <Typography component="span" >{file?.FileName}</Typography>
                                              <Typography component="div" className="DocumentTypeID">
                                              <IconButton onClick={() => handleDownload(file?.File, file?.FileName)}>
                                          <img src={materialsymbolsdownload} alt='download'></img>
                                        </IconButton>
                                    </Typography>
                                    </Typography>
                                </Typography>
                            )}
                             {/* <Typography component="div" className="DocumentDescription" >
                                    
                                    <Typography component="div" >
                                    <Typography component="span" > dcjhcjdscdjcb jc dsuchd</Typography>
                                        <IconButton  className="DocumentTypeID">
                                           
                                            <img src={materialsymbolsdownload} alt='download'></img>
                                        </IconButton>
                                    </Typography>
                                </Typography> */}
                          </Grid>
                          </Grid>
                       
                           
                        </MenuItem>
                        </Typography>
                    </Menu>
                </Box>
            </Popover>
        </React.Fragment>
    );
}

export default Support;