import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { raphaelinfo,Delete } from 'images';
import FirmFilter from './FirmFilter';
import FirmUpload from './FirmUpload';
import { firmSupportedFormat, getByFirm } from '_utils/constant';
import FirmList from './FirmList';
import FirmDownload from './FirmDownload';
import dayjs from 'dayjs';
import { alertActions, firmAction } from '_store';

const Firm = () => {
    const header = "Adjustment By Firm";
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [openComponent, setOpenComponent] = useState(null);
    //const [uploadedFiles, setuploadedFiles] = useState([]);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [isSaveButtonEnabled,setIsSaveButtonEnabled]=useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const firmData = useSelector(x => x.firm?.firmList);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(alertActions.clear());
            try {
                const startMonth = dayjs(selectedDate).isValid() ? dayjs(selectedDate) : null;
                const startDate = startMonth ? startMonth.startOf('month') : null;
                const endDate = startMonth ? startMonth.endOf('month') : null;
                const fecthRequest = {
                    CompanyID: null,
                    StartDate: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'),
                    EndDate: null,
                    IsFirm: true
                };
                const result = await dispatch(firmAction.get(fecthRequest)).unwrap();
                const firmData = result?.Data;
                const date = firmData[0]?.EffectiveDate || new Date();
                setSelectedDate(dayjs(startDate));
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

    useEffect(() => {
        setIsSaveButtonEnabled(data.length > 0);
    }, [isSaveButtonEnabled]);

    const convertToNumber = (value) => {
        return parseInt(value.replace(/,/g, ''), 10);
    };

    const handleSubmit = async () => {
        dispatch(alertActions.clear());
        try {
            const transformedData = data?.filter(item => item.isEditing)
                .map(item => ({
                    AllocationGroupAdjustmentID: item.AllocationGroupAdjustmentID,
                    CompanyID: 0,
                    GroupAdjustmentDate: new Date(),
                    IsFirm: true,
                    ImbalanceAdjustedVolume: convertToNumber(item.ImbalanceAdjustedVolume) || 0
                }));

            let result;
            if (transformedData.length > 0) {
                result = await dispatch(firmAction.update(transformedData));
                setIsSaveButtonEnabled(false);
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                setIsSaveButtonEnabled(false);
                return;
            }            
            handleRefresh();
            dispatch(alertActions.success({ message: "Firm Adjustment updated successfully", header: header, showAfterRedirect: true }));

        } catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    };

    const handleChange = (row, value) => {
        setData((prev) =>
            prev.map((item) =>
                item.AllocationGroupID === row.original.AllocationGroupID ? { ...item, ImbalanceAdjustedVolume: value, isEditing: true } : item
            )
        );
    }

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
            const endDate = startMonth ? startMonth.endOf('month') : null;
            const fetchRequest = {
                CompanyID: null,
                StartDate: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'),
                EndDate: null,
                IsFirm: true
            };
            const result = await dispatch(firmAction.get(fetchRequest)).unwrap();
            const firmData = result?.Data;
            const date = firmData[0]?.EffectiveDate;
            //  setSelectedDate(date);
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

    const handleRemoveFile = (fileName) => {
        setData(prevFiles => prevFiles.filter(file => file.FileName !== fileName));
       // setIsDataChanged(true);
    };

    //const isSaveButtonEnabled = data?.some(item => item.isEditing);

    return (
        <Box className="Adjustmentsbyfiram">
            <Typography component="div" className='userprofilelist '>
                <Grid container direction="row" spacing={2}>
                    <Grid size={{ xs: 12, sm: 4, md: 8 }}>
                        <Grid container>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <Typography variant="h2" className='userprofilelistcontent'>Firm <span>Adjustment Activity</span></Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                                        <Grid container spacing={2} justifyContent="flex-end">
                                            <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                                                <FirmFilter
                                                    handleFilterSubmit={handleFilterSubmit}
                                                    selectedDate={selectedDate}
                                                    setSelectedDate={setSelectedDate}
                                                    isOpen={openComponent === 'filter'}
                                                    onClose={handleCloseBackdrop}
                                                    onOpen={() => handleOpenComponent('filter')}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                                                <FirmDownload data={data} selectedDate={selectedDate}></FirmDownload>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                    </Grid>
                </Grid>
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <div className={backdropOpen ? 'backdrop' : ''}>
                    </div>
                    <Box className="byfiramcontioner">
                        <Typography
                            variant="h4">
                            {dayjs(selectedDate).format('MMMM YYYY')}
                        </Typography>
                        <FirmList data={data} handleChange={handleChange} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Typography component="div" className="UploadFiles-container mapcontainer  ">
                        <Typography component="div" className="Personal-Informationsheading ">
                            <Typography component="h2" variant="h5">Document Upload  <img src={raphaelinfo} alt='raphaelinfo'></img></Typography>
                        </Typography>
                        <Typography component="div" className="passwordcheck marbottom0 selecticon">
                            <FirmUpload supportedFormats={firmSupportedFormat} data={data} setData={setData} setSelectedDate={setSelectedDate} setIsSaveButtonEnabled={setIsSaveButtonEnabled} />
                        </Typography>
                    </Typography>
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

export default Firm;