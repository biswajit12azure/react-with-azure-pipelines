import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alertActions, marketergroupAction } from '_store';
import { marketerGroupGetData } from '_utils/constant';
import MarketerGroupCreate from './MarketerGroupCreate';
import { ModalPopup } from '_components';
import dayjs from 'dayjs';
import MarketerGroupFilter from './MarketerGroupFilter';
import MarketerGroupList from './MarketerGroupList';

const MarketersGroup = () => {
  const header = " Marketer";
  const dispatch = useDispatch();
  // const marketers = marketerGroupGetData.Data;
  const marketers = useSelector(x => x.marketergroup?.marketerGroupList);
  const authUserId = useSelector(x => x.auth?.userId);
  const [data, setData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [editedRowId, setEditedRowId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [marketerId, setMarketerId] = useState(null);
  const [openComponent, setOpenComponent] = useState(null); // State to track which component is open

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        // const result = marketerGroupGetData;
        const result = await dispatch(marketergroupAction.get(0)).unwrap();
        const marketerData = result?.Data;
        setMarketerId(marketerData?.MarketerID);
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
    if (field === 'StartMonth' || field === 'EndMonth') {
      newValue = dayjs(newValue).isValid() ? dayjs(newValue).toISOString() : null;
    }
    setEditedRowId((prev) => {
      const updatedRows = { ...prev };
      if (!updatedRows[rowData.ID]) {
        updatedRows[rowData.ID] = { ...rowData };
      }
      updatedRows[rowData.ID][field] = newValue;
      return updatedRows;
    });
    const newData = data?.MarketerGroups?.map(row => row.ID === rowData.ID ? { ...row, [field]: newValue } : row);
    setData(pre => ({ ...pre, MarketerGroups: [...newData] }));
    setIsDataChanged(true);
  };

  const handleSubmit = async () => {
    dispatch(alertActions.clear());
    try {
      let editedRowData = Object.values(editedRowId);
      const invalidDates = editedRowData.filter(item => !dayjs(item.StartDate).isValid());
      if (invalidDates.length > 0) {
        dispatch(alertActions.error({ message: "One or more dates are invalid. Please correct them before submitting.", header: header }));
        return;
      }

      const transformedData = editedRowData.map((item) => ({
        ID: item.ID,
        GroupName: item.GroupName,
        GroupType: item.GroupType,
        JurisdictionID: item.JurisdictionID,
        StartMonth: dayjs(item.StartMonth).toISOString(),
        EndMonth: dayjs(item.EndMonth).toISOString(),
        BalancingModelID: item.BalancingModelID,
        MarketerID: marketers?.MarketerID
      }));

      let result;
      if (transformedData.length > 0) {
        result = await dispatch(marketergroupAction.update(transformedData));
      }
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      setIsDataChanged(true);
      handleRefresh();
      dispatch(alertActions.success({ message: "Marketed Group data updated Successfully.", header: header, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleFilterSubmit = async (newData) => {
    setData(newData);
    setMarketerId(newData?.MarketerID);
  };

  const handleCancelClick = async () => {
    handleRefresh();
  };

  const handleToggleActiveStatus = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDeactivation = async () => {
    dispatch(alertActions.clear());
    await handleDelete(selectedRows);
    setIsDataChanged(true);
    setConfirmDialogOpen(false);
    dispatch(alertActions.success({ message: "Marketer Groups deleted successfully", header: header }));
  };

  const handleDelete = async (rowsToDelete) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = Array.isArray(rowsToDelete)
        ? rowsToDelete.map((row) => row.ID) // For bulk delete
        : [rowsToDelete.original.original.ID]; // For single row delete

      let result;
      result = await dispatch(marketergroupAction.bulkDelete(transformedData));
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
      await setMarketerId(prevMarketerId => prevMarketerId || marketers?.MarketerID);
      handleRefresh();
      dispatch(alertActions.success({ message: "Marketer Group deleted successfully.", header: header, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleRefresh = async () => {
    const data = {
      GroupName: "",
      StartMonth: null,
      MarketerID: marketerId || marketers?.MarketerID,
      EndMonth: null
    }
    const newData = await dispatch(marketergroupAction.filter(data)).unwrap();
    const marketerData = newData?.Data;
    //const marketerData = marketerGroupGetData.Data;
    setMarketerId(marketerData?.MarketerID);
    setData(marketerData);
    setSelectedRows([]);
    setRowSelection({});
  };

  const handleOpenComponent = (component) => {
    setOpenComponent(prev => prev === component ? null : component);
  };

  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography variant="h2" className='userprofilelistcontent'>Marketer Group Management - <span>{data?.MarketerName}</span></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8 }} >
            <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                    <MarketerGroupFilter
                      marketerId={marketerId}
                      setMarketerId={setMarketerId}
                      marketerData={data?.Marketer}
                      handleFilterSubmit={handleFilterSubmit}
                      isOpen={openComponent === 'filter'}
                      onClose={() => setOpenComponent(null)}
                      onOpen={() => handleOpenComponent('filter')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <MarketerGroupCreate
                      handleRefresh={handleRefresh}
                      marketerGroupData={data}
                      isOpen={openComponent === 'create'}
                      onClose={() => setOpenComponent(null)}
                      onOpen={() => handleOpenComponent('create')}
                    />
                 </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
          </Typography>

          {!(marketers?.loading || marketers?.error) &&
            <>
              <MarketerGroupList
                marketerGroupData={data}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleChange={handleChange}
                rowSelection={rowSelection}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                setRowSelection={setRowSelection}
                handleRefresh={handleRefresh}
                handleDelete={handleDelete}
                handleToggleActiveStatus={handleToggleActiveStatus}
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
                  onClick={handleSubmit}
                  disabled={!isDataChanged}
                >
                  Save
                </Button>
              </Grid>
            </>
          }
          {confirmDialogOpen && <ModalPopup
            header="Marketer"
            message1="Are you sure you want to deactivate selected marketers?"
            btnPrimaryText="Confirm"
            btnSecondaryText="Cancel"
            handlePrimaryClick={handleConfirmDeactivation}
            handleSecondaryClick={() => setConfirmDialogOpen(false)}
          />}
        </>
        );
}

        export default MarketersGroup;