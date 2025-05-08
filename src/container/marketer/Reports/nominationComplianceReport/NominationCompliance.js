import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NominationComplianceFilter from "./NominationComplianceFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import NominationComplianceList from "./NominationComplianceList";
import { alertActions } from "_store";
import { nominationComplianceAction } from "_store/nominationCompliance.slice";
import NominationComplianceDownload from "./NominationComplianceDownload";
import ReportsDetails from "./ReportsDetails";
import dayjs from "dayjs";
const NominationCompliance = () => {
  const header = "Nomination Compliance Report";
  const dispatch = useDispatch();
  const marketers = useSelector((x) => x.marketer?.marketerList);
  const tableRef = useRef(null);
  const [data, setData] = useState({});
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").toDate());
  const [toDate, setToDate] = useState(dayjs().endOf("month").toDate());
  const [filterOpen, setFilterOpen] = useState(false);
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
          companyId: "0",
          startDate: dayjs(fromDate).format('YYYY-MM-DDTHH:mm:ss'),
          endDate: dayjs(toDate).format('YYYY-MM-DDTHH:mm:ss'),
        };
        const result = await dispatch(
          nominationComplianceAction.get(Data)
        ).unwrap();
        const nominationComplianceData = result?.Data;
        setData(nominationComplianceData);
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

  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };

  const handleOpen = () => setFilterOpen(true);
  const handleClose = () => setFilterOpen(false);
  return (
    <>
      <Typography component="div" className="userprofilelist ">
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className="userprofilelistcontent">
                  Reports <span>Nomination Compliance Report</span>{" "}
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
                        <NominationComplianceFilter
                          marketers={marketerData}
                          data={data}
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={filterOpen}
                          onOpen={handleOpen}
                          onClose={handleClose}
                          setFromDate={setFromDate}
                          setToDate={setToDate}
                          fromDate={fromDate}
                          toDate={toDate}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <NominationComplianceDownload
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
          <ReportsDetails
            NominationCompliance={data}
            fromDate={fromDate}
            toDate={toDate}
          />
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <NominationComplianceList
              // marketers={marketers}
              NominationComplianceData={data}
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

export default NominationCompliance;
