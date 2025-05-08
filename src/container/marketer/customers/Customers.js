import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DropdownTableInput } from "_components";
import { CustomerDetails } from "container/marketer";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import { marketerBillingHistoryAction, alertActions } from "_store";


const Customers = () => {
  const header = "Customer";
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [openComponent, setOpenComponent] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSearch = async () => {

    dispatch(alertActions.clear());
    try {
      let Data = { AccountNumber: searchInput, MARKETER_ID: null };
      const result = await dispatch(
        marketerBillingHistoryAction.getMarketerBillingHistory(Data)
      ).unwrap();
      const customerDetails = result;
      if (customerDetails?.Data) {
        setData([customerDetails?.Data]);
      
      }
    } catch (error) {
      dispatch(
        alertActions.error({
          message: error?.message || error,
          header: `${header} Failed`,
        })
      );
    }
  };
  const handleFilterSubmit = async (newData) => {
    setData(newData);
  };
  const handleInputChange = (value, row, columnKey) => {
    if (columnKey === "EffectiveDate" || columnKey === "EndDate") {
      const formattedValue = value
        ? dayjs(value).format("YYYY-MM-DDTHH:mm:ss")
        : ""; // Format the date before sending it to handleChange
      handleChange(formattedValue, row, columnKey); // Call handleChange to update and validate
    }
  };

  const handleChange = (newValue, rowData, field) => {
    let updatedRows = [...data];

    const rowIndex = updatedRows.findIndex(
      (row) => row.UserID === rowData.UserID
    );

    if (rowIndex !== -1) {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: newValue, // Save correctly formatted date
      };
    } else {
      updatedRows.push({ ...rowData, [field]: newValue });
    }

    setData(updatedRows); // Ensure re-rendering
  };

  const handleAddEdit = (row) => {
    row.toggleExpanded();
  };
  const handleOpenComponent = (component) => {
    setOpenComponent((prev) => (prev === component ? null : component));
    setBackdropOpen((prev) => (prev === component ? false : true));
  };
  const handleCloseBackdrop = () => {
    setBackdropOpen(false);
    setOpenComponent(null);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "accountOverviewInfo.Account",
        header: "Account #",
        muiTableBodyCellProps: {
          sx: {
            textAlign: "left !important",
            maxWidth: 200,
          },
        },
        Cell: ({ cell, row }) => (
          <span onClick={() => handleAddEdit(row)} className="">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "accountOverviewInfo.CUSTOMER_NAME",
        header: "Account Holder",
      },
      {
        accessorKey: "accountOverviewInfo.SERVICE_ADDR",
        header: "Service address",
        Cell: ({ cell, row }) => {
          const address = row.original.accountOverviewInfo.SERVICE_ADDR;
          const formattedAddress =
            address.length > 17 ? address.slice(0, 20) + "..." : address;
          return (
            <Tooltip
              title={row.original.accountOverviewInfo.SERVICE_ADDR}
              arrow
            >
              <span>{formattedAddress}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "accountOverviewInfo.STATUS",
        header: "Status",
        Cell: ({ cell }) => (
          <span className={`${cell.getValue() ? "isActive" : "InActive"}`}>
            {cell.getValue() === 0 ? "InActive" : "Active"}
          </span>
        ),
      },

      {
        accessorKey: "accountOverviewInfo.amountDue",
        header: "Amount Due",
        muiTableBodyCellProps: {
          sx: {
            textAlign: "center !important",
          },
        },
        Cell: ({ cell, row }) => <span>$ {cell.getValue()}</span>,
      },
    ],
    [data]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableHiding: false,
    columnFilterDisplayMode: "popover",
    enableFullScreenToggle: false,
    enableColumnActions: false,
    paginationDisplayMode: "pages",
    enableExpandAll: false,
    positionToolbarAlertBanner: "none",
    enableMultiSort: false,
    enablePagination: false,
    enableGlobalFilter: false,
    enableDensityToggle: false,
    // Ensure unique IDs for rows
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "",
        size: 10, // make the expand column wider
        muiTableHeadCellProps: {
          sx: {
            display: "none", // Hide the expand column
          },
        },
        muiTableBodyCellProps: {
          sx: {
            display: "none", // Hide the expand column
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 200,
          },
        },
      },
    },
    initialState: {
      columnOrder: [
        "Account",
        "CUSTOMER_NAME",
        "SERVICE_ADDR",
        "STATUS",
        "AmountDue",
      ],
    },
    muiTableBodyProps: {
      sx: {
        display: data.length > 0 ? "table-row-group" : "none",
        textAlign: "left !important",
      }, // Hide table body when empty
    },
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
        <CustomerDetails customerInfo={data} />
      </Box>
    ),
    muiExpandButtonProps: {
      sx: {
        display: "none",
      },
    },
  });
  return (
    <Box className="Customermanagement">
      <Typography component="div" className="userprofilelist">
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant="h2" className="userprofilelistcontent">
                  {" "}
                  Customer{" "}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 8 }} className="PortalName">
                <Grid container spacing={2} className="justifyContent">
                  <Grid size={{ xs: 6, sm: 6, md: 5 }}>
                    {/* <CustomerFilter
                      isOpen={openComponent === "filter"}
                      onClose={handleCloseBackdrop}
                      onOpen={() => handleOpenComponent("filter")}
                      handleFilterSubmit={handleFilterSubmit}
                      marketerData={marketerGroupList}
                    /> */}
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 12, md: 8 }} alignContent={"center"} alignItems="center">
                <Grid container spacing={2} justifyContent="flex-end" >
                  <Grid size={{ xs: 6, sm: 6, md: 5 }}></Grid>
                  <Button
                    variant="contained"
                    className="Download "
                    color="primary"
                    //   onClick={handleClick}
                  >
                    <img src={materialsymbolsdownload} alt="Download" />{" "}
                    Download
                  </Button>
                </Grid>
              </Grid> */}
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
          placeholder="Enter Account Number"
          margin="normal"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} // Update state on input change
          InputProps={{
            maxLength: 10, // Ensures no more than 10 digits
            pattern: "\\d{10}",
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="SearchIcon" onClick={handleSearch} />
              </InputAdornment>
            ),
            "aria-label": "search FAQs",
          }}
        />
        <Box className="ActivityList">
          <MaterialReactTable table={table} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default Customers;
