import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography, TextField ,InputAdornment ,Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DropdownTableInput } from '_components';
import { CustomerDetails } from 'container/admin';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import { AdminCustomerData } from '_utils/constant';
import { customerAction, alertActions, } from '_store';

const Customer = () => {
    const header = "Customer Details";
    const [searchInput, setSearchInput] = useState("");
    const [data,setData] = useState([]);
    const [marketerlist,setMarketerList] = useState([]);
    const [marketerGroupList, setmarketerGroupList] = useState([]);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const dispatch = useDispatch();
    const marketer = marketerlist?.map(x => ({
        label: x.ShortName,
        value: x.CompanyID
    }));

    const marketerGroup = marketerGroupList.map(x => ({
        label: x.Name,
        value: x.AllocationGroupID
    }));
    const handleSearch = async() => {
        console.log("Searched Input ",searchInput );
        console.log("jsadjsahdjhsajdhja",AdminCustomerData?.Data)


     
          
                dispatch(alertActions.clear());
                try {
                    const result = await dispatch(customerAction.getCustomerDetails(searchInput)).unwrap();
                    const customerDetails = result;
                    console.log('deliveryguide------------',customerDetails);
                       if(customerDetails?.Data){
            setData([customerDetails?.Data]);
            setMarketerList(customerDetails?.Data?.Marketer);
            setmarketerGroupList(customerDetails?.Data?.MarketerGroup);
            console.log(result);
                       }
                       if (!result?.Data) {
                        dispatch(alertActions.error({ message: result?.Message || result?.error.message, header: header }));
                        return;
                      }   
                   
                } catch (error) {
                    dispatch(alertActions.error({
                        message: error?.message || error,
                        header: `${header} Failed`
                    }));
                }
        
    }

    const handleInputChange = (value, row, columnKey) => {
        if (columnKey === "EffectiveDate" || columnKey === "EndDate") {
            const formattedValue = value?dayjs(value).format("YYYY-MM-DDTHH:mm:ss"): ''; // Format the date before sending it to handleChange
            console.log("formated Date---------",formattedValue);
            handleChange(formattedValue, row, columnKey); // Call handleChange to update and validate
            setIsDataChanged(true);
        }
    };
    
    const handleChange = (newValue, rowData, field) => {
        let updatedRows = [...data];
    
        const rowIndex = updatedRows.findIndex(row => row.UserID === rowData.UserID);
    
        if (rowIndex !== -1) {
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                [field]: newValue, // Save correctly formatted date
            };
        } else {
            updatedRows.push({ ...rowData, [field]: newValue });
        }
    
        setData(updatedRows); // Ensure re-rendering
        setIsDataChanged(true);
    };

    const handleSave = async() => {
        try{
            const transformedData = data.map(item => ({
                AccountID: item.AccountID,
                AccountNumber: item.AccountNumber,
                CompanyID: item.CompanyID,
                CompanyName:marketerlist.find(x => x.MarketerID === item.CompanyID)?.MarketerName || null,
                AllocationGroupID: item.AllocationGroupID,
                AllocationGroup:marketerGroupList.find(y => y.ID === item.AllocationGroupID)?.GroupName || null,
                EffectiveDate: item.EffectiveDate ? dayjs(item.EffectiveDate).format("YYYY-MM-DDTHH:mm:ss") : null,
                EndDate: item.EndDate ? dayjs(item.EndDate).format("YYYY-MM-DDTHH:mm:ss") : null,
            }));
    
        
 

            console.log("api sending Data",transformedData);
            let result;
            if (transformedData) {
                result = await dispatch(customerAction.updateCustomerDetails(transformedData[0]));
                dispatch(alertActions.success({ message: result?.payload?.Message, header: header }));
            }
            if (result?.error) {
                dispatch(alertActions.error({ message: result?.payload || result?.error.message, header: header }));
                return;
            }
            setIsDataChanged(false);
        }catch (error) {
            dispatch(alertActions.error({ message: error?.message || error, header: header }));
        }
    }

