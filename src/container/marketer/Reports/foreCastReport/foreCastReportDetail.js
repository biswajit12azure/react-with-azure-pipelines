import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

const ForeCastReportDetail = ({ fcReportName,MarkterName,fromDate,toDate,publishDate,gasDay,monthYearDate }) => {
  return (
    <>
      <Box className="userInformationcontainer">
        <Accordion component="div" defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            component="div"
          >
            <Typography component="h2" className="userInformation">
              Report Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Typography component="div" className="UserName">
                 {fcReportName && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Report Name:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {fcReportName}
                      </Typography>
                    </Grid>
                  </Grid>}
                </Typography>

                <Typography component="div" className="UserName">
                {MarkterName && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Marketer Name:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {MarkterName}
                      </Typography>
                    </Grid>
                  </Grid>}
                </Typography>
                <Typography component="div" className="UserName">
                {monthYearDate && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                      Month & year:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {monthYearDate}
                      </Typography>
                    </Grid>
                  </Grid>}
                </Typography>
                <Typography component="div" className="UserName">
                 {fromDate && toDate && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Date Range:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {dayjs(fromDate).format('MM/DD/YYYY')} - {dayjs(toDate).format('MM/DD/YYYY')}
                      </Typography>
                    </Grid>
                  </Grid> }
                </Typography>
                <Typography component="div" className="UserName">
                 {gasDay && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                      Date:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {gasDay}
                      </Typography>
                    </Grid>
                  </Grid>}
                </Typography>
              

                <Typography component="div" className="UserName">
                 {publishDate && <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Date Published:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {publishDate}
                      </Typography>
                    </Grid>
                  </Grid>}
                </Typography>
              </Grid>

           
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default ForeCastReportDetail;
