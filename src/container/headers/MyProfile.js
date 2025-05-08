import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ClickAwayListener, IconButton, Tooltip, Typography } from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';
import { alertActions, authActions, userProfileAction, activityLogAction } from '_store';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Paper, Button } from "@mui/material";
import { NewPassword, ResetProfilePassword } from 'container/loginPage';
import { profileuser } from '../../images';
import { MyProfileMC, MyProfileSD } from './index';
import { ModalPopup } from '_components';

const MyProfile = ({ showHeaderMenu ,isAdmin}) => {
    const header = "My Profile";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = () => dispatch(authActions.logout());
    const auth = useSelector(x => x.auth.value);
    const id = useSelector(x => x.auth?.userId);
    const data = auth?.Data;
    const user = data?.UserDetails;
    const userAccess = data?.UserAccess;
    const authUserName = `${user.FirstName} ${user.LastName}`;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    // const open = Boolean(anchorEl);
    const [open, setOpen] = useState(false);

    const portalID = sessionStorage.getItem('portalID') || 99;
    const portal = portalID !== 99 && userAccess.find(x => x.PortalId.toString() === portalID);
    const portalKey = portal && portal.PortalKey || null;
    const role = portal?.Role;
    const [name, setName] = useState();
    //const portalKey = userAccess.find(x => x.PortalKey);
    const [expandedAccordion, setExpandedAccordion] = useState("");

    const showComponent = true;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        handleClose();
        logout();
        // let transformedData={
        // //         CreatedOn: "",
        //         UserName: `${user.FirstName} ${user.LastName}`,
        // //         Organization: "string",
        //         Activity: "LogOut",
        //         ActivityDetails: "Successully Logout from eServices Portal",
        //         Status: true,
        //         PortalId: userAccess[0].PortalId
        // }
        // console.log("adjskjdlsajdlsajdlsad",transformedData);
        dispatch(alertActions.success({ message: "You have logged out successfully. Please login to continue.", header: "Log Out", showAfterRedirect: true }));
    };
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
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

    const handleOpenDeleteModal = () => {
        setIsModalDeleteOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsModalDeleteOpen(false);
    };

    const handleClickAway = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (open) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [open]);

    const handleDelete = async () => {
        dispatch(alertActions.clear());
        try {
            // Transform the deleted profiles for further processing
            const transformedData = [{
                UserID: id,
                UpdatedBy: authUserName
            }];
            let result;

            if (transformedData.length > 0) {
                result = await dispatch(userProfileAction.delete(transformedData));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            handleCloseDeleteModal();
            handleLogOut();
            dispatch(alertActions.success({ message: "Your profile has been deleted successfully.", header: header, showAfterRedirect: true }));
        }
        catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account">
                    <IconButton
                        // onClick={handleClick}
                        onClick={() => setOpen(!open)}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <img src={profileuser} alt='profileuser' />
                        {/* <AccountCircle className='fontsizeicon' /> */}
                        {/* <Avatar sx={{ width: 32, height: 32 }}>P</Avatar> */}
                    </IconButton>
                </Tooltip>
                {open && (
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Paper
                            className='profilenavbar support-list'
                            elevation={4}
                            sx={{
                                mt: 2,
                                p: 2,
                                maxWidth: "300px",
                                mx: "auto",
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            {(!isAdmin && showHeaderMenu) && (
                                <> <Accordion
                                    expanded={expandedAccordion === "Personalinfo"}
                                    onChange={handleAccordionChange("Personalinfo")}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" className='profileName'>My Profile </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {(portalKey && portalKey?.toLowerCase() === "mc") ? <MyProfileMC /> : <MyProfileSD portalKey={portalKey} />}
                                    </AccordionDetails>
                                </Accordion>
                                    <Button className='ResetPasswordbutton' onClick={() => handleResetPasword()}>
                                        Reset Password
                                    </Button>
                                    {portalKey === "MC" && role === "Map Requestor" ? null : (
                                        <Button className='ResetPasswordbutton' onClick={() => handleOpenDeleteModal()}>
                                            Delete Profile
                                        </Button>
                                    )}
                                    </>
                            )}
                           { isAdmin && <Typography variant="h6" className='ResetPasswordbutton'>{authUserName} </Typography>}
                                    <Button className='ResetPasswordbutton' onClick={() => handleLogOut()}>
                                        Logout
                                    </Button>                               
                        </Paper>
                    </ClickAwayListener>
                )}
            </Box>
            {/* "support-list profilenavbar" */}
            {isModalDeleteOpen && <ModalPopup
                header="Profile Delete"
                message1="Are you sure, you want to delete your profile. This action is irreversible and will permanently remove all your data from the system."
                btnPrimaryText="Confirm"
                btnSecondaryText="Cancel"
                handlePrimaryClick={() => handleDelete()}
                handleSecondaryClick={() => handleCloseDeleteModal()}
            />
            }

            {/* {isResetPassword && <NewPassword usersID={id} isModalOpen={isModalOpen}
                handleCloseModal={() => handleCloseModal()}></NewPassword>} */}
             {isResetPassword && <ResetProfilePassword usersID={id} isModalOpen={isModalOpen}
                handleCloseModal={()=>handleCloseModal()}></ResetProfilePassword>} 
        </React.Fragment>
    );
}

export default MyProfile;