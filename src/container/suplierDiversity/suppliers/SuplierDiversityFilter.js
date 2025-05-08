import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomTextFieldInput, AutocompleteInput, CustomStaticDateRangePicker } from '_components';
import { activityLogAction, alertActions } from '_store';
import { Typography, Button, Box, ClickAwayListener } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { activityFilterSchema } from '_utils/validationSchema';
import dayjs from 'dayjs';

const SuplierDiversityFilter = ({portalID, handleFilterSubmit, isOpen, onClose, onOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const statusData = [
        { value: 1, label: "Success" },
        { value: 0, label: "Failed" }
    ];

    const { handleSubmit, control, watch, reset,trigger, formState: { errors } } = useForm({
         resolver: yupResolver(activityFilterSchema),
        defaultValues: {
            SelectedDate: [dayjs(new Date()), dayjs(new Date())],
            Status:null
        }
    });

    const watchedValues = watch();
    const startDate = watchedValues.SelectedDate[0];

    useEffect(() => {
        const hasValue = Object.values(watchedValues).some(value => value !== '' && value !== null);
        setIsFormValid(hasValue);
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
             const formattedAnnouncementStartDate = dayjs(data.SelectedDate[0]).format('YYYY-MM-DDTHH:mm:ss');
            const formattedAnnouncementEndDate = dayjs(data.SelectedDate[1]).format('YYYY-MM-DDTHH:mm:ss');        
            data = {
                PortalID:Number(portalID),
                UserName: data.UserEmail || null,
                Organization: data.Organization || null,
                Activity: data.Activity || null,
                ActivityDetails: data.Details || null,
                StartDate: formattedAnnouncementStartDate,
                EndDate:formattedAnnouncementEndDate,
                Status: data.Status === 0 ? false : (data.Status === 1 ? true : null)
            };
            const result = await dispatch(activityLogAction.filter(data)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
            console.log('filtered Data', data);
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
            SelectedDate: [dayjs(new Date()), dayjs(new Date())],
            UserEmail: '',
            Organization: '',
            Activity: '',
            Details: '',
            Status: null
        });
    };

    const handleClickAway = () => {
        resetValues();
        onClose();
    };

    return (
        <>
            <Button className='Filter' type="button" variant="contained" color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner Border">
                        <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                            <Typography component="div" className='userprofilelist'>
                                <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Typography variant="h2" className='userprofilelistcontent'>Suplier Diversity</Typography>
                                    </Grid>
                                </Grid>
                            </Typography>
                            <Typography component="div" className='passwordcheck SelectedDate border-none  selecticon'>
                            
                            <CustomStaticDateRangePicker
                                id="SelectedDate"
                                control={control}
                                trigger={trigger}
                                name="SelectedDate"
                                label="From - To"
                                handleBlur={handleBlur}
                                maximumDate={startDate ? dayjs(startDate).add(31, 'day') : null}
                                disablePast={false} // Ensure past dates within range are selectable
                                shouldDisableDate={(date) => {
                                    // Disable dates outside the allowed range
                                    const minDate = dayjs().subtract(12, 'month');
                                    const maxDate = dayjs().add(12, 'month');
                                    return date.isBefore(minDate, 'day') || date.isAfter(maxDate, 'day');
                                }}
                            />

                        </Typography>
                            <CustomTextFieldInput
                                control={control}
                                name="UserEmail"
                                label="User"
                            />
                            <CustomTextFieldInput
                                control={control}
                                name="Organization"
                                label="Organization"
                            />
                            <CustomTextFieldInput
                                control={control}
                                name="Activity"
                                label="Activity"
                            />
                            <CustomTextFieldInput
                                control={control}
                                name="Details"
                                label="Details"
                            />
                            <Typography className='marbottom0 selecticon'>
                            <AutocompleteInput
                                control={control}
                                name="Status"
                                label="Status"
                                options={statusData}
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
                                <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                                    Cancel
                                </Button>
                            </Typography>
                        </form>
                    </Box>
            </Popper>
        </>
    );
}

export default SuplierDiversityFilter;
