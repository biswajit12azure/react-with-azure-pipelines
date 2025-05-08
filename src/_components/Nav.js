import React, { useEffect, useMemo } from 'react';
import Link from "@material-ui/core/Link";
import { BarChartOutlinedIcon, ListAltOutlinedIcon, logo, Notificationsicon } from '../images';
import { labels } from "_utils/labels";
import { MyProfile, Reports} from 'container/headers';
import { Box, AppBar, CssBaseline, Divider, Drawer, IconButton, List, Toolbar, Typography, Tooltip,Alert, Stack } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { supporticonblue, headseticonwhite,SettingsOutlinedIcon, graph} from 'images';
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component
import Backdrop from './Backdrop'; // Import the Backdrop component
import { alertActions, announcementAction } from '_store';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from './AlertMessage';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useLocation } from 'react-router-dom';
dayjs.extend(isSameOrAfter);

const drawerWidth = 240;

const Nav = ({ isAuthenticated, window, portalID }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState('');
  const [backdropOpen, setBackdropOpen] = React.useState(false); // State to manage backdrop visibility
  const portalId = sessionStorage.getItem('portalID') || portalID;
  const breadcrumb = sessionStorage.getItem('breadcrumb') || '';
  const showHeaderMenu = JSON.parse(sessionStorage.getItem('showHeaderMenu')) || false;
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const announcementsData = useSelector(x => x.announcement?.allAnnouncements);
  const data = announcementsData?.AnnouncementData || [];
  const id = useSelector(x => x.auth?.userId);
  const authUser = useSelector(x => x.auth?.value);
  const user = authUser?.Data;
  const userAccess = user?.UserAccess;
  const isPortalAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin') && access.PortalId.toString() === (portalID?.toString() || portalId?.toString()));
  const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));

    const portalsList = userAccess ? userAccess.map(access => ({
        PortalId: access.PortalId,
        PortalName: access.PortalName,
        PortalKey: access.PortalKey,
    })) : [];

  const portalIdList = portalsList.map(portal => portal.PortalId);

    const portalIds = portalIdList.join(',');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(alertActions.clear());
        await dispatch(announcementAction.getAllAnnouncements({id,portalIds})).unwrap();
      } catch (error) {
        console.log(error?.message || error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [dispatch, showHeaderMenu, id,portalIds, isAuthenticated]);

  const currentAndFutureAnnouncements = useMemo(() => {
    return data.filter(announcement => dayjs(announcement.StartDate).isSameOrAfter(dayjs(), 'day'));
  }, [data]);

  const notificationCount = currentAndFutureAnnouncements.length || 0;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleHomeClick = async () => {
    sessionStorage.setItem('showHeaderMenu', false);
    sessionStorage.removeItem('breadcrumb');
    sessionStorage.removeItem('appMenuItems');
    setActiveButton(null);
    setBackdropOpen(false);
    navigate('/home');
  };

  const handleSupportClick = () => {
    sessionStorage.setItem('breadcrumb', 'Support');
    setActiveButton('support');
    setBackdropOpen(false); // Open the backdrop
    navigate('/faqView', { state: { param: portalID, key: 'PortalId' } });
  };

  const handleNotificationClick = () => {
    setBackdropOpen(false); // Open the backdrop
    navigate('notification');
  };

  const handleActivityLogClick = () => {
    setBackdropOpen(false); // Open the backdrop
    navigate(`activityLog/${portalId}`);
  };

  const handleBackdropClick = () => {
    setBackdropOpen(false); // Close the backdrop
    setActiveButton(null); // Reset active button
  };

  const handleReportClick = () => {
    setBackdropOpen(false); // Open the backdrop
    navigate(`reports`)
  }

  if (!isAuthenticated) return null;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }} className="navbarlistcontainer">
      <Typography variant="div">
        <Typography component="div" className='navbaremailcontainer'>
          <Typography className='navbarusername'>
            John Adams
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
          <Box className="Notifications">
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationClick}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <img src={Notificationsicon} alt='Notificationsicon' /> Notifications
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
    <>
    {!isHomePage && <AlertMessage portalID={portalID} user={user}/>}
        {/* <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="warning" onClose={() => {}}>
        This Alert displays the default close icon.
      </Alert>
      </Stack> */}
    <Box sx={{ display: 'flex' }} className="navcontainer">
      <CssBaseline />
      <AppBar component="nav" className='navbarbackground'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            className="wgllogodesktop"
          >
            <Typography component="div" variant="logo" className="wgllogo">
              <Typography component="div" className="wgllogocontainer">
                <img src={logo} alt="logo" />
                {!breadcrumb && labels.eServicePortal}
                {breadcrumb && <Breadcrumb breadcrumb={breadcrumb} handleHomeClick={handleHomeClick} />}
              </Typography>
            </Typography>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <div className='nav-linksbuttons'>
              <Box className="Supporticon" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Support">
                  <IconButton
                    onClick={handleSupportClick}
                    variant="logo"
                    className={`headseticon ${activeButton === 'support' ? 'active' : ''}`}
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    {/* <img src={supporticonblue} alt="Support" /> */}
                    <img src={activeButton === 'support' ? headseticonwhite : supporticonblue} 
                         alt="Support"/>
                    <span className='none-moblie'>Support?</span>
                  </IconButton>
                </Tooltip>
              </Box>
              {/* <Box className="Supporticon" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Settings">
                  <IconButton
                   // onClick={handleSupportClick}
                    variant="logo"
                    
                    size="small"
                    sx={{ ml: 2 }}
                  >
                <img src={SettingsOutlinedIcon} alt="Support" /> 
                  
                     
                  </IconButton>
                </Tooltip>
              </Box> */}
              
              {(breadcrumb && showHeaderMenu) && (
                <>
                  <Box className="Notifications none-moblie">
                    <Typography component="span" className='Notificationscount'>{notificationCount}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                      <Tooltip title="Notifications">
                        <IconButton
                          onClick={handleNotificationClick}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          <img src={Notificationsicon} alt='Notificationsicon' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box>
                  <Reports/>
                  </Box>
                  {isPortalAdmin && <Box className="Notifications none-moblie">
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                      <Tooltip title="Activity Log">
                        <IconButton
                          onClick={handleActivityLogClick}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          <img src={ListAltOutlinedIcon} alt='ListAltOutlinedIcon' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  }
                </>
              )}
              <MyProfile showHeaderMenu={showHeaderMenu} isAdmin={isAdmin} />
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
      <Backdrop open={backdropOpen} onClick={handleBackdropClick} />
    </Box>
    </>
  );
};


export default Nav;