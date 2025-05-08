import React,{useState,useEffect,useRef} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, marketerReportAction } from '_store';
import CustomerUsageReportList from './CustomerUsageReportList';
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
import CustomerUsageFilter from "./CustomerUsageFilter";
import CustomerUsageDownload from "./CustomerUsageDownload";
const CustomerUsage = () =>{
  const header="Customer Report";
    const dispatch = useDispatch();
    const tableRef = useRef(null);
    console.log(tableRef);
      const [data, setData] = useState([]);
        const authUser = useSelector(x => x.auth?.value);
      const user = authUser?.Data;
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%',user);
      const userdetails = user?.UserDetails;
      const userAccess= user?.UserAccess;
      // const authUserName = `${userdetails.FirstName} ${userdetails.LastName}`;
      const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));
      const [fromDate, setFromDate] = useState(dayjs().startOf('month').toDate());
      const [toDate, setToDate] = useState(dayjs().endOf('month').toDate());
    const [openComponent, setOpenComponent] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    useEffect(() => {
      console.log("Table reference updated:", tableRef);
  }, [tableRef]);
    const data1={
      "Succeeded": true,
      "Message": null,
      "Errors": null,
      "Data": {
        "CustomerUsageData": [
          {
            "MarketerID": 173,
            "MarketerName": null,
            "AccountNumber": "220002569956",
            "IsAccountActive": false,
            "ShipmentDate": "2025-04-09T00:00:00",
            "DailyUsage": 47
          },
          {
            "MarketerID": 173,
            "MarketerName": null,
            "AccountNumber": "220002569956",
            "IsAccountActive": false,
            "ShipmentDate": "2014-03-10T00:00:00",
            "DailyUsage": 38
          },
          {
            "MarketerID": 173,
            "MarketerName": null,
            "AccountNumber": "220002569956",
            "IsAccountActive": false,
            "ShipmentDate": "2014-03-11T00:00:00",
            "DailyUsage": 35
          },
          {
            "MarketerID": 173,
            "MarketerName": null,
            "AccountNumber": "220002590028",
            "IsAccountActive": false,
            "ShipmentDate": "2014-03-09T00:00:00",
            "DailyUsage": 51
          },
          {
            "MarketerID": 173,
            "MarketerName": null,
            "AccountNumber": "220002590028",
            "IsAccountActive": false,
            "ShipmentDate": "2014-03-10T00:00:00",
            "DailyUsage": 45
          }],
          "MarketerDetails": [
            {
              "MarketerID": 103,
              "MarketerName": "Constellation Energy Source"
            },
            {
              "MarketerID": 134,
              "MarketerName": "UGI Energy Services - 33"
            },
            {
              "MarketerID": 136,
              "MarketerName": "WGL Energy Svcs - 35"
            },
            {
              "MarketerID": 161,
              "MarketerName": "Colonial Energy"
            }]
        }
        }
  useEffect(() => {
  //  setData(data1?.Data);
    const fetchData = async () => {
      
      dispatch(alertActions.clear());
      try {
        const obj = {
          UserID: isAdmin ? 0 : userdetails.id,
          CompanyID: 0,
          AccountNumber: " ",
          StartDate: fromDate,
          EndDate: toDate
        }
        const result = await dispatch(marketerReportAction.getCustomerUsageDetails(obj));
        const reportData = result?.payload?.Data;
      
        setData(reportData);
      } catch (error) {
        console.error('Fetch Error:', error); // Log any errors
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch, isAdmin]);
    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
        setOpenComponent(null);
      };
    const handleOpenComponent = (component) => {
        setOpenComponent(prev => prev === component ? null : component);
        setBackdropOpen(prev => prev === component ? false : true); // Toggle backdrop
      };

      const handleFilterSubmit = async (newData) => {
        await setData(newData);
      };

return(
//  <CustomerUsageReportList/>
<>
<Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'><span>Reports </span>Customer usage Report </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <CustomerUsageFilter
                        isAdmin={isAdmin}
                        userdetails={userdetails}
                         fromDate={fromDate}
                         toDate={toDate}
                         data={data}
                         setFromDate={setFromDate}
                         setToDate={setToDate}
                         handleFilterSubmit={handleFilterSubmit}
                     isOpen={openComponent === 'filter'}
                     onClose={() => handleCloseBackdrop()}
                     onOpen={() => handleOpenComponent('filter')}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                        <CustomerUsageDownload
                      data={data}
                      fromDate={fromDate}
                         toDate={toDate}
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
        
          <div className='MarketerListMaterialReactTable'>
            <CustomerUsageReportList
        fromDate={fromDate}
        toDate={toDate}
        data={data}
        ref={tableRef}

            />

          </div>
        </Grid>
         
      </Grid>
</>
)
}

export default CustomerUsage;
