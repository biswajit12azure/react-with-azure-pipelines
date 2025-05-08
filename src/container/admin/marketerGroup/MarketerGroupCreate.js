import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Button, Box, TextField, Popper } from '@mui/material';
import { Grid } from '@material-ui/core';
import { AddCircleOutline } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertActions, marketergroupAction } from '_store';
import { CustomFormControl, AutocompleteInput } from '_components';
import dayjs from 'dayjs';
import { createMarketerGroupSchema } from '_utils/validationSchema';

const MarketerGroupCreate = ({ marketerGroupData, isOpen, onClose, onOpen, handleRefresh }) => {
    const header = "Marketer Group";
    const dispatch = useDispatch();

    const marketerDate = marketerGroupData?.MarketerStartDate || new Date();
    const groupTypes = marketerGroupData?.GroupType?.map(j => ({ value: j.GroupTypeName, label: j.GroupTypeName })) || [];
    const jurisdictions = marketerGroupData?.Jurisdiction?.map(j => ({ value: j.JurisdictionID, label: j.JurisdictionName })) || [];
    const interruptibleBalancingModel = marketerGroupData?.BalancingModel?.map(bal => ({ value: bal.BalancingModelID, label: bal.BalancingModelName })) || [];
    const firmBalancingModel = [{ value: 4, label: "Storage Balancing" }];
    const currentDate = dayjs();
    const minDate = currentDate.subtract(3, 'month');
    const maxDate = currentDate.add(3, 'month');
    const marketerStartDate = dayjs(marketerDate);

    const [startMonth, setStartMonth] = useState(null);
    const [endMonth, setEndMonth] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    };

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger, watch } = useForm({
        resolver: yupResolver(createMarketerGroupSchema),
        mode: 'onBlur'
    });

    const groupType = watch('GroupType');

    useEffect(() => {
        if (groupType?.toLowerCase() === 'firm') {
            reset((formValues) => ({
                ...formValues,
                JurisdictionID: null,
            }));
            trigger(['GroupType', 'JurisdictionID']);
        }
    }, [groupType, reset, trigger]);

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const transformedData = {
                ID: 0,
                GroupName: data.GroupName,
                GroupType: data.GroupType,
                JurisdictionID: data.JurisdictionID || 0, // Default to 0 if null
                StartMonth: dayjs(data.StartMonth).toISOString(),
                EndMonth: dayjs(data.EndMonth).toISOString(),
                BalancingModelID: data.BalancingModelID,
                MarketerID: marketerGroupData?.MarketerID || 0,
            };

            const result = await dispatch(marketergroupAction.insert(transformedData)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
            handleClear();
            handleRefresh();
            dispatch(alertActions.success({ message: "Marketer Group Created Successfully.", header: header, showAfterRedirect: true }));           
           
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const handleCancelClick = () => {
        handleClear();
    };

    const handleClear=()=>{
        setStartMonth(null);
        setEndMonth(null);
        reset();
        onClose();
    }

    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary" aria-describedby={id} onClick={handleClick}
            ><AddCircleOutline />  Group
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer marketerGroup Border ">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Typography variant="h2" className='userprofilelistcontent'> Create Marketer Group</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <CustomFormControl
                            id="GroupName"
                            label="Marketer Group Name"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                        />
                        <AutocompleteInput
                            control={control}
                            name="GroupType"
                            label="Group Type"
                            options={groupTypes}
                            error={!!errors.GroupType}
                            helperText={errors.GroupType?.message}
                            handleBlur={handleBlur}
                            trigger={trigger}
                        />
                        <AutocompleteInput
                            control={control}
                            name="JurisdictionID"
                            label="Jurisdiction"
                            options={jurisdictions}
                            error={!!errors.JurisdictionID}
                            helperText={errors.JurisdictionID?.message}
                            handleBlur={handleBlur}
                            trigger={trigger}
                            disabled={groupType?.toLowerCase() !== 'interruptible'}
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
                                        minDate={marketerStartDate.isAfter(minDate) ? marketerStartDate : minDate}
                                        maxDate={maxDate}
                                        value={startMonth}
                                        onChange={(newValue) => {
                                            setStartMonth(newValue);
                                            field.onChange(newValue);
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
                                        minDate={startMonth ? dayjs(startMonth).add(1, 'month') : currentDate}
                                        maxDate={currentDate.add(4, 'month')}
                                        value={endMonth}
                                        onChange={(newValue) => {
                                            setEndMonth(newValue);
                                            field.onChange(newValue);
                                        }}
                                        slotProps={{
                                            textField: (params) => <TextField {...params} />
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <AutocompleteInput
                            control={control}
                            name="BalancingModelID"
                            label="Balancing Model"
                            options={groupType?.toLowerCase() === "firm" ? firmBalancingModel : interruptibleBalancingModel}
                            error={!!errors.BalancingModelID}
                            helperText={errors.BalancingModelID?.message}
                            handleBlur={handleBlur}
                            trigger={trigger}
                        />
                        <Box component="div" className="CreateMarketerbutton"   >


                            <Button type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isValid}
                            >
                                Create
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

export default MarketerGroupCreate;