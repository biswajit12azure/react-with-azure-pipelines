import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supplierActiveCustomerReportActions } from '_store/supplierActiveCustomer.slice';
import { Typography } from '@mui/material';
import { Grid } from '@material-ui/core';
import dayjs from 'dayjs';
import SupplierActiveCustomerFilter from './supplierActiveCustomerFilter';
import { forecastReportActions } from '_store';
import SupplierActiveCustomerList from './supplierActiveCustomerList';
import SupplierActiveCustomerDownload from './supplierActiveCustomerDownload';
import ForeCastReportDetail from '../foreCastReport/foreCastReportDetail';
import supplierActiveCustomerData from 'assets/files/ReportData.json';

const SupplierActiveCustomerReport = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState();
    const [activeMarkter, setActiveMarkter] = useState({});
    const [markterList, setMarkterList] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [monthYear, setMonthYear] = useState(null);
    const tableRef = useRef(null);
    const supplierState = useSelector(state => state.supplierActiveCustomerReport || {});
    const { supplierCustomerData } = supplierState;
    const [backdropOpen, setBackdropOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const initialRequest = {
                Data: {
                    UserID: 0,
                    CompanyID: 0,
                    StartDate: new Date().toISOString()
                }
            };

            try {
                const result = await dispatch(forecastReportActions.getForecastReport(initialRequest));
                const marketerData = result?.payload?.Data?.MarketerDetails || [];
                setMarkterList(marketerData);
                if (marketerData.length > 0) {
                    setActiveMarkter(marketerData[0]);
                }
            } catch (error) {
                console.error('Failed to fetch forecast report:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchSupplierData = async () => {
            if (activeMarkter?.MarketerID) {
                const requestData = {
                    CompanyID: activeMarkter?.MarketerID,
                    StartDate: new Date().toISOString()
                };
                const supplierDataRes = await dispatch(
                    supplierActiveCustomerReportActions.getSupplierActiveCustomerReport(requestData)
                );
                const responseData = supplierDataRes?.payload?.Data;
                if (!responseData || !responseData?.SupplierActiveCustomerReport?.length) {
                    try {
                        setData(supplierActiveCustomerData.SupplierActiveCustomerReport);
                    } catch (err) {
                        console.error('Failed to load fallback data:', err);
                    }
                } else {
                    setData(responseData);
                    setMonthYear(responseData?.GasDay);
                }
            }
        };

        fetchSupplierData();
    }, [dispatch, activeMarkter]);

    const handleFilterSubmit = (filterData) => {
        const selectedMarketer = markterList.find(m => m.MarketerID === filterData.CompanyID);

        setActiveMarkter({
            MarketerID: filterData.CompanyID,
            MarketerName: selectedMarketer?.MarketerName || ''
        });

        const result = dispatch(supplierActiveCustomerReportActions.getSupplierActiveCustomerReport(filterData));
        setData(result?.payload?.Data);
        setMonthYear(result?.payload?.Data?.GasDay);
    };

    if (supplierCustomerData?.error) {
        return <div>Error: {supplierCustomerData.error.message}</div>;
    }

    const monthYearFormatted = dayjs(monthYear).format('MMMM YYYY');
    const datePublished = dayjs().format('MM/DD/YYYY');

    return (
        <>
            <Typography component="div" className='userprofilelist'>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} md={4} style={{ paddingTop: '10px' }}>
                                <div className='userprofilelistcontent'>
                                    <div>
                                        Reports <span className="fcreport-line">Supplier Active Customers Report</span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement" style={{ paddingTop: '10px' }}>
                                    <Grid item xs={12} md={8}>
                                        <Grid container spacing={2} justifyContent="flex-end">
                                            <Grid item xs={6} md={5}>
                                                <SupplierActiveCustomerFilter
                                                    handleFilterSubmit={handleFilterSubmit}
                                                    markterList={markterList}
                                                    activeMarketer={activeMarkter}
                                                    isOpen={filterOpen}
                                                    onOpen={() => setFilterOpen(true)}
                                                    onClose={() => setFilterOpen(false)}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={5}>
                                                <SupplierActiveCustomerDownload data={data} tableRef={tableRef} />
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
                    <ForeCastReportDetail fcReportName="Supplier Active Customers Report" MarkterName={activeMarkter?.MarketerName} monthYearDate={monthYearFormatted} publishDate={datePublished} />
                    <div className={backdropOpen ? "backdrop" : ""}></div>
                    <div className="MarketerListMaterialReactTable">
                        <SupplierActiveCustomerList data={data} ref={tableRef} /></div>
                </Grid>
            </Grid>
        </>
    );
};

export default SupplierActiveCustomerReport;
