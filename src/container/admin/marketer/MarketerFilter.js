import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
    CustomTextFieldInput,
    CustomDatePicker,
    MultiSelectInput
} from '_components';
import { alertActions } from '_store';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { marketerAction } from '_store/marketer.slice';
import dayjs from 'dayjs';

const MarketerFilter = ({ handleFilterSubmit, isOpen, onClose, onOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const statusData = [
        { value: 'true', label: "Active" },
        { value: 'false', label: "Inactive" }
    ];

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            MarketerName: '',
            ServiceProvider: '',
            StartDate: null,
            IsActive: ''
        }
    });

    const watchedValues = watch();

    useEffect(() => {
        const hasValue = Object.values(watchedValues).some(
            value => value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)
        );
        setIsFormValid(hasValue);
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());

        const parsedDate = data.StartDate ? dayjs(data.StartDate) : null;

        let isActiveValue;
        const statusString = data.IsActive;

        if (statusString === 'true,false' || statusString === '' || statusString === null) {
            isActiveValue = null;
        } else if (statusString === 'true') {
            isActiveValue = true;
        } else if (statusString === 'false') {
            isActiveValue = false;
        } else {
            isActiveValue = null;
        }

        try {
            const payload = {
                ...data,
                MarketerName: data.MarketerName || null,
                ServiceProvider: data.ServiceProvider || null,
                StartDate: parsedDate || null,
                IsActive: isActiveValue
            };

            const result = await dispatch(marketerAction.filter(payload)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }

            handleFilterSubmit(result?.Data);
            resetValues();
            onClose();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    };

    const handleCancelClick = () => {
        resetValues();
        onClose();
    };

    const handleStatusChange = (newStatusValue) => {
        setSelectedStatus(newStatusValue);
        setValue("IsActive", newStatusValue);
        trigger("IsActive");
    };

    const resetValues = () => {
        reset({
            MarketerName: '',
            ServiceProvider: '',
            StartDate: null,
            IsActive: ''
        });
        setSelectedStatus('');
    };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon /> Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Marketer</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <CustomTextFieldInput
                            control={control}
                            name="MarketerName"
                            label="Marketer Name"
                            errors={errors}
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="ServiceProvider"
                            label="Service Provider"
                            type="number"
                            rules={{ valueAsNumber: true }}
                        />

                        <Typography component="div" className="SelectedDate">
                            <CustomDatePicker
                                id="StartDate"
                                control={control}
                                name="StartDate"
                                label="Start Date"
                            />
                        </Typography>

                        <Typography className='marbottom0 selecticon'>
                            <MultiSelectInput
                                id="status"
                                control={control}
                                name="IsActive"
                                label="Status"
                                options={statusData}
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                error={!!errors.IsActive}
                                helperText={errors.IsActive?.message}
                                handleBlur={handleBlur}
                                setValue={setValue}
                                trigger={trigger}
                            />
                        </Typography>

                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isFormValid}
                            >
                                Search
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                className="cancelbutton"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
        </>
    );
};

export default MarketerFilter;
