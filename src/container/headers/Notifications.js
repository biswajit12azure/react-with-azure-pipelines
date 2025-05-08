import * as React from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { authActions } from '_store';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import { Typography, Button } from '@mui/material';
const Notifications = () => {
    const dispatch = useDispatch(); 
    const logout = () => dispatch(authActions.logout());
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        handleClose();
        logout();
    };

    return (
        <React.Fragment>
            <Box  sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Notifications">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <NotificationsNoneOutlinedIcon className='fontsizeicon'/>
                        {/* <Avatar sx={{ width: 32, height: 32 }}>P</Avatar> */}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu className="Notifications"
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
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
                <MenuItem onClick={handleClose}>
              
              <Typography variant="div" component="div" className="CardDetailContainer-right">
                <Typography variant="h3" component="h3" className="Announcements-text">Announcements</Typography>
                <Typography className='Announcementcontainer' component="div" >
                  <Typography className='Announcementsnew' component="div" >
                  
                  <Typography component="div" className="dateMonth">
                    <Typography component="h2">
                      29
                    </Typography>
                    <Typography component="span">
                      Nov
                    </Typography>
                    </Typography>
                    <Typography  component="div">
                        <Typography component="h3" className='title'>Management</Typography>
                        <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                    </Typography>
                    
                    </Typography>
                    <Typography className='Announcementsnew' component="div" >
                  
                  <Typography component="div" className="dateMonth">
                    <Typography component="h2">
                      29
                    </Typography>
                    <Typography component="span">
                      Nov
                    </Typography>
                    </Typography>
                    <Typography  component="div">
                        <Typography component="h3" className='title'>Management</Typography>
                        <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                    </Typography>
                    
                    </Typography>
                    <Typography className='Announcementsnew' component="div" >
                  
                  <Typography component="div" className="dateMonth">
                    <Typography component="h2">
                      29
                    </Typography>
                    <Typography component="span">
                      Nov
                    </Typography>
                    </Typography>
                    <Typography  component="div">
                        <Typography component="h3" className='title'>Management</Typography>
                        <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                    </Typography>
                 
                    
                    </Typography>
                    <Typography className='Announcementsnew' component="div" >
                  
                  <Typography component="div" className="dateMonth">
                    <Typography component="h2">
                      29
                    </Typography>
                    <Typography component="span">
                      Nov
                    </Typography>
                    </Typography>
                    <Typography  component="div">
                        <Typography component="h3" className='title'>Management</Typography>
                        <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                    </Typography>
                 
                    
                    </Typography>
                    <Typography className='Announcementsnew' component="div" >
                  
                  <Typography component="div" className="dateMonth">
                    <Typography component="h2">
                      29
                    </Typography>
                    <Typography component="span">
                      Nov
                    </Typography>
                    </Typography>
                    <Typography  component="div">
                        <Typography component="h3" className='title'>Management</Typography>
                        <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                    </Typography>
                 
                    
                    </Typography>
              
                   
              
                </Typography>
                
              </Typography>
              <Button type="submit" variant="contained" className='submitbutton' color="primary">
                                          View More
                                    </Button>
     
                  
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
   
}

export default Notifications;