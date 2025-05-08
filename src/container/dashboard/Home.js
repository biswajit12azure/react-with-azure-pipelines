import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CardDetail from '_components/CardDetail';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { experimentalStyled as styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import { AnnouncementView } from 'container/headers';

const Home = ({ handleCardClick }) => {
  const authUser = useSelector(x => x.auth.value);
  const navigate = useNavigate();
  const user = authUser?.Data;
  const userAccess= user?.UserAccess;

  //const isAdmin = user?.UserDetails?.isAdmin;
  const isAdmin = userAccess?.some(access=> access.Role.toLowerCase().includes('admin'));
  const isMBAdmin =userAccess?.some(access=> (access?.PortalKey?.toLowerCase() === 'mb' && access.Role.toLowerCase().includes('admin')));
  let data = userAccess?.flatMap(item => {
    switch (item.PortalKey.toLowerCase()) {
      case 'ai':
        return [{
          name: "accountinquiry",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardAI",
          portalKey: item.PortalKey,
          portalID:item.PortalId
        }];
      case 'ea':
        return [{
          name: "energyAssistance",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardEA",
          portalKey: item.PortalKey,
          portalID:item.PortalId
        }];
      case 'mb':
        return [{
          name: "marketer",
          title: item.PortalName,
          description: item.PortalName,
          path: "nomination",
          portalKey: item.PortalKey,
          portalID:item.PortalId
        }];
      case 'mc':
        return [{
          name: "mapcenter",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardMC",
          portalKey: item.PortalKey,
          portalID:item.PortalId
        }];
      case 'sd':
        return [{
          name: "diversity",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardSD",
          portalKey: item.PortalKey,
          portalID:item.PortalId
        }];
      default:
        return [];
    }
  }) || [];

  const usermanagement = {
    title: "Admin Portal",
    name: "admin",
    description: "Portal Admin",
    path: "userprofile",
    portalKey: "admin",
    portalID:99,
    Icon:SettingsIcon
  };

  data = isAdmin ? [...data, usermanagement] : data;

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

  useEffect(() => {
    if (data.length === 1) {
      // If the user has access to only one portal, navigate to that portal directly
      localStorage.setItem('portalID', data[0].portalID);
      handleCardClick(data[0].portalKey, isAdmin, data[0].path);
    }
  }, [data, isAdmin, handleCardClick]);

  const handleClick = (portalKey, path,portalID) => {
    localStorage.setItem('portalID', portalID);
    handleCardClick(portalKey, isMBAdmin, path);
  };

  // Ensure data is an array before mapping
  if (!Array.isArray(data)) {
    return null;
  }

  if (data.length === 1) {
    // Render nothing if the user is being redirected
    return null;
  }

  return (
    <div>
      <Typography component="div" className=' dashbordpage'>

        {/* <h1 className='welcometext'>{`Welcome, ${user?.UserDetails?.FirstName} ${user?.UserDetails?.LastName}`}</h1> */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container direction="row" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 8 }} className='CardDetailContainer' >

              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8, sm: 8, md: 12 }}>

                {data.map((card) =>

                  <Grid size={{ xs: 12, sm: 4, md: 4 }} key={card.id} className="CardDetail">
                    <Item>
                      <CardDetail {...card} handleClick={() => handleClick(card.portalKey, card.path,card.portalID)} />
                    </Item>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className='CardDetailContainer-right'>
              <Typography variant="div" component="div" className="">
                <Typography variant="h3" component="h3" className="Announcements-text">Announcements</Typography>
                {/* <Typography className='Announcementcontainer' component="div" >
                <Typography className='Announcementsnew' component="div" >
                    <Grid container>
                      <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Typography component="div" className="dateMonth">
                          <Typography component="h2">
                            29
                          </Typography>
                          <Typography component="span">
                            Nov
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12, md: 10 }}>
                        <Typography component="div">
                          <Typography component="h3" className='title'>Management</Typography>
                          <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                  <Typography className='Announcementsnew' component="div" >
                    <Grid container>
                      <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Typography component="div" className="dateMonth">
                          <Typography component="h2">
                            29
                          </Typography>
                          <Typography component="span">
                            Nov
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12, md: 10 }}>
                        <Typography component="div">
                          <Typography component="h3" className='title'>Management</Typography>
                          <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                  <Typography className='Announcementsnew' component="div" >
                    <Grid container>
                      <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Typography component="div" className="dateMonth">
                          <Typography component="h2">
                            29
                          </Typography>
                          <Typography component="span">
                            Nov
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12, md: 10 }}>
                        <Typography component="div">
                          <Typography component="h3" className='title'>Management</Typography>
                          <Typography component="p" className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</Typography>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>

                </Typography> */}
                <AnnouncementView isCardDashboard={true}></AnnouncementView>
              </Typography>
            </Grid>
          </Grid>
        </Box>

      </Typography>

    </div>
  );
}

export default Home;