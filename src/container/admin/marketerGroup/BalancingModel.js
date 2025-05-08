import React, { useState, useEffect } from "react";
import { FormControl, Select, OutlinedInput, MenuItem, Modal, Box, Button, TextField, Typography } from '@mui/material';
import { Grid } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { marketergroupAction, alertActions } from "_store";
import { useDispatch } from "react-redux";

const BalancingModel = ({ marketerGroupID, label, value, onChange, options, disabled }) => {
    const header = "Marketer Group";
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [startMonth, setStartMonth] = useState(dayjs().add(1, 'month'));
    const [endMonth, setEndMonth] = useState(null);
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        dispatch(alertActions.clear());
        try {
            const startM = dayjs(startMonth).isValid() ? dayjs(startMonth).toISOString() : null;
            const endM = dayjs(endMonth).isValid() ? dayjs(endMonth).toISOString() : null;
            const transformedData = {
                MarketerGroupID: marketerGroupID,
                BalancingModelID: selectedValue,
                StartMonth: startM,
                EndMonth: endM
            };
            const result = await dispatch(marketergroupAction.updateBalancingModel(transformedData)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Upadte Failed" }));
                return;
            }
            dispatch(alertActions.success({ message: "Balancing Model Updated Successfully.", header: header, showAfterRedirect: true }));
            handleClose();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: "Update Failed" }));
        }
    };

    const handleCancel = () => {
        setStartMonth(dayjs().add(1, 'month'));
        setEndMonth(null);
        handleClose();
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        setStartMonth(dayjs().add(1, 'month'));
        setEndMonth(null);
        onChange(newValue);
        if (newValue) {
            handleOpen();
        }
    };

    return (
        <>
            <FormControl sx={{ width: 200 }}>
                <Select
                    displayEmpty
                    disabled={disabled || undefined}
                    value={selectedValue || ''}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (!selected) {
                            return <em>{label}</em>;
                        }
                        const selectedOption = options.find((item) => item.value === selected);
                        return selectedOption ? selectedOption.label : 'Select an option';
                    }}
                >
                    <MenuItem value="">
                        <em>{label}</em>
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Modal open={open} >
                <Box className="Filtercontainer marketerGroup Border userInformationcontainer  Registrationcontainer" sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '300px' }} >
                    <Typography component="div" className='userprofilelist'>
                        <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography variant="h2" className='userprofilelistcontent'>Balancing Model</Typography>
                            </Grid>
                        </Grid>
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                         className='SelectedDate '
                            label="Start Month"
                            views={['year', 'month']}
                            minDate={dayjs().add(1, 'month')}
                            maxDate={dayjs().add(3, 'month')}
                            value={startMonth}
                            onChange={(newValue) => setStartMonth(newValue)}
                            slotProps={{
                                textField: (params) => <TextField {...params} />
                            }}
                        />
                        <DatePicker
                         className='SelectedDate '
                            label="End Month"
                            views={['year', 'month']}
                            minDate={startMonth}
                            maxDate={startMonth ? startMonth.add(4, 'month') : dayjs().add(4, 'month')}
                            value={endMonth}
                            onChange={(newValue) => setEndMonth(newValue)}
                            slotProps={{
                                textField: (params) => <TextField {...params} />
                            }}
                        />
                    </LocalizationProvider>
                    <Typography className="BalancingModel">
                    <Box className="CreateMarketerbutton" spacing={{ xs: 2, md: 3 }} >


                        <Button
                            variant="contained"
                            className='cancelbutton'
                            color="primary"
                            onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit"
                            variant="contained"
                            className='submitbutton'
                            color="primary"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                    </Typography>
                  
                </Box>
            </Modal>
        </>
    );
};

export default BalancingModel;
