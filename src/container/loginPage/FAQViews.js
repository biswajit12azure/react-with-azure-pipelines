import React, { useState, useEffect } from "react";
import { TextField, Accordion, AccordionSummary, AccordionDetails, Typography, InputAdornment, CircularProgress, Fab, Popover, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { alertActions, faqAction } from "_store";
import { useNavigate,useLocation } from "react-router-dom";
import Support from "./Support";
import {  logo ,supporticon  } from 'images';
import { AppBar, CssBaseline, Divider, Drawer, IconButton, List, Toolbar, Tooltip } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { labels } from "_utils/labels";

const FAQViews = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { page } = location.state || {};
  console.log("asjgjsagjf",page);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const faqData = useSelector(x => x.faq?.faqList);
  const [mobileOpen, setMobileOpen] = React.useState(false);
const [activeButton, setActiveButton] = React.useState('');
  const [backdropOpen, setBackdropOpen] = React.useState(false); // State to manage backdrop visibility



  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
            await dispatch(faqAction.get("99")).unwrap();
     
      } catch (error) {
        const message="No Records found.";
        setError(message);
      }
    };
    fetchData();
  }, [dispatch]);

  const filteredFaq = Array.isArray(faqData) && faqData.filter(
    (faq) =>
      faq.Question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.Answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleRegister = () => {
    navigate('/register');
  }
  const handleHome = () => {
    navigate('/home');
  }
  const handleSupportClick = () => {
    sessionStorage.setItem('breadcrumb', 'Support');
    setActiveButton('support');
    setBackdropOpen(false); // Open the backdrop
    // navigate('/faqView', { state: { param: portalID, key: 'PortalId' } });
    navigate('/faqView');
  };
  //const container = window !== undefined ? () => window().document.body : undefined;
  const drawerWidth = 240;
  return (
    <Box>
     <Box sx={{ display: 'flex' }} className="navcontainer faqpagenavcontainer ">
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
                    {labels.eServicePortal}
                    
                  </Typography>
                </Typography>
              </Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <div className='nav-linksbuttons'>
                  <Box className="Loginbuttonfaq" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title={page === "Login" ? "Login" : "Register"}>
                      <IconButton
                       // onClick={handleSupportClick}
                        variant="logo"
                       
                        size="small"
                        sx={{ ml: 2 }}
                      >
                       
                       {page==="Login" ?<span  onClick={handleHome}>Login</span>:<span  onClick={handleRegister}>Register</span>}
                      </IconButton>
                    </Tooltip>
                  </Box>
                 
                </div>
              </Box>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              //container={container}
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
             
            </Drawer>
          </nav>
          
        </Box>
    <Typography className="Announcementcontainerlist ">
      <Typography variant="h4" gutterBottom className="Announcementcontent ">
        Frequently Asked Questions
      </Typography>
      <TextField
        
        variant="outlined"
        fullWidth
        className="SearchIconinput"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="SearchIcon" />
            </InputAdornment>
          ),
          'aria-label': 'search FAQs'
        }}
      />
      {error ? (
        <Typography variant="body1">
          {error}
        </Typography>
      ) : (
        <Typography className="suportcontentcontainer mar-top-16">
          {faqData && filteredFaq.length > 0 ? (
            filteredFaq.map((faq, index) => (
              <Accordion key={index} className="AccordionSummaryheadingcontent">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography className="AccordionSummaryheading" >{faq.Question}</Typography>
                </AccordionSummary>
                <AccordionDetails className="p-0">
                  <Typography className="AccordionDetailslistcontent"><div dangerouslySetInnerHTML={{ __html: faq.Answer }}></div></Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No FAQs found for your search.
            </Typography>
          )}
        </Typography>

      )}
      <Support></Support>

    </Typography>
    </Box>
  );
};

export default FAQViews;