
import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Lock, LockOpen } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DropdownTableInput, DeleteButton, CommonConfimationmodal } from '_components';
import { UserFilter } from "container/admin";
import UserProfileDetails from './UserProfileDetails';
import { Delete , Deletewhite } from 'images';
import UserProfileDetailsMC from './UserProfileDetailsMC';
import { alertActions, authActions } from '_store';
import { useDispatch } from 'react-redux';

const UserProfileList = ({ portalData, userProfiles, handleFilterSubmit, handleChange, portalId, setPortalId, isModalOpen, setIsModalOpen, onLockToggle, handleDelete, handleReject, singleUserUpdate }) => {
  const dispatch = useDispatch();
  const roles = userProfiles?.Roles?.map(role => ({ value: role.RoleID, label: role.RoleName })) || [];
  const statuses = userProfiles?.Statuses?.map(status => ({ value: status.StatusID, label: status.StatusName })) || [];
  const agencies = userProfiles?.Agency?.map(agency => ({ value: agency.AgencyID, label: agency.AgencyName })) || [];
  const jurisdictions = userProfiles?.Jurisdictions?.map(jurisdiction => ({ value: jurisdiction.JurisdictionID, label: jurisdiction.JurisdictionName })) || [];
  const marketers = userProfiles?.Marketer?.map(marketer => ({ value: marketer.MarketerID, label: marketer.MarketerName })) || [];
  const data = userProfiles?.User || [];

  const [displayPortalName, setDisplayPortalName] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const name = portalData?.find((item) => item.PortalId === portalId);
    const portalName = name?.PortalName;
    setDisplayPortalName(portalName);
  }, [userProfiles, portalId])

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleportal = (data) => {
    setPortalId(data?.PortalId);
  };
  const changePortalName = (value) => {
    setPortalId(value);
  }

  const handleRowDelete = (row) => {
    handleDelete(row);
    setSelectedRows([]);
    setRowSelection({});
  };
  const handleBulkDelete = () => {
    handleDelete(selectedRows);
    setSelectedRows([]);
    setRowSelection({});
  };

  const handleResetPassword = async (email) => {
    dispatch(alertActions.clear());
    try {
      const result = await dispatch(authActions.forgotPasswordRequest({ email }));
      if (result?.error) {
        dispatch(alertActions.error({
          showAfterRedirect: true,
          message: result?.error.message,
          header: "User Profile"
        }));
        return;
      }
      dispatch(alertActions.success({
        showAfterRedirect: true,
        message: "ResetPassword link sent to the User",
        header: "User Profile"
      }));
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: "User Profile" }));
    }
  }

  const columns = useMemo(() => {
    const baseColumns = [{
      accessorKey: 'EmailID', header: 'Email',
      enableEditing: false,
      Cell: ({ row }) => (
        <span onClick={() => handleAddEdit(row)} >
          {row.original.EmailID}
        </span>
      ),
    },
    {
      accessorKey: 'RoleID',
      header: 'Role',
      id: 'RoleID',
      enableColumnFilter: false, // Disable filtering for this column
      Cell: ({ row, column }) => {
        const columnKey = column.id || column.accessorKey;
        return (
          <DropdownTableInput
            value={row.original[columnKey]}
            label={`Select ${column.columnDef.header}`}
            onChange={(value) => handleChange(value, row.original, columnKey)}
            options={roles}
          />
        )
      }
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      enableEditing: false
    }];
    if (portalId === 1) {
      baseColumns.push({
        accessorKey: 'AgencyID',
        header: 'Agency',
        id: "AgencyID",
        enableColumnFilter: false, // Disable filtering for this column
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.AgencyID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={agencies}
            />
          )
        }
      })
    }
    if (portalId === 2) {
      baseColumns.push({
        accessorKey: 'JurisdictionID',
        header: 'Jurisdiction',
        id: 'JurisdictionID',
        enableColumnFilter: false, // Disable filtering for this column
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.JurisdictionID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={jurisdictions}
            />
          )
        }
      }, {
        accessorKey: 'AgencyID',
        header: 'Agency',
        id: 'AgencyID',
        enableColumnFilter: false, // Disable filtering for this column
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.AgencyID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={agencies}
            />
          )
        }
      })
    }
    if (portalId === 4) {
      baseColumns.push({
        accessorKey: 'MarketerID',
        header: 'Marketer',
        id: 'MarketerID',
        enableColumnFilter: false, // Disable filtering for this column
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.MarketerID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={marketers}
            />
          )
        }
      })
    }
    return baseColumns;
  }, [handleChange, roles, statuses, agencies]);

  const handleAddEdit = (row) => {
    row.toggleExpanded();
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableHiding: false,
    enableGlobalFilter: true,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    paginationDisplayMode: 'pages',
    enableRowActions: true,
    enableRowSelection: true,
    enableExpandAll: false,
    positionExpandColumn: 'first',
    positionActionsColumn: "last",
    positionToolbarAlertBanner: 'none',
    state: {
      rowSelection,
    },
    getRowId: (row) => row.UserId, // Ensure unique IDs for rows
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection); // Update row selection state
    },
    displayColumnDefOptions: {
      'mrt-row-expand': {
        header: "",
        size: 10,//make the expand column wider
      }
    },
    initialState: {
      columnOrder: [
        'mrt-row-expand',
        'mrt-row-select',
        'EmailID',
        'RoleID',
        'AgencyID',
        'JurisdictionID',
        "MarketerID",
        'Status',
        'mrt-row-actions' // Ensure this is included at the end
      ],
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Tooltip title=" Delete Selected" className='DeleteSelected'>
          <div>
            <IconButton className='delete' onClick={handleBulkDelete} disabled={selectedRows.length === 0}>
              <img src={Deletewhite} alt="Delete"  ></img>
            </IconButton>
          </div>
        </Tooltip>
      </Box>
    ),
    renderRowActions: ({ row }) => {
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }} className='tableicons'>
          <IconButton onClick={() => onLockToggle(row)} className='lock'>
            {row.original.IsAccountLock ? <Lock /> : <LockOpen />}
          </IconButton>
          <IconButton className='delete' >
            <img src={Delete} alt="Delete" onClick={handleOpenModal}></img>
          </IconButton>
          <CommonConfimationmodal
            open={isModalOpen}
            title="Profile Delete"
            description="Are you sure you want to Delete this profile?"
            onConfirm={() => handleRowDelete({ original: row })}
            onCancel={handleCloseModal}
          />
        </div>
      )
    },
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
        {portalId === 3 ?
          <UserProfileDetailsMC userData={row.original} rowid={row.original.UserId} roles={roles} handleReject={handleReject} singleUserUpdate={singleUserUpdate} handleResetPassword={handleResetPassword} />
          :
          <UserProfileDetails userData={row.original} rowid={row.original.UserId} roles={roles} handleReject={handleReject} singleUserUpdate={singleUserUpdate} handleResetPassword={handleResetPassword} />
        }
      </Box>
    ),
    muiExpandButtonProps: {
      sx: {
        display: 'none',
      },
    },
  });

  useEffect(() => {
    // This effect runs when rowSelection state is updated
    const selectedFlatRows = table.getSelectedRowModel().flatRows;
    setSelectedRows(selectedFlatRows.map((row) => row.original)); // Extract original row data
  }, [rowSelection, table]); // Re-run when rowSelection changes

  return (
    <>
      <Typography component="div" className='userprofilelist'>
        <Grid container direction="row" spacing={2} >
          <Grid size={{ xs: 12, sm: 6, md: 4 }}  >
            <Grid container  >
              <Grid size={{ xs: 12, sm: 12, md: 12 }}  >
                <Typography variant="h2" className='userprofilelistcontent'> User Management - <span>{displayPortalName}</span></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 8 }} className="PortalName" >
            <Grid container spacing={2} className="justifyContent">
              {/* <Grid size={{ xs: 6, sm: 6, md: 6 }}  >
                <DeleteButton
                  onDelete={handleBulkDelete}
                  disabled={selectedRows.length === 0}
                />
              </Grid> */}
              <Grid size={{ xs: 6, sm: 6, md: 6 }}  >
                <UserFilter portalsList={portalData} handleFilterSubmit={handleFilterSubmit} statuses={statuses} handleportal={handleportal} changePortalName={changePortalName} />
                {/* <Download rows={data} headers={columns} filename={filename} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Typography>
      <MaterialReactTable table={table} />
    </>
  );
};

export default UserProfileList;