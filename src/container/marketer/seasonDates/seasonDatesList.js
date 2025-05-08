import React, { useState, useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import IconButton from '@mui/material/IconButton';
import { Box,  TextField, Tooltip ,Typography } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline,   Sync ,FilterListOff} from '@mui/icons-material';
import { ModalPopup, MultiSelectAutocomplete, MultiSelectMenu } from '_components';
import Grid from '@mui/material/Grid2';
// import  FileHubDetails  from "./FileHubDetails";
import dayjs from 'dayjs';
import { Delete } from 'images';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const SeasonDatesList = ({ marketerData, handleDelete, rowSelection, handleChange, isModalOpen, setIsModalOpen, onLockToggle, selectedRows, setSelectedRows,
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



  const data = [
        { region: "District of Columbia", seasonName: "DC - 2025", seasonStart: "7/1/2024", seasonEnd: "6/30/2025" },
        { region: "Maryland", seasonName: "MD - 2025", seasonStart: "7/1/2024", seasonEnd: "6/30/2025" },
        { region: "Virginia", seasonName: "VA - 2025", seasonStart: "7/1/2024", seasonEnd: "6/30/2025" }
    ];
    const columns = useMemo(
        () => [
            {
                accessorKey: "seasonName",
                header: "SEASON NAME",
                enableColumnFilter: false, 
                size: 200,
                Cell: ({ cell }) => <Typography sx={{ fontWeight: 500 }}>{cell.getValue()}</Typography>,
            },
            { accessorKey: "seasonStart", header: "SEASON START", size: 150 , enableColumnFilter: false, },
            { accessorKey: "seasonEnd", header: "SEASON END", size: 150,  enableColumnFilter: false,  },
            {
                accessorKey: "actions",
                header: "",
                enableColumnFilter: false, 
                size: 50,
                Cell: ({ row }) => (
                    <Tooltip title="Delete">
                        <IconButton className="delete" onClick={() => handleOpenModal(row)}>
                            <img src={Delete} alt="Delete" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [handleOpenModal] // Add dependency if using hooks inside
    );
    
    const dcData = data.filter(row => row.region === "District of Columbia");
    const mdData = data.filter(row => row.region === "Maryland");
    const vaData = data.filter(row => row.region === "Virginia");
    const dcTable = useMaterialReactTable({ columns, data: dcData, enablePagination: false, renderBottomToolbar: () => null, enableSorting: false });
    const mdTable = useMaterialReactTable({ columns, data: mdData,enablePagination: false, renderBottomToolbar: () => null, enableSorting: false });
    const vaTable = useMaterialReactTable({ columns, data: vaData,enablePagination: false, renderBottomToolbar: () => null, enableSorting: false });

    // const datalist = [
    //     {
    //     FileName: "9094839_SFES_9232",
    //      Marketer: "Marketer #1",
    //      FileType: "READ",
    //      lastupdate: "11/11/2024",
          
    //        },
    //   ];
    // const columns = [
    //     {
    //       accessorKey: "FileName",
    //       header: "File Name",
    //       Cell: ({ row }) => (
    //         <span onClick={() => handleAddEdit(row)} >
    //           <Typography sx={{ ml: 1 }}>{row.original.FileName}</Typography>
           
    //         </span>
    //       ),
    //     },
    //     { accessorKey: "Marketer", header: "Marketer" },
    //     { accessorKey: "FileType", header: "File Type" },
    //     {
    //       accessorKey: "lastupdate",
    //       header: "last update",
    //       Cell: ({ cell }) => (
    //         <Box >
    //           {cell.getValue()}
    //         </Box>
    //       ),
    //     },
      
    //   ];
 
    const handleAddEdit = (row) => {
        row.toggleExpanded();
       
    };

    console.log(data); 
    const table = useMaterialReactTable({
       columns: columns,
    data: data,
    enableGlobalFilter: false,  
    enableColumnFilters: false,  
    enableDensityToggle: false,  
    enableFullScreenToggle: false,
    enablePagination: false,
    enableGrouping: true,
    enableColumnFilters: false,
    initialState: { grouping: ["region"], expanded: true },
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enablePagination: false,
    enableSorting: false, 

    muiTableHeadCellProps: {
        sx: { fontWeight: "bold", color: "#0056b3", textAlign: "left" },
    },

    muiTableBodyCellProps: {
        sx: { textAlign: "left" }
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
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
            </LocalizationProvider> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
         
            <Grid container spacing={3} className="Districttable">
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h6" sx={{ marginTop: 2 }}>District of Columbia</Typography>
                <MaterialReactTable table={dcTable} />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h6" sx={{ marginTop: 2 }}>Maryland</Typography>
                <MaterialReactTable table={mdTable} />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h6" sx={{ marginTop: 2 }}>Virginia</Typography>
                <MaterialReactTable table={vaTable} />
                </Grid>
                </Grid>
          
        </LocalizationProvider>
        </>
    );
};

export default SeasonDatesList;