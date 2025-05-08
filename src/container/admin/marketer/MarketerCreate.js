import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { alertActions } from '_store';
import { Typography, Button, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Popper from '@mui/material/Popper';
import Grid from "@material-ui/core/Grid";
import { CustomFormControl, CustomDatePicker, CustomNumberField } from '_components';
import dayjs from 'dayjs';
import { createMarketerSchema } from '_utils/validationSchema';
import { AddCircleOutline } from '@mui/icons-material';
import { marketerAction } from '_store/marketer.slice';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const MarketerCreate = ({ marketers, uetFileData, isOpen, onClose, onOpen, handleRefresh }) => {
    const header = "Marketer";
    const dispatch = useDispatch();
    dayjs.extend(utc);
    dayjs.extend(customParseFormat);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const today = dayjs();
    const threeMonthsLater = today.add(3, 'month');

    const minDate = today;
    const maxDate = threeMonthsLater;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        isOpen ? onClose() : onOpen();
    };

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const { register, handleSubmit, control, reset, formState: { errors, isValid }, trigger } = useForm({
        resolver: yupResolver(createMarketerSchema),
        mode: 'onBlur'
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        const id = parseInt(name, 10);
        setSelectedFiles(prev =>
            checked ? [...prev, id] : prev.filter(type => type !== id)
        );
    };

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const duplicateNames = marketers?.Marketers
                .filter(oldItem => oldItem.MarketerName === data.MarketerName && oldItem.MarketerID !== data.MarketerID)
                .map(item => item.MarketerName);

            if (duplicateNames.length > 0) {
                dispatch(alertActions.error({ message: `Marketer name already exists`, header }));
                return;
            }

            const uetFileID = selectedFiles.join(',');
            const formattedDate = dayjs(data.StartDate).add(1, 'day').utc().format('YYYY-MM-DDTHH:mm:ss');

            const transformedData = {
                MarketerID: 0,
                MarketerName: data.MarketerName,
                MarketerDescription: data.MarketerName,
                StartDate: formattedDate,
                ServiceProvider: data.ServiceProvider,
                UETFileID: uetFileID
            };

            const result = await dispatch(marketerAction.insert(transformedData)).unwrap();

            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header }));
                return;
            }

            // ✅ Reset form and checkbox state
            reset({
                MarketerName: '',
                ServiceProvider: '',
                StartDate: null
            });
            setSelectedFiles([]);
            onClose();

            dispatch(alertActions.success({
                message: "Marketer Created Successfully.",
                header,
                showAfterRedirect: true
            }));

            handleRefresh();
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header }));
        }
    };

    const handleBlur = async (e) => {
        await trigger(e.target.name);
    };

    const handleCancelClick = () => {
        reset();
        setSelectedFiles([]);
        onClose();
    };

    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary"
                aria-describedby={id}
                onClick={handleClick}
            >
                <AddCircleOutline /> Marketer
            </Button>

            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer">
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner CreateMarketerhight Border">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Create Marketer</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <CustomFormControl
                            id="MarketerName"
                            label="Marketer Name"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                            maxLength={50}
                        />

                        <CustomNumberField
                            id="ServiceProvider"
                            label="Service Provider #"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                            maxLength={50}
                            dynamicMessage=""
                        />

                        <Typography component="div" className="SelectedDate">
                            <CustomDatePicker
                                id="StartDate"
                                control={control}
                                name="StartDate"
                                label="Start Date"
                                error={!!errors.StartDate}
                                helperText={errors.StartDate?.message}
                                handleBlur={handleBlur}
                                trigger={trigger}
                                minDate={minDate}
                                maxDate={maxDate}
                            />
                        </Typography>

                        <FormGroup className='CreateMarketer'>
                            <Typography component="div" className='userprofilelist'>
                                <Typography variant="h2" className='userprofilelistcontent'>Permitted UET File Types</Typography>
                            </Typography>
                            <Typography component="div" className='CreateMarketercheckbox'>
                                {uetFileData?.map(file => (
                                    <FormControlLabel
                                        key={file.UETFileID}
                                        control={
                                            <Checkbox
                                                checked={selectedFiles.includes(file.UETFileID)}
                                                onChange={handleCheckboxChange}
                                                name={file.UETFileID.toString()}
                                            />
                                        }
                                        label={file.UETFileName}
                                    />
                                ))}
                            </Typography>
                        </FormGroup>

                        <Typography component="div" className="CreateMarketerbutton">
                            <Button
                                type="submit"
                                variant="contained"
                                className='submitbutton'
                                color="primary"
                                disabled={!isValid}
                            >
                                Create
                            </Button>
                            <Button
                                variant="contained"
                                color="red"
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

export default MarketerCreate;
