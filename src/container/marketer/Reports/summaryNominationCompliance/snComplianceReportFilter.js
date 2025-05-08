import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Box, Typography } from '@mui/material';
import Popper from '@mui/material/Popper';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import { CustomDatePicker } from '_components'; // Make sure this path is correct
import { Grid } from '@material-ui/core';

const SNComplianceFilter = ({ handleFilterSubmit }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const defaultStart = dayjs().startOf('month');
    const defaultEnd = dayjs();

    const {
        handleSubmit,
        control,
        trigger,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            StartDate: defaultStart,
            EndDate: defaultEnd
        }
    });

    const watchedValues = watch();
    const startDate = watchedValues.StartDate;

    // Define date boundaries for StartDate
    const minStartDate = dayjs().subtract(12, 'month').startOf('day');
    const maxStartDate = dayjs().endOf('day');

    // Define date boundaries for EndDate
    const maxEndDate = dayjs(); // Today

    // Calculate max end date, which should be 31 days after StartDate
    const maxEndDateForStart = startDate ? dayjs(startDate).add(31, 'day') : maxEndDate;

    useEffect(() => {
        const { StartDate, EndDate } = watchedValues;
        setIsFormValid(Boolean(StartDate && EndDate));
    }, [watchedValues]);

    const canBeOpen = Boolean(anchorEl);
    const id = canBeOpen ? 'filter-popper' : undefined;

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const onSubmit = (data) => {
        console.log("data", data);
        handleFilterSubmit(data);
        setAnchorEl(null);
    };

    const handleCancelClick = () => {
        setAnchorEl(null);
        setValue('StartDate', defaultStart);
        setValue('EndDate', defaultEnd);
    };

    return (
        <>
            <Button
                className="Filter"
                type="button"
                variant="contained"
                color="primary"
                aria-describedby={id}
                onClick={handleClick}
            >
                <FilterListIcon /> Filter
            </Button>

            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 2, bgcolor: 'background.paper', mt: 1 }} className="Filtercontainerinner">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography component="div" className="userprofilelist">
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="h2" className="userprofilelistcontent">
                                        Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        {/* Start Date Picker */}
                        <CustomDatePicker
                            control={control}
                            trigger={trigger}
                            name="StartDate"
                            label="Start Date"
                            minDate={minStartDate} // 12 months ago
                            maxDate={maxStartDate} // Today
                            error={errors.StartDate}
                            helperText={errors.StartDate ? 'Please select a valid start date' : ''}
                        />

                        {/* End Date Picker */}
                        <CustomDatePicker
                            control={control}
                            trigger={trigger}
                            name="EndDate"
                            label="End Date"
                            minDate={startDate || dayjs()} // End Date cannot be earlier than Start Date
                            maxDate={startDate ? dayjs(startDate).add(31, 'day') : dayjs()} // End Date cannot be later than 31 days after Start Date
                            error={errors.EndDate}
                            helperText={errors.EndDate ? 'Please select a valid end date' : ''}
                        />

                        <Typography component="div" className="CreateMarketerbutton" sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                className="submitbutton"
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

export default SNComplianceFilter;
