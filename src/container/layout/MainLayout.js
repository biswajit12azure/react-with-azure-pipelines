//import {useLocation} from 'react-router-dom'
import React from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { logo, headseticonwhite, bannerImg } from '../../images';
import PortalZoom from "_components/PortalZoom";
import { labels } from "_utils/labels";
import { Box,IconButton,Tooltip } from "@mui/material";

// const location = useLocation();


// if(location =='/register'){
//     //const element = document.getElementById('Bannerimages');
//     Bannerimages.classList.remove('Bannerimageslogin');
//     Bannerimages.classList.add('Bannerimagesregister');
// }
// else{
//     Bannerimages.classList.add('Bannerimageslogin');
// }
const MainLayout = () => {
    const navigate=useNavigate();
    const handleSupportClick=()=>
        {
          navigate('/faqView');
        }
   return( <>
        <PortalZoom></PortalZoom>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={4} className="wglcontainerblock">
                <div className="wglcontainer">
                    <div className="wglcontainerinn">

                        <Link href="#" variant="logo" className="wgllogo">
                            <img src={logo} alt="logo"></img>
                            {labels.eServicePortal}
                        </Link>
                        <Outlet />
                    </div>
                </div>
            </Grid>
            <Grid item xs={8} sm={7} md={8} className="mobile-none loginpagebanner">
                <div className="">
                    <div className="ration ration-1x1">

                        <img src={bannerImg} alt="Banner images"></img>
                        {/* <Link href="#"  className="NeedSupport"  >
                        <img src={headseticonwhite} alt="Do You Need Support" ></img>
                       Support?
                </Link>          */}
                        <Box className="Supporticon" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Support">
                                <IconButton
                                    onClick={handleSupportClick}
                                    variant="logo"
                                    className="NeedSupport"
                                    size="small"
                                    sx={{ ml: 2 }}
                                >
                                    <img src={headseticonwhite} alt="Support"></img>
                                    <span className='none-moblie'>Support?</span>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </div>

                </div>
            </Grid>
        </Grid>

    </>
);
}

export default MainLayout;