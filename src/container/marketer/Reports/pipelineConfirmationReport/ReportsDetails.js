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

const ReportsDetails = ({ PipelineConfirmationData, uetFileData }) => {
  // const handleCheckboxChange = (event) => {
  //     const { name, checked } = event.target;
  //     const id = parseInt(name, 10);
  //     setUetFileTypes(prevState =>
  //         checked ? [...prevState, id] : prevState.filter(type => type !== id)
  //     );
  // };

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
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Report Name:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {PipelineConfirmationData?.ReportName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Pipeline Name:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {PipelineConfirmationData?.PipelineName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Date:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textright">
                        {dayjs(PipelineConfirmationData?.Date).format(
                          "MM/DD/YYYY"
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>

                <Typography component="div" className="UserName">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                      <Typography component="span" className="textleft">
                        Date published:
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default ReportsDetails;
