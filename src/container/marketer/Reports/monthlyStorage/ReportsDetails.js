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

const ReportsDetails = ({ monthlyStorage, date }) => {
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
              monthlyStorage Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        MArketer Name:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {monthlyStorage?.MarketerList ? monthlyStorage?.MarketerList[0]?.Description : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Month & year:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {dayjs(date).format("MMMM YYYY")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Date Published:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {dayjs().format("MM/DD/YYYY")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        End Inventory Balance For Month of{" "}
                        {dayjs(date).format("MMMM")}:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {monthlyStorage?.ImbalanceAdjustedVolume?.MonthEndBalanceForCurrentMonth?.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Adjustment:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {monthlyStorage?.ImbalanceAdjustedVolume?.ImbalanceAdjustedVolume?.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>
                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Begining Balance For Month of{" "}
                        {dayjs(date).add(1, "month").format("MMMM")}:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {monthlyStorage?.ImbalanceAdjustedVolume?.BeginingBalanceForNextMonth?.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default ReportsDetails;
