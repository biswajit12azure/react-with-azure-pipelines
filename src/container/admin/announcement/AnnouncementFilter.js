import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { MultiSelectInput, AutocompleteInput } from '_components';
import { Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { filterPopupAnnounceMentSchema } from '_utils/validationSchema';

const AnnouncementFilter = ({ isOpen, onClose, onOpen, portalId, portalData, roleData, onApplyFilter }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = useState(false);
    const [receptionList, setReceptionList] = useState([]);
    const [selectedPortal, setSelectedPortal] = useState(null);
    const [selectedRoleID, setSelectedRoleID] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
        setSelectedRoleID('');
        reset();
    };
    const anchorRef = useRef(null);
    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const { control, reset, formState: { errors, isValid }, setValue, handleSubmit, watch } = useForm({
        resolver: yupResolver(filterPopupAnnounceMentSchema)
    });

    const handlePortalChange = (event, newValue) => {
        setSelectedPortal(newValue);
        setValue('PortalID', newValue);
        const portalRoles = roleData?.filter(x => x.PortalID === newValue);
        const roles = portalRoles ? portalRoles.map(x => ({
            label: x.RoleName,
            value: x.RoleID.toString()
        })) : [];
        setReceptionList(roles);
    };

    const handleRoleChange = (newValue) => {
        setSelectedRoleID(newValue);
    };

    const handleFilterSubmit = () => {
        onApplyFilter({ PortalID: selectedPortal, RoleIds: selectedRoleID });
        onClose();
    };

    const portalValue = watch("filterPortalID");
    const roleValue = watch("filterRoleID");
    const isButtonEnabled = portalValue || roleValue;

    return (
        <>
            <Tooltip title="Filter">
                <div>
                    <IconButton
                        ref={anchorRef}
                        onClick={handleClick}
                        style={{ backgroundColor: '#acd0ff', borderRadius: '50%' }}
                    >
                        <FilterListIcon style={{ color: 'white' }} />
                    </IconButton>
                </div>
            </Tooltip>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form className='Registrationcontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>User Profile</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <AutocompleteInput
                                    id="filterPortalID"
                                    control={control}
                                    name="filterPortalID"
                                    label="Select Portal"
                                    options={portalData}
                                    error={!!errors.PortalID}
                                    helperText={errors.PortalID?.message}
                                    onChange={handlePortalChange}
                                />
                            </Grid>

                            <Grid item>
                                <MultiSelectInput
                                    id="filterRoleID"
                                    control={control}
                                    name="filterRoleID"
                                    label="Select Recipient"
                                    options={receptionList}
                                    error={!!errors.RoleID}
                                    helperText={errors.RoleID?.message}
                                    value={selectedRoleID}
                                    setValue={setValue}
                                    onChange={handleRoleChange}
                                />
                            </Grid>
                        </Grid>
                    </form>

                    <Typography component="div" className="CreateMarketerbutton">
                        <Button
                            variant="contained"
                            color="primary"
                            className="submitbutton"
                            disabled={!isButtonEnabled}
                            onClick={handleFilterSubmit}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className="cancelbutton"
                            onClick={handleClick}
                        >
                            Cancel
                        </Button>
                    </Typography>
                </Box>
            </Popper>
        </>
    );
}

export default AnnouncementFilter;
