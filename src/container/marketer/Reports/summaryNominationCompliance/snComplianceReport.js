import { complianceReportActions } from '_store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import SNComplianceReportList from './snComplianceReportList';
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
import SNComplianceFilter from './snComplianceReportFilter';
import SNComplianceReportDownload from './snComplianceReportDownload';
import ForeCastReportDetail from '../foreCastReport/foreCastReportDetail';
import summaryNominationComplainReportData from 'assets/files/ReportData.json';

const SNComplianceReport = () => {
  const dispatch = useDispatch();
  const [rawData, setRawData] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [publishDate, setPublishDate] = useState(dayjs().format('MM/DD/YYYY')); // Current date (publishDate)
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const tableRef = useRef(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  // Function to process and transform the compliance data
  const processComplianceData = (data) => {
    if (!data) return [];

    const detailedData = data?.DetailedData || [];
    const companyTotals = data?.CompanyTotals || [];
    const firmInterruptibleTotals = data?.FirmInterruptibleTotals || [];
    const grandTotal = data?.GrandTotal?.[0] || {};

    // Group detailed data by CompanyName
    const groupedData = detailedData.reduce((acc, row) => {
      const company = row.CompanyName;
      if (!acc[company]) acc[company] = [];
      acc[company].push(row);
      return acc;
    }, {});

    const transformedData = [];

    Object.entries(groupedData).forEach(([company, rows]) => {
      rows.forEach((row, index) => {
        transformedData.push({
          ...row,
          CompanyName: index === 0 ? company : '',  // Show name only once per group
          isTotal: false,
        });
      });

      const total = companyTotals.find(ct => ct.CompanyName === company);
      if (total) {
        transformedData.push({
          ...total,
          CompanyName: '', // Blank for total row
          isTotal: true,
          customCategory: 'Company Total',
        });
      }
    });

    const fixedTotals = detailedData.length > 0 ? [
      {
        CompanyName: '',
        AllocationGroup: 'Total FIRM',
        TotalNominationAllocations: firmInterruptibleTotals.find(f => f.Category === 'Total FIRM')?.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: firmInterruptibleTotals.find(f => f.Category === 'Total FIRM')?.DailyRequiredVolume ?? 0,
        TotalUsage: firmInterruptibleTotals.find(f => f.Category === 'Total FIRM')?.TotalUsage ?? 0,
        TotalForecastImbal: firmInterruptibleTotals.find(f => f.Category === 'Total FIRM')?.TotalForecastImbal ?? 0,
        Penalty: firmInterruptibleTotals.find(f => f.Category === 'Total FIRM')?.Penalty ?? 0,
        isTotal: true,
        customCategory: 'Fixed Total',
      },
      {
        CompanyName: '',
        AllocationGroup: 'Total Interruptible',
        TotalNominationAllocations: firmInterruptibleTotals.find(f => f.Category === 'Total Interruptible')?.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: firmInterruptibleTotals.find(f => f.Category === 'Total Interruptible')?.DailyRequiredVolume ?? 0,
        TotalUsage: firmInterruptibleTotals.find(f => f.Category === 'Total Interruptible')?.TotalUsage ?? 0,
        TotalForecastImbal: firmInterruptibleTotals.find(f => f.Category === 'Total Interruptible')?.TotalForecastImbal ?? 0,
        Penalty: firmInterruptibleTotals.find(f => f.Category === 'Total Interruptible')?.Penalty ?? 0,
        isTotal: true,
        customCategory: 'Fixed Total',
      },
      {
        CompanyName: '',
        AllocationGroup: 'Grand Total',
        TotalNominationAllocations: grandTotal?.TotalNominationAllocations ?? 0,
        DailyRequiredVolume: grandTotal?.DailyRequiredVolume ?? 0,
        TotalUsage: grandTotal?.TotalUsage ?? 0,
        TotalForecastImbal: grandTotal?.TotalForecastImbal ?? 0,
        Penalty: grandTotal?.Penalty ?? 0,
        isTotal: true,
        customCategory: 'Fixed Total',
      },
    ] : [];

    return [...transformedData, ...fixedTotals];
  };

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        StartDate: dayjs().startOf('month').toISOString(),
        EndDate: dayjs().toISOString(),
      };

      handleRefresh(payload);
    };

    fetchData();
  }, [dispatch]);

  const handleRefresh = async (payload) => {
    const res = await dispatch(complianceReportActions.getComplianceReport(payload));
    let raw={};
    if(!res || !res?.payload?.Data?.RequirementForecastData?.length){
       raw=summaryNominationComplainReportData?.SummaryNominationByCompliance;
    }
    else{
       raw = res?.payload?.Data;
    }
    
    setRawData(raw);
    const finalData = processComplianceData(raw);
    setProcessedData(finalData);
    if (raw?.DetailedData?.length > 0) {
      setDateRange({
        startDate: dayjs(payload.StartDate).format('MM/DD/YYYY'),
        endDate: dayjs(payload.EndDate).format('MM/DD/YYYY')
      });
    } else {
      setDateRange({ startDate: '', endDate: '' });
    }
  };

  const handleFilterSubmit = async (filter) => {
    handleRefresh(filter);
  };

  return (
    <>
      <Typography component="div" className='userprofilelist'>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'>
                  <div>Reports <span className="fcreport-line">Summary Nomination Compliance Report</span></div>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <SNComplianceFilter handleFilterSubmit={handleFilterSubmit} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <SNComplianceReportDownload data={processedData} startDate={dateRange.startDate} endDate={dateRange.endDate} tableRef={tableRef} />
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
          <ForeCastReportDetail fcReportName="Summary Nomination Compliance Report" fromDate={dateRange.startDate}  toDate={dateRange.endDate} publishDate={publishDate} />
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
          <SNComplianceReportList data={processedData} ref={tableRef} /></div>
        </Grid>
      </Grid>
    </>
  );
};

export default SNComplianceReport;