
import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { FilterListOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Tooltip, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DropdownTableInput, MultiSelectMenu, ModalPopup } from '_components';
import { UserFilter } from "container/admin";
import UserProfileDetails from './UserProfileDetails';
import { Delete, Deletewhite } from 'images';
import UserProfileDetailsMC from './UserProfileDetailsMC';
import { alertActions, authActions } from '_store';
import { useDispatch } from 'react-redux';
import { ReactComponent as OrderDescendingIcon } from 'assets/images/tdesignorderdescending.svg';

export const CustomSortIcon = (props) => <OrderDescendingIcon {...props} />;

const UserProfileList = ({ portalData, userProfiles, handleFilterSubmit, handleChange, portalId, setPortalId, isModalOpen, setIsModalOpen, onLockToggle,
  handleDelete, handleReject, singleUserUpdate, setSelectedUser, setshowDetailSection,
  rowSelection, setRowSelection, selectedRows, setSelectedRows, handleRefresh, isAdmin, isReviewer
}) => {
  const dispatch = useDispatch();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openComponent, setOpenComponent] = useState(null); // State to track which component is open
  const [backdropOpen, setBackdropOpen] = useState(false);
  const roles = userProfiles?.Roles?.map(role => ({ value: role.RoleID, label: role.RoleName })) || [];
  const statuses = userProfiles?.Statuses?.map(status => ({ value: status.StatusID, label: status.StatusName })) || [];
  const agencies = userProfiles?.Agency?.map(agency => ({ value: agency.AgencyID.toString(), label: agency.AgencyName })) || [];
  const jurisdictions = userProfiles?.Jurisdictions?.map(jurisdiction => ({ value: jurisdiction.JurisdictionID.toString(), label: jurisdiction.JurisdictionName })) || [];
  const marketers = userProfiles?.Marketer?.map(marketer => ({ value: marketer.MarketerID, label: marketer.MarketerName })) || [];
  const data = userProfiles?.User || [];

  const [displayPortalName, setDisplayPortalName] = useState('');
  const [openRowId, setOpenRowId] = useState(null);
  const [selectedRowForDelete, setSelectedRowForDelete] = useState(null);
  useEffect(() => {
    const name = portalData?.find((item) => item.PortalId === portalId);
    const portalName = name?.PortalName;
    setDisplayPortalName(portalName);
    table.setPageIndex(0);
  }, [portalId])

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenComponent = (component) => {
    setOpenComponent(prev => prev === component ? null : component);
    setBackdropOpen(prev => prev === component ? false : true); // Toggle backdrop
  };

  const handleCloseBackdrop = () => {
    setBackdropOpen(false);
    setOpenComponent(null);
  };

  const handleportal = (data) => {
    //  setPortalId(data?.PortalId);
  };
  const changePortalName = (value) => {
    //setPortalId(value);
  }

  const handleRowDelete = (row) => {
    console.log("ajsdhjsahdjsahd",row);
    console.log("selectedRowForDelete",selectedRowForDelete);
    handleDelete({original:selectedRowForDelete});
    setSelectedRows([]);
    setRowSelection({});
  };
  useEffect(() => {
    // Reset openRowId when new data is loaded
    setOpenRowId(null);
  }, [portalId]);
  const handleRowExpandToggle = (row) => {
    // If the row clicked is already expanded, close it
    if (openRowId === row.id) {
      setOpenRowId(null); 
      // Collapse if clicked again
    } else {
      
      setOpenRowId(row.id); // Expand the clicked row
      row.toggleExpanded(row.id); 
    }
  };

  const handleBulkDelete = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDeactivation = async () => {
    dispatch(alertActions.clear());
    handleDelete(selectedRows);
    setSelectedRows([]);
    setRowSelection({});
    setConfirmDialogOpen(false);
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
        message: "A password reset link has been sent to the user's registered email address.",
        header: "User Profile"
      }));
    } catch (error) {
      dispatch(alertActions.error({ message: error?.message || error, header: "User Profile" }));
    }
  }

  const columns = useMemo(() => {
    // const isRowSelected = Object.keys(rowSelection).length > 0;
    const baseColumns = [{
      accessorKey: 'EmailID', header: 'Email Address',
      enableEditing: false,
      size: 150, // Fixed width
      minSize: 100, // Minimum width
      maxSize: 200, // Maximum width
      muiTableBodyCellProps: {
        sx: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 200,
        }
      },
      muiTableHeadCellProps: {
        sx: {
          fontWeight: 'bold',
          textAlign: 'left',
          maxWidth: 200,
        }
      },
      Cell: ({ row }) => {
        const email = row.original.EmailID
        const formattedEmail = email.length > 17 ? email.slice(0, 20) + "..." : email;
        return (
          <Tooltip title={row.original.EmailID} arrow>
            <span onClick={() => handleAddEdit(row)}
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}>
              {formattedEmail}
            </span>
          </Tooltip>
        )

      }
    },
    {
      accessorKey: 'CompanyName',
      header: 'Company',
      muiTableBodyCellProps: {
        tabIndex: -1,
        onFocus: (event) => {
          const input = event.currentTarget.querySelector('input');
          if (input) input.focus();
        },
      },
      Cell: ({ cell, row }) => (
        <TextField
          className='ServiceProvider'
          value={cell.getValue()}
          onChange={(e) => handleChange(e.target.value, row.original, 'CompanyName')}
          disabled={!rowSelection[row.id] || (isReviewer && row.original.Status.toLowerCase()==="approved")}
          autoFocus={false}
        />
      ),
    },
    {
      accessorKey: 'RoleID',
      header: 'Role',
      id: 'RoleID',
      enableColumnFilter: true, // Disable filtering for this column
      filterFn: (row, columnId, filterValue) => {
        const roleID = row.getValue(columnId);
        if (!roleID) {
          return false;
        }
        const role = roles.find(model => model.value === roleID);
        if (!role) {
          return false;
        }
        return role?.label.toLowerCase().includes(filterValue.toLowerCase());
      },
      muiTableBodyCellProps: {
        tabIndex: -1,
        onFocus: (event) => {
          const focusable = event.currentTarget.querySelector('input, select, [tabindex]:not([tabindex="-1"])');
          if (focusable) focusable.focus();
        },
      },
      Cell: ({ row, column }) => {
        const columnKey = column.id || column.accessorKey;
        return (
          <DropdownTableInput
            value={row.original[columnKey]}
            label={`Select ${column.columnDef.header}`}
            onChange={(value) => handleChange(value, row.original, columnKey)}
            options={roles}
            disabled={isReviewer ||  !rowSelection[row.id]}
            autoFocus={false}
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
        filterFn: (row, columnId, filterValue) => {
          const agencyID = row.getValue(columnId);
          if (!agencyID) {
            return false;
          }
          const agency = agencies.find(model => model.value === agencyID);
          if (!agency) {
            return false;
          }
          return agency?.label.toLowerCase().includes(filterValue.toLowerCase());
        },
        muiTableBodyCellProps: {
          tabIndex: -1,
          onFocus: (event) => {
            const focusable = event.currentTarget.querySelector('input, select, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
          },
        },
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.AgencyID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={agencies}
              disabled={!rowSelection[row.id]}
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
        enableSorting: true,
        filterVariant: 'multi-select',
        filterSelectOptions: jurisdictions,
        muiTableBodyCellProps: {
          tabIndex: -1,
          onFocus: (event) => {
            const focusable = event.currentTarget.querySelector('input, select, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
          },
        },
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          const selectedValues = row.original[columnKey]?.split(',') || [];
          return (
            <MultiSelectMenu
              options={jurisdictions}
              onChange={(newValue) => handleChange(newValue, row.original, columnKey)}
              label={`Select ${column.columnDef.header}`}
              value={selectedValues.join(',')}
              disabled={!rowSelection[row.id]}
            />
          );
        }
      }
        , {
          accessorKey: 'AgencyID',
          header: 'Agency',
          id: 'AgencyID',
          enableSorting: true,
          filterVariant: 'multi-select',
          filterSelectOptions: agencies,
          muiTableBodyCellProps: {
            tabIndex: -1,
            onFocus: (event) => {
              const focusable = event.currentTarget.querySelector('input, select, [tabindex]:not([tabindex="-1"])');
              if (focusable) focusable.focus();
            },
          },
          Cell: ({ row, column }) => {
            const columnKey = column.id || column.accessorKey;
            const selectedValues = row.original[columnKey]?.split(',') || [];
            return (
              <MultiSelectMenu
                options={agencies}
                onChange={(newValue) => handleChange(newValue, row.original, columnKey)}
                label={`Select ${column.columnDef.header}`}
                value={selectedValues.join(',')}
                disabled={!rowSelection[row.id]}
              />
            );
          }
        })
    }
    if (portalId === 4) {
      baseColumns.push({
        accessorKey: 'MarketerID',
        header: 'Marketer',
        id: 'MarketerID',
        filterFn: (row, columnId, filterValue) => {
          const marketerID = row.getValue(columnId);
          if (!marketerID) {
            return false;
          }
          const marketer = marketers.find(model => model.value === marketerID);
          if (!marketer) {
            return false;
          }
          return marketer?.label.toLowerCase().includes(filterValue.toLowerCase());
        },
        muiTableBodyCellProps: {
          tabIndex: -1,
          onFocus: (event) => {
            const focusable = event.currentTarget.querySelector('input, select, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
          },
        },
        Cell: ({ row, column }) => {
          const columnKey = column.id || column.accessorKey;
          return (
            <DropdownTableInput
              value={row.original.MarketerID}
              label={`Select ${column.columnDef.header}`}
              onChange={(value) => handleChange(value, row.original, columnKey)}
              options={marketers}
              disabled={!rowSelection[row.id]}
            />
          )
        }
      })
    }
    return baseColumns;
  }, [handleChange, roles, statuses, agencies,rowSelection]);

  const handleAddEdit = (row) => {
    
    handleRowExpandToggle(row);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableHiding: false,
    columnFilterDisplayMode: 'popover',
    enableFullScreenToggle: false,
    enableColumnActions: false,
    paginationDisplayMode: 'pages',
    enableRowActions: true,
    enableRowSelection: true,
    enableExpandAll: false,
    positionExpandColumn: 'first',
    positionActionsColumn: "last",
    positionToolbarAlertBanner: 'none',
    enableMultiSort: false,
    autoResetPageIndex: false,
    icons: {
      SortIcon: CustomSortIcon,
    },
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
        size: 10, // make the expand column wider
        muiTableHeadCellProps: {
          sx: {
            display: 'none', // Hide the expand column
          },
        },
        muiTableBodyCellProps: {
          sx: {
            display: 'none', // Hide the expand column
          },
        },
      },
    },
    initialState: {
      columnOrder: [
        'mrt-row-expand',
        'mrt-row-select',
        'EmailID',
        'CompanyName',
        "MarketerID",
        'AgencyID',
        'RoleID',
        'JurisdictionID',
        'Status',
        'mrt-row-actions'
      ],
      // sorting: [
      //   {
      //     id: 'Status',
      //     desc: false,
      //   },
      //   {
      //     id: 'EmailID',
      //     desc: false,
      //   },
      //   {
      //     id: 'CompanyName',
      //     desc: false,
      //   },
      //   {
      //     id: 'MarketerID',
      //     desc: false,
      //   },
      //   {
      //     id: 'AgencyID',
      //     desc: false,
      //   },
      //   {
      //     id: 'RoleID',
      //     desc: false,
      //   },
      //   {
      //     id: 'JurisdictionID',
      //     desc: false,
      //   },

      // ],
      pagination: { pageSize: 5, pageIndex: 0 }
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
        <Tooltip title="Clear Filter" className='Deactivate'>
          <div>
            <IconButton onClick={handleRefresh} >
              <FilterListOff variant="contained" color="secondary" />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title=" Delete Selected" className='DeleteSelected'>
          <div>
            <IconButton className='delete' onClick={handleBulkDelete} disabled={selectedRows.length === 0 || isReviewer}>
              <img src={Deletewhite} alt="Delete"  ></img>
            </IconButton>
          </div>
        </Tooltip>
      </Box>
    ),
    renderRowActions: ({ row }) => {
      return (
        <div   className='tableicons'>
          <IconButton className='delete'  disabled={isReviewer} >
            <img src={Delete} alt="Delete" onClick={()=>{setSelectedRowForDelete(row.original); handleOpenModal()}}></img>
          </IconButton>
          {isModalOpen && <ModalPopup
            header="Profile Delete"
            message1="Are you sure, you want to delete selected user?"
            btnPrimaryText="Confirm"
            btnSecondaryText="Cancel"
            handlePrimaryClick={() => handleRowDelete(row.original)}
            handleSecondaryClick={() => handleCloseModal()}
          />
          }
        </div>
      )
    },
    renderDetailPanel: ({ row }) => (
      openRowId === row.id && (
      <Box sx={{ padding: 2 }}>
        {portalId === 3 ?
          <UserProfileDetailsMC userData={row.original} roles={roles} portalAccess={displayPortalName} setSelectedUser={setSelectedUser} setshowDetailSection={setshowDetailSection}
            handleResetPassword={handleResetPassword} onLockToggle={onLockToggle} singleUserUpdate={singleUserUpdate} />
          :
          <UserProfileDetails userData={row.original} portalAccess={displayPortalName} roles={roles}
            portalId={portalId} userProfiles={userProfiles} handleReject={handleReject} singleUserUpdate={singleUserUpdate}
            handleResetPassword={handleResetPassword} onLockToggle={onLockToggle} />
        }
      </Box>
      )
    ),
    muiExpandButtonProps: {
      sx: {
        display: 'none',
      },
    },
  });

  useEffect(() => {
    // This effect runs when rowSelection state is updated
    console.log('rowSelection',rowSelection);
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
                <Typography variant="h2" className='userprofilelistcontent'> <span>User Management - </span>{displayPortalName}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 8 }} className="PortalName" >
            <Grid container spacing={2} className="justifyContent">
              <Grid size={{ xs: 6, sm: 6, md: 6 }}  >
                <UserFilter
                  isOpen={openComponent === 'filter'}
                  onClose={handleCloseBackdrop}
                  onOpen={() => handleOpenComponent('filter')}
                  portalsList={portalData}
                  handleFilterSubmit={handleFilterSubmit}
                  statuses={statuses}
                  handleportal={handleportal}
                  changePortalName={changePortalName}
                  portalId={portalId} />
                {/* <Download rows={data} headers={columns} filename={filename} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Typography>
      <div className={backdropOpen ? 'backdrop' : ''}>
        
      </div>
      <Box className="MaterialReactTablemargin-left">
      <MaterialReactTable table={table} />
      </Box>
      {confirmDialogOpen && <ModalPopup
        header="Profile Delete"
        message1="Are you sure, you want to delete selected users?"
        btnPrimaryText="Confirm"
        btnSecondaryText="Cancel"
        handlePrimaryClick={handleConfirmDeactivation}
        handleSecondaryClick={() => setConfirmDialogOpen(false)}
      />}
    </>
  );
};

export default UserProfileList;