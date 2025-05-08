import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Box, Popper } from '@mui/material';
import { alertActions, configAction, masterActions } from '_store';
import { CustomFormControl, AutocompleteInput } from '_components';
import { newRoleSchema } from '_utils/validationSchema';
import Grid from "@material-ui/core/Grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddRole = ({ handleFetch }) => {
    const header = "Role";
    const dispatch = useDispatch();
    const portals = useSelector((x) => x.master?.portalData);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const portalData = (!portals?.loading && !portals?.error) ? portals?.map(x => ({
        label: x.PortalDescription,
        value: x.PortalID
    })) : [];

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: yupResolver(newRoleSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(masterActions.getPortalData());
            } catch (error) {
                dispatch(alertActions.error({
                    message: error?.message || error,
                    header: `${header} Failed`
                }));
            }
        };
        fetchData();
    }, [dispatch]);

    const onSubmit = async (data) => {
        handleOnSubmit(data);
    };

    const handleOnSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            data={...data, RoleDescription:data.RoleName}
            const result =await dispatch(masterActions.saveRole({data})).unwrap();

            if (result?.error) {
                dispatch(alertActions.error({
                    showAfterRedirect: true,
                    message: result?.payload || result?.error.message,
                    header: `${header} Addition Failed`
                }));
                return;
            }
            await handleFetch();
            await setOpen(false);
            await dispatch(alertActions.success({
                showAfterRedirect: true,
                message: "New Role added successfully.",
                header: `${header} Addition Successful`
            }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Role Addition Failed" }));
        }
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    return (<>
        <Button
            variant="contained"
            className='Download'
            color="primary" aria-describedby={id} onClick={handleClick}
        ><AddCircleOutlineIcon /> Role
        </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }} >
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}  >
                                    <Typography variant="h2" className='userprofilelistcontent'>Add New Role</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <AutocompleteInput
                            control={control}
                            name="PortalId"
                            label="Select Portal"
                            options={portalData}
                        />
                        <CustomFormControl
                            id="RoleName"
                            label="Role Name"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                        <Box className="popup-button" spacing={{ xs: 2, md: 3 }} >
                         <Button
                            type="submit"
                            variant="contained"
                            className='cancelButton'
                            color="primary"
                        >
                            cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className='Savebutton'
                            color="primary"
                        >
                            Save
                        </Button>
                        </Box>
                    </form>
                </Box>
            </Popper>
        </>);
};

        export default AddRole;