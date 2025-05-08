import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MarketerFilter from "./MarketerFilter";
import {  Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MarketerList from "./MarketerList";
import { alertActions } from '_store';
// import { marketerGetData } from '_utils/constant';
import MarketerCreate from './MarketerCreate';
import {  ModalPopup } from '_components';
import { marketerAction } from '_store/marketer.slice';
import dayjs from 'dayjs';

const Marketers = () => {
  const header = " Marketer";
  const dispatch = useDispatch();
  const marketers = useSelector(x => x.marketer?.marketerList);
  // const authUserId = useSelector(x => x.auth?.userId);
  const [data, setData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [editedRowId, setEditedRowId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openComponent, setOpenComponent] = useState(null); // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [isActivate,setIsActivate] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        const result = await dispatch(marketerAction.get()).unwrap();
        const marketerData = result?.Data;
        // const result = null;//await dispatch(marketerAction.get()).unwrap();
        // const marketerData = marketerGetData?.Data;
        setData(marketerData);
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChange = (newValue, rowData, field) => {

    if ((field == "ServiceProvider" || field == "MarketerName") && (newValue == null || newValue == "")) {
      setIsDataChanged(false);
    } else {
      setIsDataChanged(true);
    }
    setEditedRowId((prev) => {
      const updatedRows = { ...prev };
      if (!updatedRows[rowData.MarketerID]) {
        updatedRows[rowData.MarketerID] = { ...rowData };
      }
      updatedRows[rowData.MarketerID][field] = newValue;
      return updatedRows;
    });
    const newData = data?.Marketers?.map(row => row.MarketerID === rowData.MarketerID ? { ...row, [field]: newValue } : row);
    setData(pre => ({ ...pre, Marketers: [...newData] }));
  };

  const handleToggleStatusSubmit = async (data) => {
    try {
      let result;
      if (data) {
        result = await dispatch(marketerAction.deactivate(data));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };
  
const hasEmptyMarketerNameOrServiceProvider = (arr) => arr.some(item => !item.MarketerName || item.ServiceProvider === '');
  console.log("hasEmptyMarketerNameOrServiceProvider",hasEmptyMarketerNameOrServiceProvider)
  

  const handleSubmit = async () => {
    dispatch(alertActions.clear());
    try {
      let editedRowData = Object.values(editedRowId);
      if(hasEmptyMarketerNameOrServiceProvider(editedRowData)){
        dispatch(alertActions.error({ message: "Enter the required fields.", header: header }));
        return;
      }
      const invalidDates = editedRowData.filter(item => !dayjs(item.StartDate).isValid());
      if (invalidDates.length > 0) {
        dispatch(alertActions.error({ message: "One or more dates are invalid. Please correct them before submitting.", header: header }));
        return;
      }

      const duplicateNames = editedRowData
        .filter(newItem =>
          marketers?.Marketers.some(oldItem => oldItem.MarketerName === newItem.MarketerName && oldItem.MarketerID !== newItem.MarketerID)
        )
        .map(item => item.MarketerName);

      if (duplicateNames.length > 0) {
        dispatch(alertActions.error({ message: `The following marketer names already exist: ${duplicateNames.join(', ')}. Please use unique names.`, header: header }));
        return;
      }

      const transformedData = editedRowData.map((item) => ({
        MarketerID: item.MarketerID,
        PortalID: item.PortalID,
        MarketerName: item.MarketerName,
        MarketerDescription: item.MarketerName,
        StartDate: dayjs(item.StartDate).format('YYYY-MM-DDTHH:mm:ss'),
        ServiceProvider: Number(item.ServiceProvider),
        UETFileID: item.UETFileID,
        IsActive: item.IsActive
      }));
      let result;
      if (transformedData.length > 0) {
        result = await dispatch(marketerAction.update(transformedData));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      handleRefresh();
      dispatch(alertActions.success({ message: "Marketed data updated Successfully.", header: header, showAfterRedirect: true }));
      setIsDataChanged(false);
    }
    catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };

  const handleCancelClick = async () => {
    handleRefresh();
    setIsDataChanged(false);
  };
useEffect(()=>{
  if(selectedRows){
    let Active = selectedRows.some(row => row.IsActive);
    let DeActive = selectedRows.some(row => !row.IsActive);
    if(Active && DeActive){
      setIsActivate(true);
    }else if(Active){
      setIsActivate(true);
    }else{
      setIsActivate(false);
    }
    console.log("Active",Active);
    console.log("DeActive",DeActive);
  }

},[selectedRows])

  const handleToggleActiveStatus = () => {
    let inActive = selectedRows.some(row => row.IsActive);
    let DeActive = selectedRows.some(row => !row.IsActive);
    console.log("Active",inActive);
    console.log("DeActive",DeActive);
    if (inActive && DeActive) {
      dispatch(alertActions.error({ message: "Please deselect inactive marketers to proceed", header: header }));
    } else {
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDeactivation = async () => {
    dispatch(alertActions.clear());
    selectedRows.forEach(row => {
      handleChange(false, row, 'IsActive');
    });
  if(selectedRows?.some(row => row?.IsActive)){
    const transformedData = selectedRows?.map((item) => ({
      MarketerID: item.MarketerID,
      IsActive: !item.IsActive
    }));
    await handleToggleStatusSubmit(transformedData);
    setIsDataChanged(true);
    setConfirmDialogOpen(false);
    dispatch(alertActions.success({ message: "Marketers deactivated successfully", header: header }));
  }else{

  
    const transformedData = selectedRows.map((item) => ({
      MarketerID: item.MarketerID,
      IsActive: !item.IsActive
    }));
    await handleToggleStatusSubmit(transformedData);
    setIsDataChanged(true);
    setConfirmDialogOpen(false);
    dispatch(alertActions.success({ message: "Marketers activated successfully", header: header }));
  }
  };

  const handleLockToggle = async (row) => {
    dispatch(alertActions.clear());
    const transformedData = [{
      MarketerID: row.original.MarketerID,
      IsActive: !row.original.IsActive
    }];

    await handleToggleStatusSubmit(transformedData);
    setIsDataChanged(true);
    const message = row.original.IsActive ? "Marketer deactivated successfully" : "Marketer activated successfully";
    dispatch(alertActions.success({ message: message, header: header }));
  };

  const handleRefresh = async () => {
    const result = await dispatch(marketerAction.get()).unwrap();
    const marketerData = result?.Data;
    setData(marketerData);
    setSelectedRows([]);
    setRowSelection({});
  };

  const handleOpenComponent = (component) => {
    setOpenComponent(prev => prev === component ? null : component);
    setBackdropOpen(prev => prev === component ? false : true); // Toggle backdrop
  };

  const handleCloseBackdrop = () => {
    setBackdropOpen(false);
    setOpenComponent(null);
  };


  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography variant="h2" className='userprofilelistcontent'>Marketer Management</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8 }} >
            <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                    <MarketerFilter
                      handleFilterSubmit={handleFilterSubmit}
                      isOpen={openComponent === 'filter'}
                      onClose={handleCloseBackdrop}
                      onOpen={() => handleOpenComponent('filter')}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                    <MarketerCreate
                      marketers={marketers}
                      uetFileData={data?.UETFileDate}
                      isOpen={openComponent === 'create'}
                      onClose={handleCloseBackdrop}
                      onOpen={() => handleOpenComponent('create')}
                      handleRefresh={handleRefresh}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Typography>
      <div className={backdropOpen ? 'backdrop' : ''}>
        </div>
        <div className='MarketerList'>
      <MarketerList
        marketerData={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onLockToggle={handleLockToggle}
        handleChange={handleChange}
        rowSelection={rowSelection}
        isActivate={isActivate}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setRowSelection={setRowSelection}
        handleRefresh={handleRefresh}
        handleToggleActiveStatus={handleToggleActiveStatus}
      />
      
      </div>
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
          disabled={!isDataChanged}
        >
          Save
        </Button>
      </Grid>

      {confirmDialogOpen && <ModalPopup
        header="Marketer"
        message1={selectedRows.some(row => row.IsActive) ?"Are you sure you want to deactivate selected marketers?":"Are you sure you want to activate selected marketers?"}
        btnPrimaryText="Confirm"
        btnSecondaryText="Cancel"
        handlePrimaryClick={() => handleConfirmDeactivation()}
        handleSecondaryClick={() => setConfirmDialogOpen(false)}
      />
      }
    </>
  );
}

export default Marketers;