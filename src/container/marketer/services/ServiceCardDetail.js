import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { experimentalStyled as styled } from '@mui/material/styles';


// Styling for each card
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

// Component to display a single card
const ServiceCardDetail = ({ title, value, icon, resetIcon, time }) => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} className="CardDetail card-layout">
      <Item>
        <Card sx={{
          minWidth: 345
        }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" className="cardcontent">
              <div className="service-card-heading">{title}</div>
              <img
              className='runningicon'
                src={icon}
                alt=""
              /><span className="service-card-title">{value}</span>
              <div className='service-card-body-text'>Last successful run:{time} <span>EST</span></div>
              {title === "End Of Month" && (
                <div>
                  <img src={resetIcon} alt="reset icon" />
                </div>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Item>
    </Grid>
  );
};

export default ServiceCardDetail;
