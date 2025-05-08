import React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
const CustomerDetails = ({ customerInfo }) => {
  // const customerDetails = customerInfo[0];
  const data = Array.isArray(customerInfo) ? customerInfo[0] : customerInfo;
  const marketerName =
    data?.Marketer?.find((item) => item.MarketerID === data?.CompanyID)
      ?.MarketerName || "";
  const marketerGroupName =
    data?.MarketerGroup?.find((item) => item.ID === data?.AllocationGroupID)
      ?.GroupName || "";
  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Box className="customercontainer">
            <Typography component="h2" className="userInformation">
              PROFILE INFORMATION
            </Typography>

            <Typography component="div" className="">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    ACCOUNT NUMBER:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="textright">
                    {data?.accountOverviewInfo?.Account}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>

            <Typography component="div" className="">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    ACCOUNT HOLDER:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="textright">
                    {data?.accountOverviewInfo.CUSTOMER_NAME}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>

            <Typography component="div" className="">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    SERVICE ADDRESS:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="textright">
                    {data?.accountOverviewInfo.SERVICE_ADDR}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Box className="customercontainer">
            <Typography component="h2" className="userInformation">
              CURRENT BILLING:
            </Typography>

            <Typography component="div" className="UserName">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    AMOUNT DUE:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="highlightedAmount">
                    $&emsp;&emsp;{data?.accountOverviewInfo?.amountDue}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>

            <Typography component="div" className="UserName">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    DUE DATE:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="textright">
                    {dayjs(data?.getLegacyBillDates_Resp.dueDate).format(
                      "MM/DD/YYYY"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>

            <Typography component="div" className="UserName">
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <Typography component="" className="textleft">
                    PAST DATE:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 8 }}>
                  <Typography component="span" className="textright">
                    {data?.getLegacyBillDates_Resp.pastDue}
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box className="userInformationcontainer">
        <Accordion component="div" defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            component="div"
          >
            <Typography component="h2" className="userInformation">
              BILLING & PAYMENT HISTORY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                className="Billingcontainer"
              >
                <table className="customerDetailsTable">
                  <tbody>
                    <tr>
                      <th></th>
                      <th>INVOICE</th>
                      <th>PAYMENT</th>
                      <th>BALANCE</th>
                    </tr>
                  </tbody>
                  <tr>
                    <td>JAN</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>FEB</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>MAR</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                </table>
              </Grid>
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                className="Billingcontainer"
              >
                <table className="customerDetailsTable">
                  <tbody>
                    <tr>
                      <th></th>
                      <th>INVOICE</th>
                      <th>PAYMENT</th>
                      <th>BALANCE</th>
                    </tr>
                  </tbody>
                  <tr>
                    <td>APR</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>MAY</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>JUN</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                </table>
              </Grid>
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                className="Billingcontainer"
              >
                <table className="customerDetailsTable">
                  <tbody>
                    <tr>
                      <th></th>
                      <th>INVOICE</th>
                      <th>PAYMENT</th>
                      <th>BALANCE</th>
                    </tr>
                  </tbody>
                  <tr>
                    <td>JUL</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>AUG</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>SEP</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                </table>
              </Grid>
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                className="Billingcontainer"
              >
                <table className="customerDetailsTable">
                  <tbody>
                    <tr>
                      <th></th>
                      <th>INVOICE</th>
                      <th>PAYMENT</th>
                      <th>BALANCE</th>
                    </tr>
                  </tbody>
                  <tr>
                    <td>OCT</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>NOV</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr>
                    <td>DEC</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                </table>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default CustomerDetails;
