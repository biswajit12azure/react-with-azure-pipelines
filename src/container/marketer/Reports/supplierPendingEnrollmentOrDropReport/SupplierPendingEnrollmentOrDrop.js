import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupplierPendingEnrollmentOrDropReportsFilter from "./SupplierPendingEnrollmentOrDropFilter";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SupplierPendingEnrollmentOrDropReportsList from "./SupplierPendingEnrollmentOrDropList";
import { alertActions } from "_store";
import { supplierPendingEnrollmentOrDropAction } from "_store/supplierPendingEnrollmentOrDrop.slice";
import SupplierPendingEnrollmentOrDropReportDownload from "./SupplierPendingEnrollmentOrDropDownload";
import dayjs from "dayjs";
import ReportsDetails from "./ReportsDetails";

const SupplierPendingEnrollmentOrDropReports = () => {
  const header = "Supplier Pending Enrollment/Drop Report";
  const dispatch = useDispatch();
  const supplierPendingEnrollmentOrDrops = useSelector(
    (x) => x.supplierPendingEnrollmentOrDrop?.supplierPendingEnrollmentOrDropList
  );
  const marketers = useSelector((x) => x.marketer?.marketerList);
  const tableRef = useRef(null);
  console.log(tableRef);
  const [data, setData] = useState({});
  const [data1, setData1] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [marketerId, setMarketerId] = useState(0);
  // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const supplierPendingEnrollmentOrDropData = data;
  // const supplierPendingEnrollmentOrDropData = useSelector(x => x.supplierPendingEnrollmentOrDrop.supplierPendingEnrollmentOrDropList);

  useEffect(() => {
    console.log("Table reference updated:", tableRef);
  }, [tableRef]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        let Data ={
            MarketerID: null,
            StartDate: date
        };

        const result = await dispatch(supplierPendingEnrollmentOrDropAction.get(Data)).unwrap();
        const supplierPendingEnrollmentOrDropData = result?.Data;
        setData(supplierPendingEnrollmentOrDropData);
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
                  Reports <span>Supplier Pending Enrollment/Drop</span>{" "}
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
                        <SupplierPendingEnrollmentOrDropReportsFilter
                          isOpen={isFilterOpen}
                          marketerData={data}
                          onClose={handleFilterClose}
                          onOpen={handleFilterOpen}
                          supplierPendingEnrollmentOrDrops={supplierPendingEnrollmentOrDropData}
                          setMarketerId={setMarketerId}
                          marketerId={marketerId}
                          setDate={setDate}
                          date={date}
                          handleFilterSubmit={handleFilterSubmit}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                        <SupplierPendingEnrollmentOrDropReportDownload
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
      <ReportsDetails supplierPendingEnrollmentOrDrop={data} date={date} />
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <div className={backdropOpen ? "backdrop" : ""}></div>
          <div className="MarketerListMaterialReactTable">
            <SupplierPendingEnrollmentOrDropReportsList
              supplierPendingEnrollmentOrDrops={supplierPendingEnrollmentOrDrops}
              supplierPendingEnrollmentOrDropData={data}
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

export default SupplierPendingEnrollmentOrDropReports;
