import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { CustomTextFieldInput, AutocompleteInput, CustomDatePicker, CustomStaticDateRangePicker } from '_components';
import { alertActions } from '_store';
import { Typography, Button, Box, ClickAwayListener } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import FilterListIcon from '@mui/icons-material/FilterList';
import { marketerAction } from '_store/marketer.slice';

const FileHubFilter = ({ handleFilterSubmit, isOpen, onClose, onOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isStandardUser, setIsStandardUser] = useState(false);
    const authUser = useSelector(x => x.auth?.value);
    const user = authUser?.Data;

    useEffect(() => {
        const userAccess = user?.UserAccess;
        const isStandardUser = userAccess?.some(access => access.Role === "Standard User");

        if (isStandardUser) {
            setIsStandardUser(true);
        }
    }, []);

    const statusData = [
        { value: 101, label: 'Uploaded' },
        { value: 102, label: 'Processed' },
        { value: 103, label: 'Ready to download' },
        { value: 104, label: 'Downloaded' }
    ];
    const { handleSubmit, control, watch, reset, trigger, formState: { errors } } = useForm({
        defaultValues: {
            MarketerName: '',
            FileType: '',
            FileSubType:'',
            SelectedDate: '',
            IsActive: null
        }
    });

    const watchedValues = watch();

    useEffect(() => {
        const hasValue = Object.values(watchedValues).some(value => value !== '' && value !== null);
        setIsFormValid(hasValue);
    }, [watchedValues]);

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            data = {
                ...data,
                MarketerName: null,
                FileType: null,
                FileSubType:null,
                SelectedDate: '',
                IsActive:null
            };
            const result = await dispatch(marketerAction.filter(data)).unwrap();
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
            FileType: '',
            FileSubType:'',
            SelectedDate: '',
            IsActive: null
        });
    };

    const handleClickAway = () => {
        resetValues();
        onClose();
    };

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
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
                                    <Typography variant="h2" className='userprofilelistcontent'>Marketer</Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                        <CustomTextFieldInput
                            control={control}
                            name="FileName"
                            label="File Name"
                        />
                        {!isStandardUser && <CustomTextFieldInput
                            control={control}
                            name="MarketerName"
                            label="Marketer Name"
                        />}
                        <CustomTextFieldInput
                            control={control}
                            name="FileType"
                            label="FileType"
                        />
                        <CustomTextFieldInput
                            control={control}
                            name="FileSubType"
                            label="FileSubType"
                        />

                        <Typography component="div" className="SelectedDate">
                            <CustomStaticDateRangePicker
                                id="SelectedDate"
                                control={control}
                                trigger={trigger}
                                name="SelectedDate"
                                label="From - To"
                                handleBlur={handleBlur}
                                placeholder="select DateRange"
                            />
                        </Typography>
                        <Typography className='marbottom0 selecticon'>
                            <AutocompleteInput
                                control={control}
                                name="IsActive"
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

export default FileHubFilter;