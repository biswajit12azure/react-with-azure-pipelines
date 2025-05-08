import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {materialsymbolsdownload} from 'images';
import { base64ToFile } from "_utils";
import Grid from '@mui/material/Grid2';
const DisplayUploadedFile = ({ exsistingFiles = [] }) => {

  const handleDownload = (base64String, fileName) => {
    base64ToFile(base64String, fileName);
  };
  return (
    <div>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="p-0 AccordionSummaryheading" component="h2" >Uploaded Documents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="DownloadContainer">
            <Typography component="div">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Typography component="h2" className="DownloadHeader">
                    Uploaded Files
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Typography component="div" className="DownloadList">
                    <Typography component="div">
                      {exsistingFiles.map((item, index) => (
                        <Typography component="div" className="DocumentTypeID" key={item.id || index}>
                          <Typography component="span" className="DocumentDescription">{item.FileName}</Typography>
                          <IconButton onClick={() => handleDownload(item?.File, item?.FileName)}>
                           
                            <img src={materialsymbolsdownload} alt='download'></img>
                          </IconButton>
                        </Typography>
                      ))}
                    </Typography>

                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};


export default DisplayUploadedFile;
