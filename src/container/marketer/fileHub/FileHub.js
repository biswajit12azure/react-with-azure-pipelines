import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, filehubAction, nominationgroupAction, fileHubListActions, uploadUetActions, fileHubDeleteActions } from '_store';
import FileHubFilter from "./FileHubFilter";
import { Typography, Backdrop, CircularProgress, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FileHubList from "./FileHubList";
import { IconButton } from "@material-ui/core";
import { mapCenterValidationSchema } from "_utils/validationSchema";
import { useForm } from 'react-hook-form';
import FileHubUpload from './FIleHubUpload';
// import { marketerGetData } from '_utils/constant';
import { ModalPopup } from '_components';
import { marketerAction } from '_store/marketer.slice';
import dayjs from 'dayjs';
import { AutocompleteInput, UploadFiles, UnderConstruction } from '_components';
import { raphaelinfo, materialsymbolsdownload, downloadIcon } from '../../../images';
import { yupResolver } from '@hookform/resolvers/yup';
import FileType from '../../../assets/files/GetFileType.json';

const FileHub = () => {
  const header = "FileHub";
  const dispatch = useDispatch();
  const marketers = useSelector(x => x.marketer?.marketerList);
  const authUser = useSelector(x => x.auth?.value);
  const authUserId = useSelector(x => x.auth?.userId);
  const marketerData = useSelector(x => x.nominationgroup?.nominationGroupList?.MarketerData);
  const user = authUser?.Data;
  const userAccess = user?.UserAccess;
  const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));
  const [data, setData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [editedRowId, setEditedRowId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openComponent, setOpenComponent] = useState(null); // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [files, setfiles] = useState([]);
  const [nominationData, setNominationData] = useState(null);
  const [MarketerList, setMarketerList] = useState([]);
  const [FileTypesList, setFileTypesList] = useState([]);
  const [ListData, setListData] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState(null);
  const [uploadFileType, setUploadFileType] = useState(null);
  const [uploadUETPayload, setuploadUETPayload] = useState({});
  const [isUETFileUPload, setIsUETFileUPload] = useState(false);
  const [isUETFileDownload, setIsUETFileDownload] = useState(false);
  const [isUETFileDelete, setIsUETFileDelete] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        setFileTypesList(FileType?.Data);
        const result = await dispatch(marketerAction.get()).unwrap();
        const nominationData = result?.Data;
        setNominationData(nominationData);
        fetchFileHubData();
      } catch (error) {
        dispatch(alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`
        }));
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    userAccess.forEach(role => {
      role.RoleAccess.forEach(access => {
        if (access.AccessKey === "UETUploads" && access.IsActive) {
          setIsUETFileUPload(true);
        }
        if (access.AccessKey === "UETDownload" && access.IsActive) {
          setIsUETFileDownload(true);
        }
        if (access.AccessKey === "DeleteUploads" && access.IsActive) {
          setIsUETFileDelete(true);
        }
      });
    });
  }, [])

  const fetchFileHubData = async () => {
    try {
      const resFileHub = await dispatch(fileHubListActions.getFileHubList()).unwrap();
      setData(resFileHub?.Data?.FileHubData);
      setMarketerList(resFileHub?.Data?.MarketerData)
    } catch (error) {
      dispatch(alertActions.error({
        message: error?.message || error,
        header: `${header} Failed`
      }));
    }
  }
  const { register, control, reset, formState: { errors, isValid }, trigger } = useForm({
    resolver: yupResolver(mapCenterValidationSchema)
  });
  const handleChange = (newValue, rowData, field) => {
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
    setIsDataChanged(true);
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

  const handleSave = async (data) => {
    try {
      const transformData = files.map(item => ({
        Base64File: item.File,
        FileName: item.FileName
      }))

      let result;
      if (transformData.length > 0 && uploadFileType === 2) {
        result = await dispatch(filehubAction.update(transformData));
        console.log("aaaaaaaaaaaaaaaaaaaaa", result);
        let data = result?.payload?.Data[0];

        if (data) {
          const message = `
        Number of files processed: ${data.NoOfFilesProcessed}
        Number of worksheets Processed: ${data.NoOfWorkSheetsProcessed}
        Number of worksheets Failed: ${data.NoOfWorksheetFailed}
        Total number of DRVs Processed: ${data.NoOfDRVs}
        Total number of DRVs Failed: ${data.NoOfDRVsFailed}
        Number of blank rows: ${data.NoOfEmptyRows}
        Status: ${data.StatusMessage}
            `;
          dispatch(alertActions.success({ message: message, header: `DRV file uploaded successfully`, showAfterRedirect: true }));
        }
        return
      }

      if (uploadFileType === 1) {
        result = await dispatch(uploadUetActions.uploadUet(uploadUETPayload));
        if (result?.payload?.Succeeded) {
          dispatch(alertActions.success({ message: result?.payload?.Message, header: header, showAfterRedirect: true }));
        }
      }
      fetchFileHubData();
      if (result?.error) {
        dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
        return;
      }
    }
    catch (error) {
      dispatch(alertActions.error({
        message: error?.message || error,
        header: `${header} Failed`
      }));
    }
  };

  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };

  const handleCancelClick = async () => {
    handleRefresh();
  };

  const handleDownload = () => {
    selectedRows.forEach((item) => {
      const fileData = item.FileData[0];
      const fileUrl = fileData.Url;
      const fileName = fileData.FileName;
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
      } else {
        dispatch(alertActions.error({ message: "File URL not found for file:", header: 'File Download' }));
      }
    });
  };

  const handleDelete = async (data) => {
    try {
      const response = await dispatch(fileHubDeleteActions.deleteFileHub(data?.FileHubID)).unwrap();
      if (response?.result?.Succeeded) {

        dispatch(alertActions.success({ message: response?.message, header: 'Delete', showAfterRedirect: true }));
      }
    }
    catch (error) {
      const errorMessage = error?.payload?.errors?.fileHubID
        ? error.payload.errors.fileHubID[0]
        : error.message || "An unknown error occurred";
      dispatch(alertActions.error({ message: errorMessage, header }));
    }
  }



  const handleConfirmDeactivation = async () => {
    dispatch(alertActions.clear());
    selectedRows.forEach(row => {
      handleChange(false, row, 'IsActive');
    });

    const transformedData = selectedRows.map((item) => ({
      MarketerID: item.MarketerID,
      IsActive: false
    }));
    await handleToggleStatusSubmit(transformedData);
    setIsDataChanged(true);
    setConfirmDialogOpen(false);
    dispatch(alertActions.success({ message: "Marketers deactivated successfully", header: header }));
  };

  const handleLockToggle = async (row) => {
    dispatch(alertActions.clear());
    const transformedData = [{
      MarketerID: row.original.MarketerID,
      IsActive: !row.original.IsActive
    }];

    await handleToggleStatusSubmit(transformedData);
    setIsDataChanged(true);
    const message = row.original.IsActive ? "Marketers deactivated successfully" : "Marketers activated successfully";
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
          <Grid size={{ xs: 12, sm: 4, md: 8 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className='userprofilelistcontent'>File hub </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 8 }} >
                <Grid container spacing={2} justifyContent="flex-end" className="MarketerManagement">
                  <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                        <FileHubFilter
                          handleFilterSubmit={handleFilterSubmit}
                          isOpen={openComponent === 'filter'}
                          onClose={handleCloseBackdrop}
                          onOpen={() => handleOpenComponent('filter')}
                        />
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }} ></Grid>
        </Grid>
      </Typography>
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
          <div className={backdropOpen ? 'backdrop' : ''}>
          </div>
          <div className='MarketerList'>
            <FileHubList
              marketerData={data}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onLockToggle={handleLockToggle}
              handleChange={handleChange}
              rowSelection={rowSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setRowSelection={setRowSelection}
              handleRefresh={handleRefresh}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              isEnableDownload={isUETFileDownload}
              isEnableDelete={isUETFileDelete}
            />
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Typography component="div" className="UploadFiles-container mapcontainer">
            <FileHubUpload
              isAdmin={isAdmin}
              marketerGridData={data}
              marketerData={MarketerList}
              DocumentTypes={FileTypesList}
              setIsDataChanged={setIsDataChanged}
              setfiles={setfiles}
              onSubmit={handleSave}
              setUploadFileType={setUploadFileType}
              setuploadUETPayload={setuploadUETPayload}
              isEnableUpload={isUETFileUPload}
            />
          </Typography>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
        <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className='submitbutton'
          onClick={() => handleSave()}
          disabled={!isDataChanged}
        >
          Save
        </Button>
      </Grid>

      {confirmDialogOpen && <ModalPopup
        header="Marketer"
        message1="Are you sure you want to deactivate selected marketers?"
        btnPrimaryText="Confirm"
        btnSecondaryText="Cancel"
        handlePrimaryClick={() => handleConfirmDeactivation()}
        handleSecondaryClick={() => setConfirmDialogOpen(false)}
      />
      }
    </>
  );
}

export default FileHub;