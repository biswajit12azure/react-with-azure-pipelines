import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AutocompleteInput, CustomDatePicker } from '_components';
import { alertActions } from '_store';
import { Typography, Button, Box } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';
import FilterListIcon from '@mui/icons-material/FilterList';

const SupplierActiveCustomerFilter = ({
    handleFilterSubmit,
    date,
    markterList,
    activeMarketer,
    isOpen,
    onClose,
    onOpen,
}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    // Safely sort marketer list
    const marketerOptions = useMemo(() => {
        return [...(markterList || [])]
            .filter(x => x?.MarketerName)
            .sort((a, b) => (a.MarketerName || '').localeCompare(b.MarketerName || ''))
            .map(x => ({
                label: x.MarketerName,
                value: x.MarketerID
            }));
    }, [markterList]);

    const defaultMarketer = useMemo(() => {
        if (!activeMarketer?.MarketerID) return null;
        return {
            label: activeMarketer.MarketerName,
            value: activeMarketer.MarketerID
        };
    }, [activeMarketer]);

    const {
        handleSubmit,
        control,
        watch,
        trigger,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            MarketerName: defaultMarketer?.value || '',
            SelectedDate: dayjs()
        }
    });

    const watchedValues = watch();

    useEffect(() => {
        const { MarketerName, SelectedDate } = watchedValues;
        setIsFormValid(Boolean(MarketerName && SelectedDate));
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const formattedDate = dayjs(data.SelectedDate).startOf('day').toISOString();
            const transformed = {
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
                            options={marketerOptions}
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
                            <Button variant="contained" color="error" className="cancelbutton" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
        </>
    );
};

export default SupplierActiveCustomerFilter;
