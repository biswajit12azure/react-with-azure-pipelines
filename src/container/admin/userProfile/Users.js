import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileList } from "container/admin";
import { Button } from '@material-ui/core';
import Grid from '@mui/material/Grid2';
import { userProfileAction, alertActions, } from '_store';
import UserProfileDetailsMCAdmin from './profiles/UserProfileDetailsMCAdmin';
import { useParams } from 'react-router-dom';

const Users = () => {
  const header = " User Profile";
  const dispatch = useDispatch();

  const { portal } = useParams();
  const portalId = Number(portal);

  const [data, setData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailSection, setshowDetailSection] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [editedRowId, setEditedRowId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const authUser = useSelector(x => x.auth?.value);
  const userProfiles = useSelector(x => x.userProfile?.userProfileData);

  const user = authUser?.Data;
  const userdetails = user?.UserDetails;
  const userAccess= user?.UserAccess;
  const authUserName = `${userdetails.FirstName} ${userdetails.LastName}`;
  const isReviewer = userAccess?.some(access => access.Role.toLowerCase().includes('reviewer'));
  const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));

  const adminList = userAccess?.filter(access =>
    ["admin", "reviewer"].includes(access.Role.toLowerCase())
  );

  const portalData = adminList ? adminList?.map(admin => ({
    PortalId: admin.PortalId,
    PortalName: admin.PortalName,
    PortalKey: admin.PortalKey,
  })) : [];
  sessionStorage.setItem('portalID', 98);
  // const defaultPortalId = portalData ? portalData[0]?.PortalId : 0;
  // const [portalId, setPortalId] = useState(defaultPortalId);

  // const authUserId = useSelector(x => x.auth?.userId);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const result = await dispatch(userProfileAction.getUserProfile(portalId)).unwrap();
        const userProfileDetails = result?.Data;
        setData(userProfileDetails);
        handleRefresh();
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch, portalId]);

  // Toggle lock/unlock for a specific userId
  const handleLockToggle = async (row) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = {
        UserId: row.UserID,
        CreatedBy: authUserName
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

  const handleReject = async (user,reason,comments) => {
    dispatch(alertActions.clear());
    console.log(user);
    console.log(reason);
    console.log(comments);
    try {
      const transformedData = {
        UserID: user?.UserID,
        RejectionReasonID: reason,
        RejectionComment: comments,
        UpdatedBy: authUserName
        // CreatedBy: authUserName
      }
      console.log(transformedData);
      let result;
      if (transformedData) {
        result = await dispatch(userProfileAction.rejectUser(transformedData));
      }

      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      dispatch(alertActions.success({ message: "Registration request rejected.", header: header, showAfterRedirect: true }));
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
    const newData = data?.User?.map(row => row.UserID === rowData.UserID ? { ...row, [field]: newValue, isEdited: true } : row);
    setData(pre => ({ ...pre, User: [...newData] }));
    setIsDataChanged(true); // Set data changed to true
  };

  const singleUserUpdate = (rowData) => {
    handleSubmit(true, rowData);
  }

  const handleDelete = async (rowsToDelete) => {
    console.log('hasgdagdjgsdj',rowsToDelete);
    dispatch(alertActions.clear());
    try {
      const userIdsToDelete = Array.isArray(rowsToDelete)
        ? rowsToDelete.map((row) => row.UserID) // For bulk delete
        : [rowsToDelete.original.UserID]; // For single row delete
      // // Filter out the individual row to be delete

      setIsModalOpen(false);

      // Get the deleted profiles for transformation
      const deletedProfiles = userProfiles?.User?.filter((item) =>
        userIdsToDelete.includes(item.UserID)
      );

      // Transform the deleted profiles for further processing
      const transformedData = deletedProfiles.map((item) => ({
        UserID: item.UserID,
        UpdatedBy: authUserName
      }));
      let result;

      if (transformedData.length > 0) {
        result = await dispatch(userProfileAction.delete(transformedData));
        dispatch(alertActions.success({ message: "User deleted successfully", header: header, showAfterRedirect: true }));
        handleRefresh();
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }

      
     
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleSubmit = async (isSingle = false, singleRowData = null) => {
    dispatch(alertActions.clear());
    try {
      let editedRowData;
      let selectedUsers;

      if (isSingle && singleRowData) {
        // Handle a single object update
        editedRowData = [singleRowData]; // Wrap in an array for consistency
        selectedUsers = editedRowData;
      } else {
        // Handle multiple object updates
        editedRowData = Object.values(editedRowId);
     
       selectedUsers = editedRowData
        .filter(newItem =>
          selectedRows.some(oldItem => oldItem.UserID === newItem.UserID)
        ).map(item => item);
       console.log('selectedUserId', selectedUsers);
      }
      const transformedData = (Array.isArray(selectedUsers) ? selectedUsers : []).map((item) => ({
        MappingID: item.MappingID || 0,
        UserID: item.UserID,
        CompanyName: item.CompanyName,
        PortalID: portalId,
        RoleID: item.RoleID || 0,
        AgencyID: item.AgencyID || '',
        JurisdictionID: item.JurisdictionID || '',
        MarketerID: item.MarketerID || 0,
        UpdatedBy: authUserName
      }))
console.log("fSAFDAFSHDFSAD",transformedData);
      let result="abc";
      if (transformedData.length > 0) {
        result = await dispatch(userProfileAction.update(transformedData));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      dispatch(alertActions.success({ message: result?.payload?.Message, header: header, showAfterRedirect: true }));
    }
    catch (error) {
      handleRefresh();
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
    setIsDataChanged(false);
    setSelectedUser(null);
    setshowDetailSection(false);
    setSelectedRows([]);
    setRowSelection({});
    setEditedRowId({});
  }

  const handleCancelClick = async () => {
    handleRefresh();
  };

  return (
    <>
      {/* {!(userProfiles?.loading || userProfiles?.error) && */}
      <>
        {!showDetailSection && (<>
          <UserProfileList
            portalData={portalData}
            userProfiles={data}
            portalId={portalId}
            // setPortalId={setPortalId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleDelete={handleDelete}
            handleReject={handleReject}
            onLockToggle={handleLockToggle}
            handleChange={handleChange}
            singleUserUpdate={singleUserUpdate}
            handleFilterSubmit={handleFilterSubmit}
            setSelectedUser={setSelectedUser}
            setshowDetailSection={setshowDetailSection}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRefresh={handleRefresh}
            isAdmin={isAdmin}
            isReviewer={isReviewer}
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
              // disabled={!isDataChanged} >
             disabled={selectedRows.length === 0 || !isDataChanged}> 
              Save
            </Button>
          </Grid>
        </>)}
        {showDetailSection &&
          <UserProfileDetailsMCAdmin selectedUser={selectedUser} setSelectedUser={setSelectedUser} setshowDetailSection={setshowDetailSection} handleReject={handleReject} handleRefresh={handleRefresh} />
        }
      </>
      {/* } */}
    </>
  );
};

export default Users;