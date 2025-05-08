import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Backdrop, CircularProgress, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AnnouncementCenterList from "./AnnouncementCenterList";
import { alertActions, announcementAction } from '_store';
import { ModalPopup } from '_components';


const AnnouncementCenter = () => {
  const dispatch = useDispatch();
  const header = "Announcement";
  const announcementsData = useSelector(x => x.announcement?.allAnnouncements);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const authUser = useSelector(x => x.auth?.value);
  const id = useSelector(x => x.auth?.userId);
  const user = authUser?.Data;
  const userAccess = user?.UserAccess;
  const portalsList = userAccess ? userAccess.map(access => ({
    PortalId: access.PortalId,
    PortalName: access.PortalName,
    PortalKey: access.PortalKey,
  })) : [];

  const portalIdList = portalsList.map(portal => portal.PortalId);

  const portalIds = portalIdList.join(',');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(alertActions.clear());
        const result = await dispatch(announcementAction.getAllAnnouncements({ id, portalIds })).unwrap();
        const dataResult = result?.Data;
        const announcementData = dataResult.AnnouncementData;
        setData(announcementData);
      } catch (error) {
        console.error('Fetch Error:', error); // Log any errors
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch, id, portalIds]);


  const handleToggleActiveStatus = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDeactivation = async () => {
    dispatch(alertActions.clear());
    await handleDelete(selectedRows);
    handleRefresh();
    setConfirmDialogOpen(false);
    dispatch(alertActions.success({ message: "Announcement deleted successfully", header: header }));
  };

  const handleDelete = async (rowsToDelete) => {
    dispatch(alertActions.clear());
    try {
      const transformedData = Array.isArray(rowsToDelete)
        ? rowsToDelete.map((row) => row.ID) // For bulk delete
        : [rowsToDelete.ID]; // For single row delete

      let result;
      result = await dispatch(announcementAction.deleteAllAnnouncement(transformedData));
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: header }));
    }
  };

  const handleRefresh = async () => {
    try {

      const result = await dispatch(announcementAction.getAllAnnouncements({ id, portalIds })).unwrap();
      const dataResult = result?.Data;
      const announcementData = dataResult.AnnouncementData;
      setData(announcementData);
      setSelectedRows([]);
      setRowSelection({});

    } catch (error) {
      console.error('Fetch Error:', error); // Log any errors
      dispatch(alertActions.error({
        message: error?.message || error,
        header: `${header} Failed`
      }));
    }
  };

  return (
    <>
      <Typography component="div" className='userprofilelist '>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography variant="h2" className='userprofilelistcontent'>Announcement Center</Typography>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Typography>
      <div className='MarketerList'>
        <AnnouncementCenterList
          announcementData={data}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          rowSelection={rowSelection}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setRowSelection={setRowSelection}
          handleRefresh={handleRefresh}
          handleToggleActiveStatus={handleToggleActiveStatus}
          handleDelete={handleDelete}
        />
      </div>

      {confirmDialogOpen && <ModalPopup
        header="Announcement"
        message1="Are you sure you want to delete selected announcements?"
        btnPrimaryText="Confirm"
        btnSecondaryText="Cancel"
        handlePrimaryClick={() => handleConfirmDeactivation()}
        handleSecondaryClick={() => setConfirmDialogOpen(false)}
      />
      }
    </>
  );
}

export default AnnouncementCenter;