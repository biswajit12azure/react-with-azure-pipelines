import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { labels } from "_utils/labels";
import { logo, supporticonblue, } from 'images';
import { Box,  IconButton,  Typography, Tooltip } from "@mui/material";
import { Breadcrumb } from "_components";

const Header = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = React.useState('');
    const breadcrumb = sessionStorage.getItem('breadcrumb') || '';
    const id = sessionStorage.getItem('mapcenterUserID') || 99;
    
    const handleSupportClick = () => {
        sessionStorage.setItem('breadcrumb', 'Support');
        setActiveButton('support');
        navigate('faqView');
    }
    const handleHomeClick = async () => {
        sessionStorage.removeItem('breadcrumb');
        setActiveButton(null);
        navigate(`/registration/mapCenter/mc/${id}`);
      }
    return (
        <>
            <nav className="navbar navbar-expand  nav-bar-container">
                <div className='container'>
                    <div className="navbar-nav">
                        <Typography component="div" variant="logo" className="wgllogo">
                            <Typography component="div" className="wgllogocontainer" >
                                    <img src={logo} alt="logo" />
                                    {!breadcrumb && labels.eServicePortal}
                                 {breadcrumb && <Breadcrumb breadcrumb={breadcrumb} handleHomeClick={()=>handleHomeClick()}/>}
                            </Typography>
                        </Typography>
                        <div className='nav-linksbuttons'>
                            {/* <Support></Support> */}
                            <Box className="Supporticon" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                <Tooltip title="Support">
                                    <IconButton
                                        onClick={handleSupportClick}
                                        variant="logo"
                                        className={`headseticon ${activeButton === 'support' ? 'active' : ''}`}
                                        size="small"
                                        sx={{ ml: 2 }}
                                    >
                                        <img src={supporticonblue} alt="Support"></img>
                                        <span className='none-moblie'>Support?</span>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Header;