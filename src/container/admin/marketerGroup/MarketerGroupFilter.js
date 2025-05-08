import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CustomTextFieldInput, AutocompleteInput } from '_components';
import { alertActions, marketergroupAction } from '_store';
import { Typography, Button, Box, TextField } from '@mui/material';
import Popper from '@mui/material/Popper';
import { Grid } from '@material-ui/core';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MarketerGroupFilter = ({ marketerData, handleFilterSubmit, marketerId, setMarketerId, isOpen, onClose, onOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const marketerList = marketerData?.map(x => ({
        label: x.MarketerName,
        value: x.MarketerID
    })) || [];

    const { handleSubmit, control, watch, reset, trigger, setValue, formState: { errors,isValid } } = useForm({
        defaultValues: {
            GroupName: '',
            StartMonth: null,
            EndMonth: null,
            MarketerID: marketerId
        }
    });

    const watchedValues = watch();

    // useEffect(() => {
    //     const hasValue = Object.values(watchedValues).some(value => value !== '' && value !== null);
    //     setIsFormValid(hasValue);
    // }, [watchedValues]);

    // useEffect(() => {
    //     if (marketerId) {
    //         setValue('MarketerID', marketerId);
    //     }
    // }, [marketerId, setValue]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const startMonth = dayjs(data.StartMonth).isValid() ? dayjs(data.StartMonth).format('YYYY-MM-DDTHH:mm:ss') : null;
            const endMonth = dayjs(data.EndMonth).isValid() ? dayjs(data.EndMonth).format('YYYY-MM-DDTHH:mm:ss') : null;
            // data = { ...data, StartMonth: startMonth, EndMonth: endMonth };

             const transformed = {
                GroupName: data.GroupName || "",
                StartMonth: startMonth,
                MarketerID: data.MarketerID || 0,
                EndMonth: endMonth
                }

            const result = await dispatch(marketergroupAction.filter(transformed)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }

            setMarketerId(data?.MarketerID); // Then set to the actual value
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

    const resetValues = () => {
        reset({
            GroupName: '',
            StartMonth: null,
            EndMonth: null
        });
    };
    useEffect(() => {
        const hasValue = Object.entries(watchedValues).some(([key, value]) => {
          if (key === 'MarketerID') {
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          if (typeof value === 'object' && value !== null) {
            return true; // Date fields like StartMonth, EndMonth
          }
          return false;
        });
        setIsFormValid(hasValue);
      }, [watchedValues]);
      

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer marketerGroup Border">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Marketer</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                         <Typography component="div" className='marbottom0 selecticon marginbottom16'>
                        <AutocompleteInput
                            control={control}
                            name="MarketerID"
                            label="Select Marketer"
                            options={marketerList}
                            error={!!errors.MarketerID}
                            helperText={errors.MarketerID?.message}
                            handleBlur={handleBlur}
                            trigger={trigger}
                        />
                        </Typography>
                        <CustomTextFieldInput
                            control={control}
                            name="GroupName"
                            label="Group Name"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller

                                name="StartMonth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        className='SelectedDate '
                                        {...field}
                                        label="Start Month"
                                        views={['year', 'month']}
                                        onChange={(date) => {
                                            const startOfMonth = date?.startOf('month'); // Normalize to 1st of month
                                            field.onChange(startOfMonth); // Use field.onChange directly
                                          }}
                                        slotProps={{
                                            textField: (params) => <TextField {...params} />
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="EndMonth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        className='SelectedDate '
                                        {...field}
                                        label="End Month"
                                        views={['year', 'month']}
                                        onChange={(date) => {
                                            const endOfMonth = date?.endOf('month'); // Set to last day of month
                                            field.onChange(endOfMonth);
                                          }}
                                        slotProps={{
                                            textField: (params) => <TextField {...params} />
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <Box className="CreateMarketerbutton" spacing={{ xs: 2, md: 3 }} >

                            <Button type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isFormValid}
                            >
                                Search
                            </Button>
                            <Button
                                variant="contained"
                                className='cancelbutton'
                                color="primary"
                                onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Popper>
        </>
    );
}

export default MarketerGroupFilter;