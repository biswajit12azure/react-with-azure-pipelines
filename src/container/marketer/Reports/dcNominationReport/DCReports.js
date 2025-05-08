import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DCReportsFilter from "./DCReportsFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DCReportsList from "./DCReportList";
import { alertActions,dcnominationReportActions } from '_store';
import { marketerAction } from '_store/marketer.slice';
import DCReportDownload from './DCReportDownload';
import dayjs from 'dayjs';
const DCReports = () => {
  const header = "DC Nomination Report";
  const dispatch = useDispatch();
  const marketers = useSelector(x => x.marketer?.marketerList);
  const tableRef = useRef(null);
  console.log(tableRef);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
//  const [marketerData,setMarketerData] = useEffect(null);
  const startOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
  const endOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss');

  // useEffect(() => {
  //   console.log("Table reference updated:", tableRef);
  // }, [tableRef]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const obj = {
          "CompanyID": 0,
          "AccountNumber": "",
          "StartDate": "2024-02-01T14:40:50.727Z",
          "EndDate": "2024-02-28T14:40:50.727Z"
        }
        const result = await dispatch(dcnominationReportActions.getDCNominationReport(obj)).unwrap();
        console.log(result);
        // const marketerData = result?.Data;
        // setData(marketerData);
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };

  const handleOpen = () => setFilterOpen(true);
  const handleClose = () => setFilterOpen(false);
  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'>Reports <span>Dc Nomination Reallocation Report</span> </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <DCReportsFilter
                          // marketers={marketerData}
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={filterOpen}
                          onOpen={handleOpen}
                          onClose={handleClose}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <DCReportDownload
                          data={data1}
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
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <div className={backdropOpen ? 'backdrop' : ''}>
          </div>
          <div className='MarketerListMaterialReactTable'>
            <DCReportsList
              marketers={marketers}
              marketerData={data}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              // handleChange={handleChange}
              rowSelection={rowSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setRowSelection={setRowSelection}
              // handleRefresh={handleRefresh}
              // handleToggleActiveStatus={handleToggleActiveStatus}
              setData1={setData1}
              ref={tableRef}
            />
          </div>
        </Grid>

      </Grid>
    </>
  );
}

export default DCReports;