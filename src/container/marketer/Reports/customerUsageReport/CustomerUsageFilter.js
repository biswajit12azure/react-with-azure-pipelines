import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CustomTextFieldInput, AutocompleteInput, CustomDatePicker ,CustomStaticDateRangePicker1} from '_components';
import { alertActions,marketerReportAction } from '_store';
import { Typography, Button, Box, ClickAwayListener, TextField } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import dayjs from 'dayjs';
import FilterListIcon from '@mui/icons-material/FilterList';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
const CustomerUsageFilter = ({ handleFilterSubmit,isAdmin,userdetails,data,fromDate,toDate, isOpen, onClose, onOpen,setFromDate, setToDate }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const statusData = [
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" }
    ];
    console.log(data);
    const marketerList = data?.MarketerDetails?.map(x => ({
        label: x.MarketerName,
        value: x.MarketerID
    }));
    const { handleSubmit, control, watch,trigger ,setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            MarketerName: '',
            ServiceProvider: '',
            StartDate: null,
            IsActive: null
        }
    });

    const watchedValues = watch();
    useEffect(() => {
        if (fromDate & toDate) {
            setValue('SelectedDate', [dayjs(fromDate), dayjs(toDate)]);
        }
    }, [fromDate, toDate, setValue]);
    useEffect(() => {
        const hasValue = Object.values(watchedValues).some(value => value !== '' && value !== null);
        setIsFormValid(hasValue);
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;


// const onSubmit = async (data) => {
//      const formattedStartDate = dayjs(data.SelectedDate[0]).format('YYYY-MM-DDTHH:mm:ss');
//      const formattedEndDate = dayjs(data.SelectedDate[1]).format('YYYY-MM-DDTHH:mm:ss');
//      setFromDate(formattedStartDate);
//      setToDate(formattedEndDate);
//     handleFilterSubmit(data);
// }
    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const formattedStartDate = dayjs(data.SelectedDate[0]).format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndDate = dayjs(data.SelectedDate[1]).format('YYYY-MM-DDTHH:mm:ss');
            const transformed = {
                UserID: isAdmin ? 0 : userdetails.id,
                CompanyID: data?.MarketerName || 0,
                AccountNumber: data?.AccountNumber || "",
                StartDate: formattedStartDate,
                EndDate: formattedEndDate
              }

            console.log(transformed);
            setFromDate(transformed?.StartDate);
            setToDate(transformed.EndDate);
            handleFilterSubmit({});
            const result = await dispatch(marketerReportAction.getCustomerUsageDetails(transformed));
            const reportData = result?.payload?.Data;
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
           
            handleFilterSubmit(reportData);
            // resetValues();
            onClose();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Fetch Failed" }));
        }
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
            MarketerName: '',
            ServiceProvider: '',
            StartDate: null,
            IsActive: null
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
                        <CustomTextFieldInput
                            control={control}
                            name="AccountNumber"
                            label="Account Number"
                            type="number" // Ensure only numbers are accepted
                            rules={{ valueAsNumber: true }} // Enforce number type
                        />
                        {/* <Typography component="div" className="marbottom0 selecticon">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="StartMonth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        className='SelectedDate '
                                        {...field}
                                        label="Select Month"
                                        views={['year', 'month']}
                                        maxDate={dayjs()} // Current date
                                        minDate={null} // Allows any past date
                                        slotProps={{
                                            textField: (params) => <TextField {...params} />
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        </Typography> */}
                        <Typography className='marbottom0 selecticon'>
                        <CustomStaticDateRangePicker1
                                id="SelectedDate"
                                control={control}
                                trigger={trigger}
                                name="SelectedDate"
                                label="From - To"
                                // handleBlur={handleBlur}
                                minDate={dayjs().subtract(12, 'month')}
                                maxDate={dayjs().add(12, 'month')}
                                maxDays={31}
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
                            <Button variant="contained" color="red" className="cancelbutton" 
                            onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Popper>
        </>
    );
}

export default CustomerUsageFilter;