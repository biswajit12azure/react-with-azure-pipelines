import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileList } from "container/admin";
import { Button } from '@material-ui/core';
import Grid from '@mui/material/Grid2';
import { userProfileAction, alertActions, } from '_store';

const Users = () => {
  const header = " User Profile";
  const dispatch = useDispatch();
  const userProfiles = useSelector(x => x.userProfile?.userProfileData);
  const [data, setData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const authUser = useSelector(x => x.auth?.value);
  const user = authUser?.Data;

  const adminList = user?.UserAccess?.filter(access => access.Role.toLowerCase() === "admin");

  const portalData = adminList ? adminList?.map(admin => ({
    PortalId: admin.PortalId,
    PortalName: admin.PortalName,
    PortalKey: admin.PortalKey,
  })) : [];

  const defaultPortalId = portalData ? portalData[0]?.PortalId : 0;
  const [portalId, setPortalId] = useState(defaultPortalId);
  const [editedRowId, setEditedRowId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authUserId = useSelector(x => x.auth?.userId);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const result = await dispatch(userProfileAction.getUserProfile(portalId)).unwrap();
        const userProfileDetails = result?.Data;
        setData(userProfileDetails);
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch]);

  // Toggle lock/unlock for a specific userId
  const handleLockToggle = async (row) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = {
        UserId: row.original.UserID,
        CreatedBy: authUserId.toString()
      }
      let result;
      if (transformedData) {
        result = await dispatch(userProfileAction.lockProfile(transformedData));
      }

      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      dispatch(alertActions.success({ message: "User Profile Unlocked Successfully.", header: header, showAfterRedirect: true }));
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }

  };

  const handleReject = async (user) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = {
        UserID: user?.UserID,
        CreatedBy: authUserId.toString()
      }
      let result;
      if (transformedData) {
        result = await dispatch(userProfileAction.rejectUser(transformedData));
      }

      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      dispatch(alertActions.success({ message: "User Profile Rejected Successfully.", header: header, showAfterRedirect: true }));
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }

  }

  const handleChange = (newValue, rowData, field) => {
    setEditedRowId((prev) => {
      const updatedRows = { ...prev };
      if (!updatedRows[rowData.UserID]) {
        updatedRows[rowData.UserID] = { ...rowData };
      }
      updatedRows[rowData.UserID][field] = newValue;
      return updatedRows;
    });
    const newData = data?.User?.map(row => row.UserID === rowData.UserID ? { ...row, [field]: newValue } : row);
    setData(pre => ({ ...pre, User: [...newData] }));
    setIsDataChanged(true); // Set data changed to true
  };

  const singleUserUpdate = (rowData) => {
    handleSubmit(true, rowData);
  }

  const handleDelete = async (rowsToDelete) => {
    dispatch(alertActions.clear());
    try {
      const userIdsToDelete = Array.isArray(rowsToDelete)
        ? rowsToDelete.map((row) => row.UserID) // For bulk delete
        : [rowsToDelete.original.original.UserID]; // For single row delete

      // // Filter out the individual row to be delete
      setIsModalOpen(false);

      // Get the deleted profiles for transformation
      const deletedProfiles = userProfiles?.User?.filter((item) =>
        userIdsToDelete.includes(item.UserID)
      );

      // Transform the deleted profiles for further processing
      const transformedData = deletedProfiles.map((item) => ({
        UserID: item.UserID,
        UpdatedBy: authUserId.toString()
      }));
      let result;

      if (transformedData.length > 0) {
        result = await dispatch(userProfileAction.delete(transformedData));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }

      handleRefresh();
      dispatch(alertActions.success({ message: "User Profile Deleted Successfully.", header: header, showAfterRedirect: true }));
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleSubmit = async (isSingle = false, singleRowData = null) => {
    dispatch(alertActions.clear());
    try {
      let editedRowData;

      if (isSingle && singleRowData) {
        // Handle a single object update
        editedRowData = [singleRowData]; // Wrap in an array for consistency
      } else {
        // Handle multiple object updates
        editedRowData = Object.values(editedRowId);
      }
      const transformedData = editedRowData.map((item) => ({
        MappingID: item.MappingID || 0,
        UserID: item.UserID,
        PortalID: portalId,
        RoleID: item.RoleID,
        AgencyID: item.AgencyID,
        UpdatedBy: authUserId.toString()
      }))

      let result;
      if (transformedData.length > 0) {
        result = await dispatch(userProfileAction.update(transformedData));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      setIsDataChanged(true); // Set data changed to true
      dispatch(alertActions.success({ message: "User Profile Assigned and Approved Successfully.", header: header, showAfterRedirect: true }));
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };

  const handleRefresh = async () => {
    const data = { PortalId: portalId };
    const newData = await dispatch(userProfileAction.filter(data)).unwrap();
    setData(newData?.Data);
  }

  const handleCancelClick = async () => {
    handleRefresh();
  };

  return (
    <>
      {!(userProfiles?.loading || userProfiles?.error) &&
        <>
          <UserProfileList
            portalData={portalData}
            userProfiles={data}
            portalId={portalId}
            setPortalId={setPortalId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleDelete={handleDelete}
            handleReject={handleReject}
            onLockToggle={handleLockToggle}
            handleChange={handleChange}
            singleUserUpdate={singleUserUpdate}
            handleFilterSubmit={handleFilterSubmit}
          />
          <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
            <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className='submitbutton'
              onClick={() => handleSubmit()}
              disabled={!isDataChanged} // Disable button if no data change
            >
              Save
            </Button>
          </Grid>
        </>
      }
    </>
  );
};

export default Users;