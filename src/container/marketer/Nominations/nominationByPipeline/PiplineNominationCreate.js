import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Button, Box, TextField, Popper, ClickAwayListener } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertActions, nominationpipelineAction } from '_store';
import { CustomFormControl, AutocompleteInput ,CustomFormControlNum} from '_components';
import dayjs from 'dayjs';
import { createPipelineNomination } from '_utils/validationSchema';

const PipelineNominationCreate = ({ pipelineData, marketerId, fromDate, isOpen, onClose, onOpen, handleRefresh }) => {
    const header = "Contract";
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const pipelineList = pipelineData?.map(x => ({
        label: x.Name,
        value: x.PipelineID
    })) || [];

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
        resolver: yupResolver(createPipelineNomination),
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const dateAdded = dayjs(fromDate).isValid() ? dayjs(fromDate) : dayjs(new Date());

            const transformedData = {
                MarketerID: marketerId || 0,
                PipelineID: data.PipelineID,
                ContractID: data.ContractID.toString(),
                DateAdded: dayjs(dateAdded).format('YYYY-MM-DDTHH:mm:ss')
            };

            const result = await dispatch(nominationpipelineAction.insert(transformedData)).unwrap();
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: "Fetch Failed" }));
                return;
            }
            handleClear();
            handleRefresh();
            dispatch(alertActions.success({ message: result?.Message, header: header, showAfterRedirect: true }));

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

    const handleClear = () => {
        reset();
        onClose();
    }

    const handleClickAway = () => {
        handleClear();
    };

    return (
        <>
            <Button
                variant="contained"
                className='Download'
                color="primary" aria-describedby={id} onClick={handleClick}
            ><AddCircleOutline />  Contract
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className="Filtercontainer marketerGroup Border ">
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} className="Filtercontainerinner">
                        <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                            {/* <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Typography variant="h2" className='userprofilelistcontent'> Create Marketer Group</Typography>
                                </Grid>
                            </Grid>
                        </Typography>                                                 */}
                            <Typography component="div" className='marbottom0 selecticon marginbottom16'>
                                <AutocompleteInput
                                    control={control}
                                    name="PipelineID"
                                    label="Select Pipeline"
                                    options={pipelineList}
                                    error={!!errors.PipelineID}
                                    helperText={errors.PipelineID?.message}
                                    handleBlur={handleBlur}
                                    trigger={trigger}
                                />
                            </Typography>
                            {/* <CustomFormControl
                                id="ContractID"
                                label="Contract#"
                                type="number"
                                register={register}
                                errors={errors}
                                handleBlur={handleBlur}
                            /> */}
                        <CustomFormControlNum
                            id="ContractID"
                            label="Contract#"
                            type="text"
                            register={register}
                            errors={errors}
                            handleBlur={handleBlur}
                            maxLength={9}
                            onlyNumbers={false}
                        />
                            <Box component="div" className="CreateMarketerbutton"   >
                                <Button type="submit"
                                    variant="contained"
                                    className='submitbutton'
                                    color="primary"
                                    disabled={!isValid}>
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

export default PipelineNominationCreate;