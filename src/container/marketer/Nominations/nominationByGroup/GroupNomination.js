import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, nominationgroupAction } from '_store';
import { GroupNominationFilter, GroupNominationList } from '../../index';
import { Typography, Button,Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { NominationGroupData } from '_utils/constant';
const GroupNomination = ({fromDate,setFromDate,toDate,setToDate}) => {
  const header = "Nomination By Group";
  const dispatch = useDispatch();
  // const nominationData = useSelector(x => x.nominationgroup?.nominationGroupList);
  // const marketerData=nominationData?.MarketerData;
  // const marketerGroupData = nominationData?.ListGroupData;
  // console.log(nominationData);
  // console.log("marketerGroupData",marketerGroupData);
  const [data, setData] = useState([]);
  // const [fromDate, setFromDate] = useState(dayjs().startOf('month').toDate());
  // const [toDate, setToDate] = useState(dayjs().endOf('month').toDate());
  const [marketerId, setMarketerId] = useState(null);
  const [marketerGroupId, setMarketerGroupId] = useState(null);
  const [pipelineID, setPipelineID] = useState(null);
  const [openComponent, setOpenComponent] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [editedRecords, setEditedRecords] = useState({});
  const [isDataChanged, setIsDataChanged] = useState(false);
  const authUser = useSelector(x => x.auth?.value);
  const userProfiles = useSelector(x => x.userProfile?.userProfileData);
  const marketerData = useSelector(x => x.nominationgroup?.nominationGroupList?.MarketerData);
  const marketerGroupData = useSelector(x => x.nominationgroup?.nominationGroupList?.ListGroupData);

  const user = authUser?.Data;
  const userdetails = user?.UserDetails;
  const userAccess = user?.UserAccess;
  const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));
  // console.log("isAdmin",isAdmin);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const result = await dispatch(nominationgroupAction.get()).unwrap();
        const nominationData = result?.Data;
        setData(nominationData);
        // setData(NominationGroupData?.Data);
      } catch (error) {
        console.error('Fetch Error:', error); // Log any errors
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch, setData]);
  const handleRefresh = async () => {
    const result = await dispatch(nominationgroupAction.get()).unwrap();
    const nominationData = result?.Data;
    setData(nominationData);
  };

  const handleCancelClick = async () => {
    handleRefresh();
};
  const pipelineData = [
    {
      "PipelineID": 2,
      "Name": "Test 1"
    },
    {
      "PipelineID": 3,
      "Name": "Test 2"
    }
  ];
  const handleFilterSubmit = async (newData) => {
    await setData(newData);
    setMarketerId(newData?.MarketerID);
  };
  const handleCloseBackdrop = () => {
    setBackdropOpen(false);
    setOpenComponent(null);
  };

  const handleOpenComponent = (component) => {
    setOpenComponent(prev => prev === component ? null : component);
    setBackdropOpen(prev => prev === component ? false : true); // Toggle backdrop
  };

  // const handleChange = (newValue, rowData, columnId) => {
  //   // Create a new copy of the data object to ensure it's not read-only
  //   let newData = JSON.parse(JSON.stringify(data));

  //   // Create a new array for the updated contract data
  //   const updatedGroupData = newData.GroupData.GroupData1.map(group => {
  //     // Create a shallow copy of the contract object
  //     const newGroup = { ...group };

  //     if (newGroup.GroupID === rowData.GroupID) {
  //       const date = dayjs(columnId, 'DD/MM').format('YYYY-MM-DD');

  //       const detail = newGroup.GroupDetails.find(d => dayjs(d.ShipmentDate).format('YYYY-MM-DD') === date);
  //       newGroup.GroupDetails = [...newGroup.GroupDetails];
  //       const isNominationRow = rowData.GroupName === "Nomination";
  //       const isDRVRow = rowData.GroupName === "DRV";
  //       if (detail) {

  //         if (isNominationRow) {
  //           detail.NominationValue = newValue;
  //         } else {
  //           detail.DRV_value = newValue;
  //         }

  //       } else {
  //         console.log("Date not found! Adding missing values.");
  //         newGroup.GroupDetails.push({
  //           ShipmentDate: `${date}T00:00:00`,
  //           GroupDate: `${date}T00:00:00`,
  //           GroupValue: rowData.GroupValue || "", // Preserve existing GroupValue
  //           NominationID: isNominationRow ? rowData.NominationID || null : null,
  //           NominationValue: isNominationRow ? newValue : 0,
  //           DRVID: isDRVRow ? rowData.DRVID || null : null,
  //           DRV_value: isDRVRow ? newValue : 0,
  //         });


  //       }
  //     }

  //     return newGroup;
  //   });

  //   newData.GroupData.GroupData1 = updatedGroupData;

  //   setData(newData);
  //   // Update Edited Records
  //   setEditedRecords(prev => {
  //     const updatedRecords = { ...prev };
  //     const group = updatedGroupData.find(g => g.GroupID === rowData.GroupID);

  //     if (group) {
  //       const editedDetails = group.GroupDetails.filter(d =>
  //         (rowData.GroupName === "Nomination" && d.NominationValue === newValue) ||
  //         (rowData.GroupName === "DRV" && d.DRV_value === newValue)
  //       );

  //       if (!updatedRecords[group.GroupID]) {
  //         updatedRecords[group.GroupID] = { GroupDetails: [] };
  //       }

  //       // Remove existing records for the same date
  //       updatedRecords[group.GroupID].GroupDetails = updatedRecords[group.GroupID].GroupDetails.filter(
  //         d => dayjs(d.ShipmentDate).format('YYYY-MM-DD') !== dayjs(editedDetails[0].ShipmentDate).format('YYYY-MM-DD')
  //       );

  //       updatedRecords[group.GroupID].GroupDetails.push(...editedDetails);
  //     }

  //     return updatedRecords;
  //   });
  //   setIsDataChanged(true);
  // };

  // const handleChange = (newValue, rowData, columnId) => {
  //   // Deep clone the current data to avoid direct mutation
  //   let newData = JSON.parse(JSON.stringify(data));
  
  //   // ✅ Initialize nested structures safely
  //   if (!newData.GroupData) {
  //     newData.GroupData = {};
  //   }
  //   if (!newData.GroupData.GroupData1) {
  //     newData.GroupData.GroupData1 = [];
  //   }
  
  //   // Then continue with your update logic
  //   const date = dayjs(columnId, 'MM/DD/YYYY').format('YYYY-MM-DD');
  //   const isNominationRow = rowData.GroupName === "Nomination";
  //   const isDRVRow = rowData.GroupName === "DRV";
  
  //   const updatedGroupData = newData.GroupData.GroupData1.map(group => {
  //     if (group.GroupID !== rowData.GroupID) return group;
  
  //     let groupCopy = { ...group };
  //     let details = [...(group.GroupDetails || [])];
  
  //     const existingDetailIndex = details.findIndex(d =>
  //       dayjs(d?.ShipmentDate).format('YYYY-MM-DD') === date
  //     );
  
  //     if (existingDetailIndex !== -1) {
  //       if (isNominationRow) details[existingDetailIndex].NominationValue = newValue;
  //       if (isDRVRow) details[existingDetailIndex].DRV_value = newValue;
  //     } else {
  //       const newDetail = {
  //         ShipmentDate: `${date}T00:00:00`,
  //         GroupDate: `${date}T00:00:00`,
  //         GroupValue: rowData.GroupValue || "",
  //         NominationID: isNominationRow ? rowData.NominationID || null : null,
  //         NominationValue: isNominationRow ? newValue : 0,
  //         DRVID: isDRVRow ? rowData.DRVID || null : null,
  //         DRV_value: isDRVRow ? newValue : 0,
  //       };
  //       details.push(newDetail);
  //     }
  
  //     groupCopy.GroupDetails = details;
  //     return groupCopy;
  //   });
  
  //   newData.GroupData.GroupData1 = updatedGroupData;
  //   console.log(newData);
  //   setData(newData);
  //   setIsDataChanged(true);
  // };

  const handleChange = (newValue, rowData, columnId) => {
    let newData = JSON.parse(JSON.stringify(data));
  
    // ✅ Safely initialize structure
    if (!newData.GroupData) {
      newData.GroupData = {};
    }
    if (!newData.GroupData.GroupData1) {
      newData.GroupData.GroupData1 = [];
    }
  
    const date = dayjs(columnId, 'MM/DD/YYYY').format('YYYY-MM-DD');
    const isNominationRow = rowData.GroupName === "Nomination";
    const isDRVRow = rowData.GroupName === "DRV";
  
    const updatedGroupData = newData.GroupData.GroupData1.map(group => {
      if (group.GroupID !== rowData.GroupID) return group;
  
      let groupCopy = { ...group };
      let details = [...(group.GroupDetails || [])];
  
      const existingDetailIndex = details.findIndex(d =>
        dayjs(d?.ShipmentDate).format('YYYY-MM-DD') === date
      );
  
      if (existingDetailIndex !== -1) {
        if (isNominationRow) details[existingDetailIndex].NominationValue = newValue;
        if (isDRVRow) details[existingDetailIndex].DRV_value = newValue;
      } else {
        const newDetail = {
          ShipmentDate: `${date}T00:00:00`,
          GroupDate: `${date}T00:00:00`,
          GroupValue: rowData.GroupValue || "",
          NominationID: isNominationRow ? rowData.NominationID || null : null,
          NominationValue: isNominationRow ? newValue : 0,
          DRVID: isDRVRow ? rowData.DRVID || null : null,
          DRV_value: isDRVRow ? newValue : 0,
        };
        details.push(newDetail);
      }
  
      groupCopy.GroupDetails = details;
      return groupCopy;
    });
  
    newData.GroupData.GroupData1 = updatedGroupData;
    setData(newData);
  
    // ✅ Update Edited Records
    setEditedRecords(prev => {
      const updatedRecords = { ...prev };
      const group = updatedGroupData.find(g => g.GroupID === rowData.GroupID);
  
      if (group) {
        const editedDetails = group.GroupDetails.filter(d =>
          (isNominationRow && d.NominationValue === newValue && dayjs(d.ShipmentDate).format('YYYY-MM-DD') === date) ||
          (isDRVRow && d.DRV_value === newValue && dayjs(d.ShipmentDate).format('YYYY-MM-DD') === date)
        );
  
        if (!updatedRecords[group.GroupID]) {
          updatedRecords[group.GroupID] = { GroupDetails: [] };
        }
  
        // Remove existing record for same date
        updatedRecords[group.GroupID].GroupDetails = updatedRecords[group.GroupID].GroupDetails.filter(
          d => dayjs(d.ShipmentDate).format('YYYY-MM-DD') !== date
        );
  
        updatedRecords[group.GroupID].GroupDetails.push(...editedDetails);
      }
  
      return updatedRecords;
    });
  
    setIsDataChanged(true);
  };
  
  
  const handleSubmit = async () => {
    dispatch(alertActions.clear());
    try {
      const transformedData = Object.entries(editedRecords).flatMap(([groupID, group]) =>
        group.GroupDetails.map(detail => ({
          CompanyID: data?.GroupData?.MarketerID || 0, // Adjust this based on available data
          AllocationGroupID: parseInt(groupID, 10) || 0,
          NominationDate: detail.ShipmentDate, // Using ShipmentDate as NominationDate
          NominationAmount: detail.NominationValue || 0,
          DrvAmount: detail.DRV_value || 0
        }))

      );
      console.log(transformedData);
      let result;
      if (transformedData.length > 0) {
        result = await dispatch(nominationgroupAction.update(transformedData));
        dispatch(alertActions.success({ message: "Group Nomination Updated Successfully.", header: header, showAfterRedirect: true }));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }

  }




  return (
    <>
      <Typography component="div" className='userprofilelist'>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Typography variant='h2' className='userprofilelistcontent'><span>Nominations By</span> Group</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8 }} >
            <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                    <GroupNominationFilter
                      marketerData={marketerData}
                      marketerGroupData={marketerGroupData}
                      pipelineData={pipelineData}
                      fromDate={fromDate}
                      setFromDate={setFromDate}
                      isAdmin={isAdmin}
                      toDate={toDate}
                      setToDate={setToDate}
                      marketerId={marketerId}
                      setMarketerId={setMarketerId}
                      marketerGroupId={marketerGroupId}
                      setMarketerGroupId={setMarketerGroupId}
                      pipelineID={pipelineID}
                      setPipelineID={setPipelineID}
                      handleFilterSubmit={handleFilterSubmit}
                      isOpen={openComponent === 'filter'}
                      onClose={() => handleCloseBackdrop()}
                      onOpen={() => handleOpenComponent('filter')}
                    />
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>


        </Grid>
      </Typography>
      <>
        <div className={backdropOpen ? 'backdrop' : ''}>
          </div>
          <Box className="PiplineNominationList GroupNominationList">
          <GroupNominationList
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            data={data}
            handleChange={handleChange}
            clearFilter={handleRefresh}
          />
        </Box>
      </>

      <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
        <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className='submitbutton'
          onClick={handleSubmit}
          disabled={!isDataChanged}
        >
          Save
        </Button>
      </Grid>


    </>

  )
}

export default GroupNomination;