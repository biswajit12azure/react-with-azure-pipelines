import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityInterruptibleFilter from "./ActivityInterruptibleReportsFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ActivityInterruptibleList from "./ActivityInterruptibleReportList";
import { alertActions, activityInterruptibleAction } from "_store";
import { marketerAction } from "_store/marketer.slice";
import ActivityInterruptibleDownload from "./ActivityInterruptibleDownload";
import dayjs from "dayjs";
const ActivityInterruptible = () => {
  const header = "Activity Interruptible Report";
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [data, setData] = useState({});
  // const [data, setData] = useState(ActivityInterruptibleData.Data);
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [marketerId, setMarketerId] = useState(0);

  // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const obj = {
          CompanyID: marketerId,
          ReportDate: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
          IsFirm: false,
        };
        const result = await dispatch(
          activityInterruptibleAction.get(obj)
        ).unwrap();
        console.log(result);
        const activityInterruptibleData = result?.Data;
        setData(activityInterruptibleData);
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
                  Reports <span>Adjustment Activity Interruptible Report</span>{" "}
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
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <ActivityInterruptibleFilter
                          activityInterruptible={data}
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={filterOpen}
                          onOpen={handleOpen}
                          onClose={handleClose}
                          setDate={setDate}
                          date={date}
                          setMarketerId={setMarketerId}
                          marketerId={marketerId}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <ActivityInterruptibleDownload
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
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <ActivityInterruptibleList
              activityInterruptible={data}
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

export default ActivityInterruptible;
