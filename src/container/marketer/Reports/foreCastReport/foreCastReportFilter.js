import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AutocompleteInput, CustomDatePicker } from '_components';
import { alertActions } from '_store';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import dayjs from 'dayjs';
import FilterListIcon from '@mui/icons-material/FilterList';

const ForeCastReportFilter = ({
    handleFilterSubmit,
    isAdmin,
    userdetails,
    data,
    activeMarketer,
    isOpen,
    onClose,
    onOpen,
}) => {

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const authUser = useSelector(x => x.auth?.value);
    const user = authUser?.Data;

    const formattedMarketer = {
        label: activeMarketer.MarketerName,
        value: activeMarketer.MarketerID
    };

    const marketerList = data?.map(x => ({
        label: x.MarketerName,
        value: x.MarketerID
    })) || [];

    const [userId, setUserId] = useState(user?.UserDetails?.id);

    const {
        handleSubmit,
        control,
        watch,
        trigger,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            MarketerName: formattedMarketer.value,
            SelectedDate: dayjs()
        }
    });

    const watchedValues = watch();

    // Enable submit button only when both MarketerName and SelectedDate have valid values
    useEffect(() => {
        const { MarketerName, SelectedDate } = watchedValues;
        const isValid = MarketerName && SelectedDate;
        setIsFormValid(isValid);
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const formattedDate = dayjs.utc(data.SelectedDate).startOf('day').toISOString();

            const transformed = {
                UserID: userId,
                CompanyID: data.MarketerName,
                StartDate: formattedDate
            };

            handleFilterSubmit(transformed);
            onClose();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        isOpen ? onClose() : onOpen();
    };

    const handleCancelClick = () => {
        onClose();
    };

    const resetValues = () => {
        reset({
            MarketerName: '',
            SelectedDate: null
        });
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
                                    <Typography variant="h2" className='userprofilelistcontent'>Reports</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <AutocompleteInput
                            control={control}
                            name="MarketerName"
                            label="Marketer Name"
                            options={marketerList}
                        />

                        <CustomDatePicker
                            control={control}
                            trigger={trigger}
                            name="SelectedDate"
                            label="Select Date"
                            minDate={dayjs().subtract(12, 'month')}
                            maxDate={dayjs().add(1, 'month')}
                            error={errors.SelectedDate}
                            helperText={errors.SelectedDate ? 'Please select a date' : ''}
                        />

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
                            <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
        </>
    );
};

export default ForeCastReportFilter;
