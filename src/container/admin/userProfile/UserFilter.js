import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomTextFieldInput, AutocompleteInput } from '_components';
import { alertActions, userProfileAction } from '_store';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { userProfileFilterSchema } from '_utils/validationSchema';

const UserFilter = ({ portalsList, handleFilterSubmit, handleportal, statuses, changePortalName }) => {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;
    const dispatch = useDispatch();

    const portalData = portalsList ? portalsList.map(x => ({
        label: x.PortalName,
        value: x.PortalId
    })) : [];

    const { handleSubmit, control, reset, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(userProfileFilterSchema),
        mode: 'onBlur'
    });

    // const watchedValues = watch(); // Watch all form values
    // const isFormValid = watchedValues.PortalId !== undefined && watchedValues.PortalId !== '';

    const handleChange = () => {
        trigger('PortalId');
    }

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const result = await dispatch(userProfileAction.filter(data)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
            changePortalName(data.PortalId);
            handleportal(data);
            handleFilterSubmit(result?.Data);
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };


    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>User Profile</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <AutocompleteInput
                            control={control}
                            name="PortalId"
                            label="Select Portal"
                            options={portalData}
                            error={!!errors.PortalId}
                            helperText={errors.PortalId?.message}
                            handleBlur={handleBlur}
                            trigger={trigger}
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="email"
                            label="Email Address"
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="fullName"
                            label="Full Name"
                        />

                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isValid}
                            >
                                Search
                            </Button>
                            <Button variant="contained" color="red" className="cancelbutton"
                            >
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
        </>
    );
}

export default UserFilter;