import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CityGateReportsFilter from "./CityGateReportsFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CityGateReportsList from "./CityGateList";
import { alertActions } from "_store";
import { cityGateAction } from "_store/cityGate.slice";
import CityGateReportDownload from "./CityGateDownload";
import dayjs from "dayjs";
import ReportsDetails from "./ReportsDetails";
const CityGateReports = () => {
  const header = "City Gate Nomination Report";
  const dispatch = useDispatch();
  const cityGates = useSelector((x) => x.cityGate?.cityGateList);
  const tableRef = useRef(null);
  console.log(tableRef);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [date,setDate] = useState(dayjs())
  // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const marketerData = useSelector(
    (x) => x.nominationgroup?.nominationGroupList?.MarketerData
  );

  useEffect(() => {
    console.log("Table reference updated:", tableRef);
  }, [tableRef]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        let Data = {
          StartDate: dayjs(date).startOf("day").toISOString(),
        };
        const result = await dispatch(cityGateAction.get(Data)).unwrap();
        const cityGateData = result?.Data;
        setData(cityGateData);
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
  }, [dispatch]);

  const handleFilterSubmit = async (newData,date) => {
    setData(newData);
    setDate(date)
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
                  Reports <span> Summary Supply by City Gate Report</span>{" "}
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
                        <CityGateReportsFilter
                          isOpen={isFilterOpen}
                          onClose={handleFilterClose}
                          onOpen={handleFilterOpen}
                          marketers={marketerData}
                          handleFilterSubmit={handleFilterSubmit}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <CityGateReportDownload
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
      <ReportsDetails date={date} />
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <CityGateReportsList
              cityGateData={data}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              rowSelection={rowSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setRowSelection={setRowSelection}
              setData1={setData1}
              ref={tableRef}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default CityGateReports;
