import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forecastReportActions } from '_store/foreCastReport.slice';
import ForecastReportList from './foreCastReportList';
import { Typography } from '@mui/material';
import { Grid } from '@material-ui/core';
import ForeCastReportFilter from './foreCastReportFilter';
import FCReportDownload from './fcReportDownload';
import dayjs from 'dayjs';
import ForeCastReportDetail from './foreCastReportDetail';
import foreCastReportData from 'assets/files/ReportData.json';
const ForeCastReports = () => {
    const dispatch = useDispatch();

    const forecastData = useSelector((state) => state.forecastReportReducer.forecastData);
    const error = useSelector((state) => state.forecastReportReducer.error);
    const loading = forecastData?.loading;

    const [requirementForecastData, setRequirementForecastData] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeMarketer, setActiveMarketer] = useState({});
    const [markterName, setMarkterName] = useState(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [markterList, setMarkterList] = useState([]);
    const [subtotal, setSubtotal] = useState([]);
    const tableRef = useRef(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    useEffect(() => {
        const fetchInitialReport = async () => {
            const initialRequest = {
                Data: {
                    UserID: 0,
                    CompanyID: 0,
                    StartDate: new Date().toISOString()
                }
            };

            const result = await dispatch(forecastReportActions.getForecastReport(initialRequest));
            const marketers = result?.payload?.Data?.MarketerDetails || [];
            setMarkterList(marketers);
            const firstActive = marketers[1];

            if (firstActive?.MarketerID) {
                setActiveMarketer(firstActive);

                const updatedRequest = {
                    Data: {
                        UserID: 0,
                        CompanyID: firstActive?.MarketerID,
                        StartDate: new Date().toISOString()
                    }
                };

                const response = await dispatch(forecastReportActions.getForecastReport(updatedRequest));
                if (!response || !response?.payload?.Data?.RequirementForecastData.length) {
                    setRequirementForecastData(foreCastReportData.FiveDaysForeCastReportData.RequirementForecastData || []);
                    setMarkterName(foreCastReportData.FiveDaysForeCastReportData.RequirementForecastData[0]?.MarketerName);
                    setSubtotal(foreCastReportData.FiveDaysForeCastReportData.SubTotalData);
                } else {
                    setMarkterName(response?.payload?.Data?.RequirementForecastData[0]?.MarketerName);
                    setSubtotal(response?.payload?.Data?.SubTotalData);
                }
            }

            setInitialLoadDone(true);
        };

        fetchInitialReport();
    }, [dispatch]);

    useEffect(() => {
        if (forecastData && !loading && !error && initialLoadDone) {
            setRequirementForecastData(forecastData.RequirementForecastData || []);
        }
    }, [forecastData, loading, error, initialLoadDone]);

    const handleFilterSubmit = async (filter) => {
        if (filter) {
            const params = {
                Data: {
                    UserID: filter.UserID,
                    CompanyID: filter.CompanyID,
                    StartDate: filter.StartDate
                }
            };

            const result = await dispatch(forecastReportActions.getForecastReport(params));
            const reportData = result?.payload?.Data?.RequirementForecastData || [];

            setRequirementForecastData(reportData);
            setMarkterName(result?.payload?.Data?.RequirementForecastData[0]?.MarketerName);
            setSubtotal(result?.payload?.Data?.SubTotalData);
        }
    };

    const handleOpen = () => setFilterOpen(true);
    const handleClose = () => setFilterOpen(false);

    const fromDate = requirementForecastData.length > 0
        ? dayjs(requirementForecastData[0].ShipmentDate).format('MM/DD/YYYY')
        : '';

    const toDate = requirementForecastData.length > 0
        ? dayjs(requirementForecastData[0].ShipmentDate).add(5, 'days').format('MM/DD/YYYY')
        : '';

    const datePublished = dayjs().format('MM/DD/YYYY');

    return (
        <>
            <Typography component="div" className='userprofilelist'>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} md={4} style={{ paddingTop: '10px' }}>
                                <div variant="h2" className='userprofilelistcontent'>
                                    <div>
                                        Reports <span className="fcreport-line">5 Days Requirement Forecast Report</span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement" style={{ paddingTop: '10px' }}>
                                    <Grid item xs={12} md={8}>
                                        <Grid container spacing={2} justifyContent="flex-end">
                                            <Grid item xs={6} md={5}>
                                                <ForeCastReportFilter
                                                    data={markterList}
                                                    activeMarketer={activeMarketer}
                                                    handleFilterSubmit={handleFilterSubmit}
                                                    isOpen={filterOpen}
                                                    onOpen={handleOpen}
                                                    onClose={handleClose}
                                                    isAdmin={true}
                                                    userdetails={{ id: 1 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={5}>
                                                <FCReportDownload
                                                    data={requirementForecastData}
                                                    subtotal={subtotal}
                                                    tableRef={tableRef}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Typography>

            <Grid >
                <Grid>
                    <ForeCastReportDetail fcReportName="5 Days Requirement Forecast Report" MarkterName={markterName} fromDate={fromDate} toDate={toDate} publishDate={datePublished} />
                    <div className={backdropOpen ? "backdrop" : ""}></div>
                    <div className="MarketerListMaterialReactTable">
                        <ForecastReportList forecastData={requirementForecastData} subtotal={subtotal} ref={tableRef} /></div>
                </Grid>
            </Grid>
        </>
    );
};

export default ForeCastReports;
