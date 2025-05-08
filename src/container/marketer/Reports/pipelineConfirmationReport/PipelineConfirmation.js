import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PipelineConfirmationFilter from "./PipelineConfirmationFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PipelineConfirmationList from "./PipelineConfirmationList";
import { alertActions, pipelineConfirmationAction } from "_store";
import PipelineConfirmationDownload from "./PipelineConfirmationDownload";
import ReportsDetails from "./ReportsDetails";
import dayjs from "dayjs";
const PipelineConfirmation = () => {
  const header = "Pipeline Confirmation Report";
  const dispatch = useDispatch();
  const marketers = useSelector((x) => x.marketer?.marketerList);
  const tableRef = useRef(null);
  const [data, setData] = useState({});
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
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
    setData();
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        let Data = {
          PipelineID: 101,
          NominationDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        };
        const result = await dispatch(
          pipelineConfirmationAction.get(Data)
        ).unwrap();
        const PipelineConfirmationData = result?.Data;
        
        setData(PipelineConfirmationData);
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
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Typography variant="h2" className="userprofilelistcontent">
                  Reports <span>Pipeline Confirmation Report</span>{" "}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  className="MarketerManagement"
                >
                  <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <PipelineConfirmationFilter
                          PipelineConfirmationData={data}
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={filterOpen}
                          onOpen={handleOpen}
                          onClose={handleClose}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <PipelineConfirmationDownload
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
          <ReportsDetails PipelineConfirmationData={data} />

          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <PipelineConfirmationList
              PipelineConfirmationData={data}
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

export default PipelineConfirmation;