const handleCancelClick = () => {
    handleSearch();
    setIsDataChanged(false);
}
      const handleAddEdit = (row) => {
        row.toggleExpanded();
      };


    const columns = useMemo(() => ([
        {
            accessorKey: "AccountNumber",
            header: "Customer",
            Cell:({cell,row})=>(
                   <span onClick={() => handleAddEdit(row)}>
                    {cell.getValue()}
                   </span>
            )
        },
        {
            accessorKey: 'CompanyID',
            header: 'Marketer',
            Cell: ({ row, column }) => {
                const columnKey = column.id || column.accessorKey;
                return (
                    <DropdownTableInput
                        value={row.original[columnKey]}
                        label={`Select ${column.columnDef.header}`}
                        onChange={(value) => handleChange(value, row.original, columnKey)}
                        options={marketer}
                    />
                );
            }
        },
        {
            accessorKey: 'AllocationGroupID',
            header: 'Group',
            Cell: ({ row, column }) => {
                const columnKey = column.id || column.accessorKey;
                return (
                    <DropdownTableInput
                        value={row.original[columnKey]}
                        label={`Select ${column.columnDef.header}`}
                        onChange={(value) => handleChange(value, row.original, columnKey)}
                        options={marketerGroup}
                    />
                );
            }
        },
        {
            accessorKey: "BillingCycleDay",
            header: "Status",
            Cell: ({ cell }) => (
                <span>{cell.getValue()=== 0 ? "InActive": "Active"}</span>
            )
        },
     
    
        {
            accessorKey: 'EffectiveDate',
            header: 'Association Start',
            filterFn: (row, columnId, filterValue) => {
                const dateValue = row.getValue(columnId);
                return dayjs(dateValue).format('MM-YYYY').toLowerCase().includes(filterValue.toLowerCase());
            },
            Cell: ({ cell, row }) => {
                const dateValue = cell.getValue();
                const minDate = dayjs().startOf("month");
                const maxDate = dayjs().add(3, "month").endOf("month");
                console.log("maxed-Date", maxDate);
    
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='SelectedDate'
                            views={['year', 'month']}
                            value={dayjs(dateValue)}
                            openTo='month'
                            onChange={(newValue) => {
                                const formattedValue = newValue ? newValue.format("YYYY-MM") : "";
                                handleInputChange(formattedValue, row.original, "EffectiveDate");
                            }}
                            minDate={minDate}
                            maxDate={maxDate}
                            slotProps={{
                                textField: (params) => <TextField {...params} />
                            }}
                        />
                    </LocalizationProvider>
                );
            },
        },
        {
            accessorKey: 'EndDate',
            header: 'Association End',
            filterFn: (row, columnId, filterValue) => {
                const dateValue = row.getValue(columnId);
                return dayjs(dateValue).format('MM-YYYY').toLowerCase().includes(filterValue.toLowerCase());
            },
            Cell: ({ cell, row }) => {
                const dateValue = cell.getValue();
                const effectiveDate = row.original.EffectiveDate ? dayjs(row.original.EffectiveDate) : null;
                const minDate = effectiveDate || dayjs().startOf("month");
                const maxDate = minDate.add(3, "month").endOf("month"); // Allow up to 4 months
    
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='SelectedDate'
                            views={['year','month']}
                            openTo='month'
                            value={dateValue ? dayjs(dateValue):null}
                            defaultCalendarMonth={dayjs()} 
                            disableOpenPicker={false}
                            onChange={(newValue) => {
                                const formattedValue = newValue ? newValue.format("YYYY-MM") : "";
                                console.log("Selected Month & Year:", formattedValue);
                                handleInputChange(formattedValue, row.original, "EndDate");
                            }}
                            minDate={minDate}
                            maxDate={maxDate}
                            slotProps={{
                                textField: (params) => <TextField {...params} />
                            }}
                        />
                    </LocalizationProvider>
                );
            },
        },
    ]), [data]); 

      const table = useMaterialReactTable({
        columns,
        data,
        enableHiding: false,
        columnFilterDisplayMode: 'popover',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        paginationDisplayMode: 'pages',
        enableExpandAll: false,
        positionToolbarAlertBanner: 'none',
        enableMultiSort: false,
        enablePagination:false,
        enableGlobalFilter: false,
        enableDensityToggle: false,
 // Ensure unique IDs for rows
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
                'AccountNumber',
                'CompanyID',
                "AllocationGroupID",
                "BillingCycleDay",
                'EffectiveDate',
                'EndDate'
            ]
        },
        muiTableBodyProps:{
            sx: { display: data.length > 0 ? "table-row-group" : "none" }, // Hide table body when empty
        },
        renderDetailPanel: ({ row }) => (
          <Box sx={{ padding: 2 }}>
            <CustomerDetails customerInfo={data}/>
          </Box>
        ),
        muiExpandButtonProps: {
          sx: {
            display: 'none',
          },
        },
      });
    return(
        <Box className="Customermanagement">
              <Typography component="div" className='userprofilelist'>
                <Grid container direction="row" spacing={2} >
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}  >
                        <Grid container  >
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}  >
                                <Typography variant="h2" className='userprofilelistcontent'> Customer Management </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 8 }} className="PortalName" >
                        <Grid container spacing={2} className="justifyContent">
                            <Grid size={{ xs: 6, sm: 6, md: 6 }}  >
                                {/* <CustomerFilter isOpen={openComponent === 'filter'}
                                    onClose={handleCloseBackdrop}
                                    onOpen={() => handleOpenComponent('filter')} /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
        type="number"
        variant="outlined"
        fullWidth
        className="SearchIconinput"
        placeholder='Enter Account Number'
        margin="normal"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)} // Update state on input change
        InputProps={{
            maxLength: 10, // Ensures no more than 10 digits
            pattern: "\\d{10}",
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="SearchIcon" onClick={handleSearch}/>
            </InputAdornment>
          ),
          'aria-label': 'search FAQs'
        }}
      />
            <Box className="Customertable">
                <MaterialReactTable
                    table={table}
                />
                </Box>
            </LocalizationProvider>
            <Grid container>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} className="Personal-Information">
            <Button variant="contained" color="red" className="cancelbutton" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className='submitbutton'
              onClick={handleSave}
              disabled={!isDataChanged} 
            > 
              Save
            </Button>
          </Grid>
            </Grid>
        </Box>
    )
}

export default Customer;