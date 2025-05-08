import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MonthlyStorageReportsFilter from "./MonthlyStorageReportsFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MonthlyStorageReportsList from "./MonthlyStorageReportList";
import { alertActions } from "_store";
import { monthlyStorageAction } from "_store/monthlyStorage.slice";
import MonthlyStorageReportDownload from "./MonthlyStorageReportDownload";
import dayjs from "dayjs";
import ReportsDetails from "./ReportsDetails";

const MonthlyStorageReports = () => {
  const header = "Monthly Storage Report";
  const dispatch = useDispatch();
  const monthlyStorages = useSelector(
    (x) => x.monthlyStorage?.monthlyStorageList
  );
  const marketers = useSelector((x) => x.marketer?.marketerList);
  const tableRef = useRef(null);
  const [data, setData] = useState({});
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [marketerId, setMarketerId] = useState(136);
  // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const monthlyStorageData = data;
  // const monthlyStorageData = useSelector(x => x.monthlyStorage.monthlyStorageList);

  useEffect(() => {
    console.log("Table reference updated:", tableRef);
  }, [tableRef]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        let Data = {
          CompanyID: marketerId,
          ReportDate: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
        };

        const result = await dispatch(monthlyStorageAction.get(Data)).unwrap();
        const monthlyStorageData = result?.Data;
        setData(monthlyStorageData);
      } catch (error) {
        dispatch(
          alertActions.error({
            message: error?.message || error,
            header: `${header} Failed`,
          })
        );
      }
    };
    fetchData();
  }, []);

  const handleFilterSubmit = async (newData,date) => {
    setData(newData);
    setDate(date);
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      <Typography component="div" className="userprofilelist ">
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className="userprofilelistcontent">
                  Reports <span>Monthly Storage Report</span>{" "}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  className="MarketerManagement"
                >
                  <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <MonthlyStorageReportsFilter
                          isOpen={isFilterOpen}
                          marketerData={data}
                          onClose={handleFilterClose}
                          onOpen={handleFilterOpen}
                          monthlyStorages={monthlyStorageData}
                          setMarketerId={setMarketerId}
                          marketerId={marketerId}
                          setDate={setDate}
                          date={date}
                          handleFilterSubmit={handleFilterSubmit}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <MonthlyStorageReportDownload
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
      <ReportsDetails monthlyStorage={data} date={date} />
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <MonthlyStorageReportsList
              monthlyStorages={monthlyStorages}
              monthlyStorageData={data}
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
};

export default MonthlyStorageReports;
