import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { experimentalStyled as styled } from '@mui/material/styles';

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


const CardDetail = ({id,Icon, title, description, handleClick }) => {
  return (
    <Grid size={{ xs: 12, sm: 4, md: 4 }} key={id} className="CardDetail" onClick={handleClick} >
    <Item>
    <Card  sx={{ maxWidth: 345 }}  >
      <CardContent>
      {!!Icon && (
        <span className="menuItemIcon">
          <Icon />
        </span>
      )}
        <Typography gutterBottom variant="h5" component="div" className='cardcontent'>
          {title}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Description : {description}
        </Typography> */}
      </CardContent>
    </Card>
    </Item>
    </Grid>
  );
};

export default CardDetail;
