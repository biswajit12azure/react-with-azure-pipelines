import React ,{useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Menu, MenuItem, ListItemIcon, IconButton, Tooltip, Typography } from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';
import { authActions } from '_store';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";
import { NewPassword, ResetProfilePassword } from 'container/loginPage';
import { MyProfileDetails } from 'container/user';
import { profileuser } from '../../images';

const MyProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = () => dispatch(authActions.logout());
    const auth = useSelector(x => x.auth.value);
    const id = useSelector(x => x.auth?.userId);
    const data = auth?.Data;
    const user = data?.UserDetails;
    const userAccess = data?.UserAccess;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const open = Boolean(anchorEl);

    const portalID = localStorage.getItem('portalID') || 99;

    const portalKey = userAccess.find(x => x.PortalId.toString() === portalID);

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

    const handleProfileClick = async () => {
        await handleClose();
        navigate('profile');
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsResetPassword(false);
    }

    const handleResetPasword = () => {
        handleClose();
        setIsResetPassword(true);
        setIsModalOpen(true)
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                    <img src={profileuser} alt='profileuser'/>
                        {/* <AccountCircle className='fontsizeicon' /> */}
                        {/* <Avatar sx={{ width: 32, height: 32 }}>P</Avatar> */}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu className="support-list"
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                //onClick={handleClose}
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
                <MenuItem>
                    <Accordion key={11} className="AccordionSummaryheadingcontent">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel11-content"
                            id="panel11-header"
                        >
                            <Typography className="AccordionSummaryheading" >{`Hi, ${user?.FirstName} ${user?.LastName}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="p-0">
                            <Typography className="AccordionDetailslistcontent">
                               {/* { portalID===99 &&   */}
                                <MyProfileDetails></MyProfileDetails>
                                {/* }  */}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </MenuItem>
                <MenuItem onClick={()=>handleProfileClick()}>
                    <AccountCircle fontSize="small" /> Profile
                </MenuItem>
                <MenuItem onClick={()=>handleResetPasword()}>
                    <AccountCircle fontSize="small" /> Reset Password
                </MenuItem>
                <MenuItem onClick={()=>handleLogOut()}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                        Logout
                    </ListItemIcon>
                </MenuItem>
            </Menu>
            {isResetPassword && <NewPassword usersID={id} isModalOpen={isModalOpen}
                handleCloseModal={()=>handleCloseModal}></NewPassword>}
                 {/* {isResetPassword && <ResetProfilePassword usersID={id} isModalOpen={isModalOpen}
                handleCloseModal={()=>handleCloseModal}></ResetProfilePassword>}  */}
        </React.Fragment>
    );
}

export default MyProfile;