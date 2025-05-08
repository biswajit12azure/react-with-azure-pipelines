import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box,  TextField, Tooltip ,Typography } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline,   Sync ,FilterListOff} from '@mui/icons-material';
import { ModalPopup, MultiSelectAutocomplete, MultiSelectMenu } from '_components';
// import  MapCenterListDetails  from "./MapCenterListDetails";
import dayjs from 'dayjs';
import { Delete } from 'images';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MapCenterList = ({ marketerData, handleDelete, rowSelection, handleChange, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
    setRowSelection, handleToggleActiveStatus, handleRefresh }) => {

    //const uetFiles = marketerData?.UETFileDate?.map(uet => ({ value: uet.UETFileID.toString(), label: uet.UETFileName })) || [];
   // const data = marketerData?.Marketers || [];
    const [selectedRow, setSelectedRow] = useState(null);

    //const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

    // //const handleMultiSelectChange = (newValue, row, columnKey) => {
    //     handleChange(newValue, row.original, columnKey);
    //     setIsConfirmEnabled(true);
    // };

    // const handleInputChange = (value, row, columnKey) => {
    //     handleChange(value, row.original, columnKey);
    //     setIsConfirmEnabled(true);
    // };
    

    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleLockToggle = (selectedRow) => {
        onLockToggle(selectedRow);
        setIsModalOpen(false);
    }
    
  const handleRowDelete = (row) => {
    handleDelete(row);
    setSelectedRows([]);
    setRowSelection({});
  };




    const datalist = [
        {
          announcement: "Map Request",
          company: "Company #1",
          Requestor: "John Adam ",
          Date: "11/11/2024",
          Status: "submitted",
          
           },
      ];
    const columns = [
        {
          accessorKey: "Request type",
          header: "Requesttype",
          Cell: ({ row }) => (
            <span onClick={() => handleAddEdit(row)} >
              <Typography sx={{ ml: 1 }}>{row.original.announcement}</Typography>
           
            </span>
          ),
        },
        { accessorKey: "company", header: "Company" },
        { accessorKey: "Requestor", header: "Requestor" },
        {
          accessorKey: "Date",
          header: "Date",
          Cell: ({ cell }) => (
            <Box >
              {cell.getValue()}
            </Box>
          ),
        },
        { accessorKey: "Status", header: "Status" },
      
      ];
      
 
    const handleAddEdit = (row) => {
        row.toggleExpanded();
       
    };
    // const handleAddEdit = (row) => {
    //     setRowSelection((prev) => ({
    //         ...prev,
    //         [row.id]: !prev[row.id],
    //     }));
    // };

    const table = useMaterialReactTable({
        columns,
        data: datalist,
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
        autoResetPageIndex: false,
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
                'Announcement',
                'Portal',
                'StartDate',
                'ServiceProvider',
                "UETFileID",
                'mrt-row-actions'
            ],
            sorting: [
                {
                    id: 'Announcement', 
                    desc: false, 
                  },
                  {
                    id: 'Portal', 
                    desc: false, 
                  },
                  {
                    id: 'Date', 
                    desc: false, 
                  },
                {
                    id: 'Status', 
                    desc: false, 
                  },
              
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
                <Tooltip title="Refresh" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleRefresh} >
                            <FilterListOff variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="Deactivate" className='Deactivate'>
                    <div>
                        <IconButton onClick={handleToggleActiveStatus} disabled={selectedRows?.length === 0}>
                            <PauseCircleOutline variant="contained" color="secondary" />
                        </IconButton>
                    </div>
                </Tooltip>
            </Box>
        ),
        renderRowActions: ({ row }) => {
            return (
                <div  className='tableicons'>
                    <IconButton className='delete' >
                    <img src={Delete} alt="Delete" onClick={handleOpenModal}></img>
                </IconButton>
                {isModalOpen && <ModalPopup
                    header="Profile Delete"
                    message1="Are you sure you want to delete this AnnouncementCenter?"
                    btnPrimaryText="Confirm"
                    btnSecondaryText="Cancel"
                    handlePrimaryClick={() => handleRowDelete(row.original)}
                    handleSecondaryClick={() => handleCloseModal()}
                />
                }
                </div>
            )
        },
        // renderDetailPanel: ({ row }) => (
        //     <Box sx={{ padding: 2 }}>
        //         <MapCenterListDetails  />
        //     </Box>
        // ),
        muiExpandButtonProps: {
            sx: {
                display: 'none',
            },
        },
    });

    useEffect(() => {
        const selectedFlatRows = table.getSelectedRowModel().flatRows;
        setSelectedRows(selectedFlatRows.map((row) => row.original)); // Extract original row data
    }, [rowSelection, table]); // Re-run when rowSelection changes

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider>
        </>
    );
};

export default MapCenterList;