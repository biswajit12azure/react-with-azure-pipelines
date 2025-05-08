import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Visibility, DeleteForever, Lock, LockOpen } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { userActions } from '_store';
import AddEdit from './ManageProfile';
import { ErrorBoundary, Download } from '_components';
import { labels } from '_utils/labels';
import dayjs from 'dayjs';

const UserList = () => {
  const filename = 'Users';
  const users = useSelector((x) => x.users?.list);
  const dispatch = useDispatch();
  const userData = users?.value?.map(user => user.Data);
  const rows = userData?.map(user => user.UserDetails);

  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [title, setTitle] = useState('');
  const [isLocked, setLock] = useState(false);

  const handleLock = () => setLock((lock) => !lock);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'FullName',
        header: 'Name',
        enableSorting: true,
      },
      {
        accessorKey: 'EmailAddress',
        header: 'Email',
        enableSorting: true,
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        enableSorting: true,
      },
      {
        accessorKey: 'createdDate',
        header: 'Date',
        enableSorting: true,
      },
    ],
    []
  );

  const data = useMemo(() => {
    return rows
      ? rows.map((user) => ({
          ...user,
          createdDate: dayjs(user.createdDate).isValid() ? dayjs(user.createdDate).format('MM/DD/YYYY') : user.createdDate,
        }))
      : [];
  }, [rows]);

  useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  const handleAddEdit = (id) => {
    setSelectedRowId(id);
    setOpen(true);
    if (id) {
      setTitle(labels.manageProfileLabel);
    } else {
      setTitle(labels.signUpLabel);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRowId(null);
    dispatch(userActions.getAll());
  };

  const handleRowClick = (row) => {
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
    //enableExpanding: true,
   // positionExpandColumn: 'first',
    initialState: {
      columnOrder: [
        //'mrt-row-expand',
        'FullName',
        'EmailAddress',
        'Status',
        'createdDate',      
        'mrt-row-actions', // move the built-in actions column to the end of the table
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
        <Download rows={data} headers={columns} filename={filename} />
        {/* <Button variant="contained" color="primary" onClick={() => handleAddEdit(null)}>
          Add
        </Button> */}
      </Box>
    ),
    renderRowActions: ({ row }) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <IconButton onClick={() => handleAddEdit(row.original.id)}>
          <Visibility variant="contained" color="primary" />
        </IconButton>
        <IconButton onClick={handleLock}>
          {isLocked ? <Lock /> : <LockOpen />}
        </IconButton>
        <IconButton onClick={() => dispatch(userActions.delete(row.original.id))}>
          <DeleteForever variant="contained" color="secondary" />
        </IconButton>
      </div>
    ),
    // renderDetailPanel: ({ row }) => (
    //   <Box sx={{ padding: 2 }}>
    //     <Typography variant="h6">Details for {row.original.FullName}</Typography>
    //     <Typography variant="body1">Email: {row.original.EmailAddress}</Typography>
    //     <Typography variant="body1">Status: {row.original.Status}</Typography>
    //     <Typography variant="body1">Created Date: {row.original.createdDate}</Typography>
    //   </Box>
    // ),
    // muiTableBodyRowProps: ({ row }) => ({
    //   onClick: () => handleRowClick(row),
    //   sx: {
    //     cursor: 'pointer',
    //   },
    // }),
    // muiExpandButtonProps: {
    //   sx: {
    //     display: 'none',
    //   },
    // },
  });

  return (
    <ErrorBoundary>
      <MaterialReactTable table={table} />
      <AddEdit title={title} open={open} handleClose={handleClose} selectedrowId={selectedRowId} />
    </ErrorBoundary>
  );
};

export default UserList;