import { summaryStorageMarketerReportActions } from '_store/summaryStorage.slice';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
import SummaryStorageList from './summaryStorageList';
import SummaryStorageFilter from './summaryStorageFilter';
import SummaryStorageDownload from './summaryStorageDownload';
import ForeCastReportDetail from '../foreCastReport/foreCastReportDetail';
import summaryStorageDefaultData from 'assets/files/ReportData.json';

const SummaryStorageMarketerReport = () => {
  const dispatch = useDispatch();
  const [summaryStorageData, setSummaryStorageData] = useState(null);
  const [gasDay, setGasDay] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const tableRef = useRef(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  // Dispatch the action with the current ISO date as StartDate
  const fetchSummaryStorageReport = async (currentDate) => {
    const res = await dispatch(summaryStorageMarketerReportActions.getSummaryStorageMarketerReport({ StartDate: currentDate }));
    if (!res || !res?.payload?.Data?.RequirementForecastData?.length) {
      const res=summaryStorageDefaultData?.summaryStorageByMarkerterReport
      setSummaryStorageData(res);
      const gasDateIso = res?.totalSum?.GasDay;
      if (gasDateIso) {
        setGasDay(dayjs(gasDateIso).format('MM/DD/YYYY'));
      }
    }
    else {
      setSummaryStorageData(res?.payload?.Data);
      const gasDateIso = res?.payload?.Data?.totalSum?.GasDay;
      if (gasDateIso) {
        setGasDay(dayjs(gasDateIso).format('MM/DD/YYYY'));
      }
    }
  }

  useEffect(() => {
    const currentDate = new Date().toISOString();
    setPublishDate(dayjs().format('MM/DD/YYYY'));
    fetchSummaryStorageReport(currentDate);

  }, []);


  const handleFilterSubmit = (data) => {
    console.log('Selected date in ISO format:', data.StartDate);
    fetchSummaryStorageReport(data.StartDate)
  };

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);


  const { error } = useSelector((state) => state.summaryStorageMarketerReport || {});

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'>
                  <div>Reports <span className="fcreport-line">Summary Storage by Marketer Report</span></div>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <SummaryStorageFilter
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={isOpen}
                          onClose={onClose}
                          onOpen={onOpen}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <SummaryStorageDownload data={summaryStorageData} />
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
          <ForeCastReportDetail fcReportName="Summary Storage by Marketer Report" gasDay={gasDay} publishDate={publishDate} />
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <SummaryStorageList data={summaryStorageData} ref={tableRef} /></div>
        </Grid>
      </Grid>

    </>
  );
};

export default SummaryStorageMarketerReport;
