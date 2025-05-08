//NominationFilter

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CustomTextFieldInput, AutocompleteInput, CustomDatePicker } from '_components';
import { alertActions, userProfileAction } from '_store';
import { Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';

const NominationFilter = ({ handleFilterSubmit }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const statusData = [
        { value: 1, label: "Active" },
        { value: 0, label: "IsActive" }
    ];

    const { handleSubmit, control,watch, formState: { errors } } = useForm({
        defaultValues: {
            startDate: dayjs(new Date())
        }
    });

    const watchedValues = watch();
    const isFormValid = Object.values(watchedValues).every(value => value !== '');

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const result = null;//await dispatch(userProfileAction.filter(data)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
            handleFilterSubmit(result?.Data);
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
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
                                    <Typography variant="h2" className='userprofilelistcontent'></Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <CustomDatePicker
                            id="startDate"
                            control={control}
                            name="startDate"
                            label="From Date"
                        />
                           <CustomDatePicker
                            id="endDate"
                            control={control}
                            name="startDate"
                            label="To Date"
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="MarketerName"
                            label="Marketer Name"
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="ServiceProvider"
                            label="Service Provider"
                        />
                        <CustomDatePicker
                            id="startDate"
                            control={control}
                            name="startDate"
                            label="Start Date"
                        />
                        <AutocompleteInput
                            control={control}
                            name="Status"
                            label="Status"
                            options={statusData}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            className='Loginbutton'
                            color="primary"
                            disabled={!isFormValid}
                        >
                            Search
                        </Button>
                    </form>
                </Box>
            </Popper>
        </>
    );
}

export default NominationFilter;