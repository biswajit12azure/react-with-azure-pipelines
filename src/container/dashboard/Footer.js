import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
const Footer = () => {
  return (


    <Box className="Foooter">
      <Grid container>
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <Box component="ul">
            <Box component="li">
          <Link href="https://www.washingtongas.com/terms" target="_blank" underline="hover" color="textPrimary">
            Terms of Use |
          </Link>
          </Box>
          <Box component="li">
          <Link href="https://www.washingtongas.com/privacy" target="_blank" underline="hover" color="textPrimary">
            Privacy Policy |
          </Link>
          </Box>
          <Box component="li">
          <Link href="https://www.washingtongas.com/security-policy" target="_blank" underline="hover" color="textPrimary">
            Security Policy |
          </Link>
          </Box>
          <Box component="li">
          <Link href="https://www.washingtongas.com/" target="_blank" underline="hover" color="textPrimary">
            Sitemap
          </Link>
          </Box>
          </Box>


        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Typography variant="body2" color="textPrimary" className='Confidential'>Confidential</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
          <Typography variant="body2" color="textPrimary">
            © {new Date().getFullYear()} Washington Gas Light Co. All Rights Reserved
          </Typography>
        </Grid>
      </Grid>
    </Box >
  );
};


export default Footer;


