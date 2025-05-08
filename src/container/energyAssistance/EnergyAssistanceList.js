import React, { useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box, Tooltip ,Typography } from '@mui/material';
import { PauseCircleOutline, FilterListOff} from '@mui/icons-material';
// import  MapCenterListDetails  from "./MapCenterListDetails";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EnergyAssistanceDetails from './EnergyAssistanceDetails';

const EnergyAssistanceList = ({ marketerData, handleDelete, rowSelection, handleChange, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
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
    

//     const handleOpenModal = (row) => {
//         setSelectedRow(row);
//         setIsModalOpen(true);
//         console.log(selectedRow);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedRow(null);
//     };

//     const handleLockToggle = (selectedRow) => {
//         onLockToggle(selectedRow);
//         setIsModalOpen(false);
//     }
    
//   const handleRowDelete = (row) => {
//     handleDelete(row);
//     setSelectedRows([]);
//     setRowSelection({});
//   };




    const datalist = [
        {
           Account: "11/11/2024",
           customername: "Company #1",
           ServiceAddress: "John Adam ",
           ServiceHeating: "11/11/2024",
           AmountDue: "$ 388.17",
          
          
           },
      ];
    const columns = [
        {
          accessorKey: "Account",
          header: "Account #",
          Cell: ({ row }) => (
            <span onClick={() => handleAddEdit(row)} >
              <Typography sx={{ ml: 1 }}>{row.original.Account}</Typography>
           
            </span>
          ),
        },
        { accessorKey: "customername", header: "customer name" },
        { accessorKey: "ServiceAddress", header: "Service Address" },
        
       
        { accessorKey: "ServiceHeating", header: "Service/Heating " },
        { accessorKey: "AmountDue", header: " Amount Due" },
      
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
        enableRowActions: false,
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
        renderDetailPanel: ({ row }) => (
            <Box sx={{ padding: 2 }}>
                <EnergyAssistanceDetails  />
            </Box>
        ),
        // renderRowActions: ({ row }) => {
        //     return (
        //         <div  className='tableicons'>
        //             <IconButton className='delete' >
        //             <img src={Delete} alt="Delete" onClick={handleOpenModal}></img>
        //         </IconButton>
        //         {isModalOpen && <ModalPopup
        //             header="Profile Delete"
        //             message1="Are you sure you want to delete this AnnouncementCenter?"
        //             btnPrimaryText="Confirm"
        //             btnSecondaryText="Cancel"
        //             handlePrimaryClick={() => handleRowDelete(row.original)}
        //             handleSecondaryClick={() => handleCloseModal()}
        //         />
        //         }
        //         </div>
        //     )
        // },
        
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

export default EnergyAssistanceList;