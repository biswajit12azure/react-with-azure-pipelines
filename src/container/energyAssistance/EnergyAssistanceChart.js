import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Grid from '@mui/material/Grid2';

const EnergyAssistanceChart = () => {

const data = [
  { month: "JUL", usage: 2.1 },
  { month: "AUG", usage: 3.7 },
  { month: "SEP", usage: 14.0 },
  { month: "OCT", usage: 22.3 },
  { month: "NOV", usage: 31.9 },
  { month: "DEC", usage: 42.3 }
];
  return (
    <Card className="EnergyAssistanceChart" sx={{ maxWidth: 400, p: 2, borderRadius: 3, boxShadow: 3 }}>
      {/* Header Section */}
      {/* <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" fontWeight="bold" color="primary">
          ENERGY USAGE
        </Typography>
        <IconButton size="small" color="primary">
          <Download />
        </IconButton>
      </CardContent> */}


      {/* Subtitle */}
      <CardContent  className="EnergyAssistanceChartlist">
         <Grid container spacing={2} >
          <Grid size={{ xs: 6, sm: 6, md: 6 }}>
        <Typography color="textSecondary">
          LAST 12 MONTHS USAGE
        </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md:  6}}>
        <Typography  fontWeight="bold" className="text-Right">
        <span > 295.80 </span>THERMS

        </Typography>
        </Grid>
        </Grid>
      </CardContent>

      {/* Bar Chart */}
      <CardContent sx={{ pt: 0 }}  className="EnergyAssistanceChartlistdata">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="usage" fill="#0052CC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EnergyAssistanceChart;
