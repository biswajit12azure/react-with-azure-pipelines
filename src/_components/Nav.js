import * as React from 'react';
import Link from "@material-ui/core/Link";
import {logo,ListAltOutlinedIcon,SettingsOutlinedIcon,BarChartOutlinedIcon, Notificationsicon,
} from '../images';
import { labels } from "_utils/labels";
import { MyProfile, Notifications } from 'container/headers';
// import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { Box, AppBar, CssBaseline, Divider, Drawer, IconButton, List, Toolbar, Typography, Tooltip } from "@mui/material";
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { supporticonblue, headseticonwhite } from 'images';
// import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const drawerWidth = 240;

const Nav = ({ isAuthenticated, window, portalID }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!isAuthenticated) return null;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleHomeClick = () => {
    localStorage.removeItem('appMenuItems');
    navigate('/home');
  }

  const handleSupportClick = () => {
    navigate('faqView');
  }

  const handleNotificationClick = () => {
    navigate('notification');
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }} className="navbarlistcontainer">
      <Typography variant="div" >
        {/* <Link variant="logo" className="wgllogo">
          <Typography component="div" className="wgllogocontainer" onClick={handleHomeClick}>
            <img src={logo} alt="logo" />
            {labels.eServicePortal}
          </Typography>
        </Link> */}
        <Typography component="div" className='navbaremailcontainer'>
          <Typography className='navbarusername'>
            john Adams
          </Typography>
          <Typography className='navbaremail'>
            john.adams@remex.com
          </Typography>
          <Typography className='navbarnumber'>
            202-547-5134
          </Typography>
        </Typography>
      </Typography>
      <Divider />
      <List>
        <Box className='nav-linksbuttons navmobilelist'>

          {/* <Box className="iconcolor">
            <Tooltip title="Settings">
   
              <img src={SettingsOutlinedIcon} alt='SettingsOutlinedIcon'/>Admin Portal
            </Tooltip>
          </Box>
          <Box className="iconcolor">
            <Tooltip title="BarChart">
               
              <img src={BarChartOutlinedIcon} alt='BarChartOutlinedIcon'/>Reports
            </Tooltip>
          </Box>
          <Box className="iconcolor">
            <Tooltip title="List">
          <img src={ListAltOutlinedIcon} alt='ListAltOutlinedIcon'/>Activity Log
            </Tooltip>
          </Box> */}
          <Box className="Notifications">
            {/* <Typography component="span" className='Notificationscount'>  2</Typography>
           <Notifications />  */}
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationClick}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <img src={Notificationsicon} alt='Notificationsicon'/> Notifications
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
         

        </Box>
      </List>
      <Link variant="logo" className="wgllogo wgllogoposition">
            <Typography component="div" className="wgllogocontainer" onClick={handleHomeClick}>
              <img src={logo} alt="logo" />
              {labels.eServicePortal}
            </Typography>
          </Link>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }} className="navcontainer">
      <CssBaseline />
      <AppBar component="nav" className='navbarbackground'>
        <Toolbar>
          <IconButton className=''
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon className='' />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            className="wgllogodesktop"
          >
            <Link variant="logo" className="wgllogo">
              <Typography component="div" className="wgllogocontainer" onClick={handleHomeClick}>
                <img src={logo} alt="logo" />
                {labels.eServicePortal}
              </Typography>
            </Link>

          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <div className='nav-linksbuttons'>
              <Box className="Supporticon" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Support">
                  <IconButton
                    onClick={handleSupportClick}
                    variant="logo"
                    className="headseticon"
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    <img src={supporticonblue} alt="Support"></img>
                    <span className='none-moblie'>Support?</span>
                  </IconButton>
                </Tooltip>
              </Box>
              {/* <Box className="iconcolor none-moblie" >
                <Tooltip title="Settings">
                <img src={SettingsOutlinedIcon} alt='SettingsOutlinedIcon'/> 
                </Tooltip>
              </Box>
              <Box className="iconcolor none-moblie">
                <Tooltip title="BarChart">
               
                  <img src={BarChartOutlinedIcon} alt='BarChartOutlinedIcon'/> 
                </Tooltip>
              </Box>
              <Box className="iconcolor none-moblie">
                <Tooltip title="List">
         
                  <img src={ListAltOutlinedIcon} alt='ListAltOutlinedIcon'/> 
                </Tooltip>
              </Box> */}
              <Box className="Notifications none-moblie">
                <Typography component="span" className='Notificationscount'> 2 </Typography>
                {/* <Notifications /> */}
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleNotificationClick}
                      size="small"
                      sx={{ ml: 2 }}
                    >
                       <img src={Notificationsicon} alt='Notificationsicon'/> 
                      
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <MyProfile />
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

Nav.propTypes = {
  window: PropTypes.func,
};

export default Nav;