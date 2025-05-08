import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Popper from '@mui/material/Popper';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Box, Typography } from '@mui/material';
import { alertActions, nominationgroupAction } from '_store';
import { AutocompleteInput, CustomStaticDateRangePicker1 } from '_components';
import dayjs from 'dayjs';
import Grid from "@mui/material/Grid2";
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const GroupNominationFilter = ({
    marketerData,
    marketerGroupData,
    pipelineData,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    handleFilterSubmit,
    marketerId,
    marketerGroupId,
    setMarketerGroupId,
    pipelineID,
    setPipelineID,
    setMarketerId,
    isOpen,
    onClose,
    onOpen,
    isAdmin
}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    // MOVE BEFORE useForm
    const marketerList = marketerData?.map(x => ({
        label: x.MarketerName,
        value: x.MarketerID
    }))
        ?.filter(x => x.label.trim() !== '')
        ?.sort((a, b) => a.label.localeCompare(b.label)) || [];

    const marketerGroupList = marketerGroupData?.map(x => ({
        label: x.GroupName,
        value: x.GroupID
    }))
        ?.filter(x => x.label.trim() !== '')
        ?.sort((a, b) => a.label.localeCompare(b.label)) || [];

    const pipelineList = pipelineData?.map(x => ({
        label: x.Name,
        value: x.PipelineID
    })) || [];

    const {
        handleSubmit,
        control,
        watch,
        reset,
        trigger,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            marketerId: marketerList?.[0]?.value || '',
            marketerGroupId: marketerGroupList?.[0]?.value || '',
            SelectedDate: [dayjs(fromDate), dayjs(toDate)]
        }
    });

    useEffect(() => {
        if (fromDate && toDate) {
            setValue('SelectedDate', [dayjs(fromDate), dayjs(toDate)]);
        }
    }, [fromDate, toDate, setValue]);

    // useEffect(() => {
    //     if (marketerList.length > 0) {
    //         setValue('marketerId', marketerList[0].value);
    //     }
    // }, [marketerList, setValue]);

    // useEffect(() => {
    //     if (marketerGroupList.length > 0) {
    //         setValue('marketerGroupId', marketerGroupList[0].value);
    //     }
    // }, [marketerGroupList, setValue]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            handleCancelClick();
        } else {
            onOpen();
        }
    };

    const canBeOpen = isOpen && Boolean(anchorEl);
    const id = canBeOpen ? 'simple-popper' : undefined;

    const handleBlur = async (e) => {
        const fieldName = e.target.name;
        await trigger(fieldName);
    };

    const resetValues = () => {
        reset({
            marketerId: marketerList?.[0]?.value || '',
            marketerGroupId: marketerGroupList?.[0]?.value || '',
            SelectedDate: [dayjs(fromDate), dayjs(toDate)]
        });
    };

    const onSubmit = async (data) => {
        dispatch(alertActions.clear());
        try {
            const formattedStartDate = dayjs(data.SelectedDate[0]).startOf('day');
            const formattedEndDate = dayjs(data.SelectedDate[1]).endOf('day');

            const transformData = {
                CompanyID: data.marketerId,
                GroupID: data.marketerGroupId,
                PipelineID:0,
                StartDate: dayjs(formattedStartDate).format('YYYY-MM-DDTHH:mm:ss'),
                EndDate: dayjs(formattedEndDate).format('YYYY-MM-DDTHH:mm:ss')
            };

            // {
            //     "CompanyID": 0,
            //     "GroupID": 0,
            //     "PipelineID": 0,
            //     "StartDate": "2025-05-06T11:03:46.965Z",
            //     "EndDate": "2025-05-06T11:03:46.965Z"
            //   }
            setFromDate(formattedStartDate);
            setToDate(formattedEndDate);
            // setFromDate(transformData.FromDate);
          //  setToDate(transformData.ToDate);
            handleFilterSubmit({});

            const result = await dispatch(nominationgroupAction.filter(transformData)).unwrap();

            if (result?.error) {
                dispatch(alertActions.error({
                    message: result?.payload || result?.error.message,
                    header: "Fetch Failed"
                }));
                return;
            }

            setMarketerId(data.marketerId);
            setMarketerGroupId(data.marketerGroupId);
            handleFilterSubmit(result?.Data);
            onClose();
        } catch (error) {
            dispatch(alertActions.error({
                message: error?.message || error,
                header: "Fetch Failed"
            }));
        }
    };

    const handleCancelClick = () => {
        resetValues();
        onClose();
    };

    return (
        <>
            <Button className='Filter' type="button" variant='contained' color="primary" aria-describedby={id} onClick={handleClick}>
                <FilterListIcon /> Filter
            </Button>
            <Popper id={id} open={canBeOpen} anchorEl={anchorEl} className='Filtercontainer Border '>
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.poper' }} className="Filtercontainerinner">
                    <form onSubmit={handleSubmit(onSubmit)} className='Registrationcontainer marketerFiltercontainer'>
                        <Typography component="div" className='userprofilelist'>
                            <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Grid item xs={12}>
                                    <Typography variant="h2" className='userprofilelistcontent'>Nomination By Group</Typography>
                                </Grid>
                            </Grid>
                        </Typography>

                        <Typography component="div" className='passwordcheck SelectedDate border-none selecticon'>
                            <CustomStaticDateRangePicker1
                                id="SelectedDate"
                                control={control}
                                trigger={trigger}
                                name="SelectedDate"
                                label="From - To"
                                handleBlur={handleBlur}
                                minDate={dayjs().subtract(12, 'month')}
                                maxDate={dayjs().add(12, 'month')}
                                maxDays={31}
                            />
                        </Typography>

                        {isAdmin && (
                            <Typography component="div" className='marbottom0 selecticon '>
                                <AutocompleteInput
                                    control={control}
                                    name="marketerId"
                                    label="Marketer"
                                    options={marketerList}
                                    handleBlur={handleBlur}
                                    trigger={trigger}
                                />
                            </Typography>
                        )}

                        <Typography component="div" className='marbottom0 selecticon '>
                            <AutocompleteInput
                                control={control}
                                name="marketerGroupId"
                                label="Select Group"
                                options={marketerGroupList}
                                handleBlur={handleBlur}
                                trigger={trigger}
                            />
                        </Typography>

                        <Box className="CreateMarketerbutton" spacing={{ xs: 2, md: 3 }}>
                            <Button type="submit" variant="contained" className='submitbutton' color="primary">
                                Search
                            </Button>
                            <Button variant="contained" className='cancelbutton' color="primary" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Popper>
        </>
    );
};

export default GroupNominationFilter;
