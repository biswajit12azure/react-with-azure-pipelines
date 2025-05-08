import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
import { alertActions, interruptibleAction } from '_store';
import InterruptibleList from './InterruptibleList';
import { getByInterruptible } from '_utils/constant';
import InterruptibleFilter from './InterruptibleFilter';
import InterruptibleDownload from './InterruptibleDownload';

const Interruptible = () => {
    const header = "Adjustment By Interruptible";
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [openComponent, setOpenComponent] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [marketerId, setMarketerId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const interruptibleData = useSelector(x => x.interruptible?.interruptibleList);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const startMonth = dayjs(selectedDate).isValid() ? dayjs(selectedDate) : null;
                const startDate = startMonth ? dayjs(startMonth.startOf('month')) : null;
                const fecthRequest = {
                    CompanyID: null,
                    StartDate: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'),
                    EndDate: null,
                    IsFirm: false
                };
                const result = await dispatch(interruptibleAction.get(fecthRequest)).unwrap();
                const firmData = result?.Data;
                console.log()
                const date = firmData[0]?.EffectiveDate || new Date();
                setSelectedDate(dayjs(date));
                setData(firmData);
            } catch (error) {
                console.error('Fetch Error:', error); // Log any errors
                // dispatch(alertActions.error({
                //     message: error?.message || error,
                //     header: `${header} Failed`
                // }));
            }
        };
        fetchData();
    }, [dispatch, setData]);

    const convertToNumber = (value) => {
        return parseInt(value.toString().replace(/,/g, ''), 10);
    };

    const handleSubmit = async () => {
        dispatch(alertActions.clear());
        try {
            const transformedData = data?.InterruptibleData?.filter(item => item.isEditing)
                .map(item => ({
                    AllocationGroupID: item.AllocationGroupID,
                    CompanyID: item.CompanyID,
                    GroupAdjustmentDate: item.EffectiveDate,
                    EndDate: item.EndDate,
                    IsFirm: false,
                    ImbalanceAdjustedVolume: convertToNumber(item.ImbalanceAdjustedVolume || 0),
                    Comments: "",
                    Value: convertToNumber(item.MonthEndImbalanceInterruptible || 0).toString() || "",
                    EffectiveDate: item.EffectiveDate,
                    PreviousBalanceInterruptible: convertToNumber(item.PreviousBalanceInterruptible || 0),
                    TotalNominationAllocations: convertToNumber(item.TotalNominationAllocations || 0),
                    TotalUsage: convertToNumber(item.TotalUsage || 0)
                }));

            let result;
            if (transformedData.length > 0) {
                result = await dispatch(interruptibleAction.update(transformedData));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            handleRefresh();
            dispatch(alertActions.success({ message: "Interruptible Adjustment updated successfully", header: header, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    };

    const handleChange = (group, value) => {
        setData((prev) => ({
            ...prev,
            InterruptibleData: prev.InterruptibleData.map((item) =>
                item.AllocationGroupID === group.AllocationGroupID
                    ? { ...item, ImbalanceAdjustedVolume: value, isEditing: true }
                    : item
            ),
        }));
    };

    const handleOpenComponent = (component) => {
        setOpenComponent(prev => prev === component ? null : component);
        setBackdropOpen(prev => prev === component ? false : true); // Toggle backdrop
    };

    const handleFilterSubmit = async (newData) => {
        const date = newData[0]?.EffectiveDate;
        // setSelectedDate(date);
        setData(newData);
    };

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
        setOpenComponent(null);
    };

    const handleRefresh = async () => {
        dispatch(alertActions.clear());
        try {
            const startMonth = dayjs(selectedDate).isValid() ? dayjs(selectedDate) : null;
            const startDate = startMonth ? startMonth.startOf('month') : null;

            const fetchRequest = {
                CompanyID: marketerId || null,
                StartDate: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'),
                EndDate: null,
                IsFirm: false
            };
            const result = await dispatch(interruptibleAction.get(fetchRequest)).unwrap();
            const firmData = result?.Data;
            const date = firmData[0]?.EffectiveDate;
            // setSelectedDate(date);
            setData(firmData);
        }
        catch (error) {
            console.log(error);
            // dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    }

    const handleCancelClick = async () => {
        handleRefresh();
    };

    const isSaveButtonEnabled = data.InterruptibleData?.some(item => item.isEditing);

    return (
        <Box className="Adjustmentsbyfiram Adjustmentsbyfiram-coantainer">
            <Typography component="div" className='userprofilelist '>
                <Grid container direction="row" spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                        <Typography variant="h2" className='userprofilelistcontent'>interruptible <span>Adjustment Activity</span></Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                        <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                            <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                        <InterruptibleFilter
                                            handleFilterSubmit={handleFilterSubmit}
                                            marketerId={marketerId}
                                            setMarketerId={setMarketerId}
                                            marketerData={data?.Marketers}
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                            isOpen={openComponent === 'filter'}
                                            onClose={handleCloseBackdrop}
                                            onOpen={() => handleOpenComponent('filter')}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                                        <InterruptibleDownload data={data} selectedDate={selectedDate} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <div className={backdropOpen ? 'backdrop' : ''}>
                    </div>
                    <Box className="byfiramcontioner">
                        <Typography
                            variant="h4">
                            {dayjs(selectedDate).format('MMMM YYYY')}
                        </Typography>
                        <InterruptibleList data={data} handleChange={handleChange} />
                    </Box>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
                <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className='submitbutton'
                    onClick={handleSubmit}
                    disabled={!isSaveButtonEnabled}>
                    Save
                </Button>
            </Grid>
        </Box>
    );
}

export default Interruptible;