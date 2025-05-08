import React, { useState, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Tooltip,
  Typography,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { graph } from "../../images";

const Reports = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const handleReportClick = () => {
    navigate(`dcreports`);
    setOpen(false);
  };
  const handleUsageClick = () => {
    navigate(`csreports`);
    setOpen(false);
  };
  const handleForeCast = () => {
    navigate(`/foreCastReports`);
    setOpen(false);
  };
  const handleSummaryStorage = () => {
    navigate("/summaryStorage");
    setOpen(false);
  };
  const handleMonthlyStorage = () => {
    navigate("/monthlyreports");
    setOpen(false);
  };
  const handleCityGate = () => {
    navigate("/citygatereports");
    setOpen(false);
  };
  const handlePipelineConfirmation = () => {
    navigate("/pipelineconfirmation");
    setOpen(false);
  };
  const handleNominationCompliance = () => {
    navigate("/nominationcompliance");
    setOpen(false);
  };
  const handleActivityInterruptible = () => {
    navigate("/activityinterruptible");
    setOpen(false);
  };

  const handleSNCompliance = ()=>{
    navigate("/SummaryNominationComplianceReport");
    setOpen(false);
  }
  const handleSupplierPendingEnrollmentOrDrop = ()=>{
    navigate("/supplierPendingEnrollmentOrDrop");
    setOpen(false);
  }
  //SupplierActiveCustomer
  const handleSActiveCustomer = ()=>{
    navigate("/SupplierActiveCustomer");
    setOpen(false);
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <Tooltip title="Reports">
        <IconButton
          onClick={() => setOpen(!open)}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <img src={graph} alt="profileuser" />
        </IconButton>
      </Tooltip>
      {open && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            className="profilenavbar support-list"
            elevation={4}
            sx={{
              mt: 2,
              p: 2,
              maxWidth: "500px",
              mx: "auto",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Box
              sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
              className="Filtercontainerinner Border"
            >
              <Typography component="div" className="userprofilelist">
                <Grid container direction="row" spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="h4" className="userprofilelistcontent">
                      Reports
                    </Typography>
                  </Grid>
                </Grid>
              </Typography>
              <MenuList>
                <MenuItem onClick={handleReportClick}>
                  DC Nomination Reallocation Report
                </MenuItem>
                <MenuItem onClick={handleUsageClick}>
                  Customer Usage Report
                </MenuItem>
                <MenuItem onClick={handleForeCast}>
                  5 Days Requirement Forecast Report
                </MenuItem>
                <MenuItem onClick={handleSummaryStorage}>
                  Summary Storage by Marketer Report
                </MenuItem>
                <MenuItem onClick={handleSNCompliance}>
                Summary Nomination Compliance Report
                </MenuItem>
                <MenuItem onClick={handleSActiveCustomer}>
                Supplier Active Customers Report
                </MenuItem>
                
                <MenuItem onClick={handleMonthlyStorage}>
                  Monthly Storage Report
                </MenuItem>
                <MenuItem onClick={handleCityGate}>
                  Supply City Gate Report
                </MenuItem>
                <MenuItem onClick={handleNominationCompliance}>
                  Nomination Compliance Report
                </MenuItem>
                <MenuItem onClick={handlePipelineConfirmation}>
                  Pipeline Confirmation Report
                </MenuItem>
                <MenuItem onClick={handleActivityInterruptible}>
                  Adjustment Activity Interruptible Report
                </MenuItem>
                <MenuItem onClick={handleSupplierPendingEnrollmentOrDrop}>
                Supplier Pending Enrollment/Drop Report 
                </MenuItem>
              </MenuList>
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default Reports;
