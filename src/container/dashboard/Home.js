import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CardDetail from '_components/CardDetail';
import Grid from '@mui/material/Grid2';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { AnnouncementView } from 'container/headers';

const Home = ({ handleCardClick, setBreadcrumb }) => {
  const navigate = useNavigate();
  const authUser = useSelector(x => x.auth.value);
  const user = authUser?.Data;
  const userAccess = user?.UserAccess;
  const adminList = user?.UserAccess?.filter(access =>
    ["admin", "reviewer"].includes(access.Role.toLowerCase())
  );

  const portalData = adminList ? adminList?.map(admin => ({
    PortalId: admin.PortalId,
    PortalName: admin.PortalName,
    PortalKey: admin.PortalKey,
  })) : [];

  const defaultPortalId = portalData ? portalData[0]?.PortalId : 0;

  const isAdmin = userAccess?.some(access => access.Role.toLowerCase().includes('admin'));
  const securityReviewer = userAccess?.find(access => access.Role.toLowerCase().includes('reviewer'));
  const isMBAdmin = userAccess?.some(access => (access?.PortalKey?.toLowerCase() === 'mb' && access.Role.toLowerCase().includes('admin')));
  let data = userAccess?.flatMap(item => {
    switch (item.PortalKey.toLowerCase()) {
      case 'ai':
        return [{
          name: "accountinquiry",
          title: "Account Inquiries",
          description: item.PortalName,
          path: "dashboardAI",
          portalKey: item.PortalKey,
          portalID: item.PortalId
        }];
      case 'ea':
        return [{
          name: "energyAssistance",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardEA",
          portalKey: item.PortalKey,
          portalID: item.PortalId
        }];
      case 'mb':
        return [{
          name: "marketer",
          title: item.PortalName,
          description: item.PortalName,
          path: "nomination",
          portalKey: item.PortalKey,
          portalID: item.PortalId
        }];
      case 'mc':
        return [{
          name: "mapcenter",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardMC",
          portalKey: item.PortalKey,
          portalID: item.PortalId
        }];
      case 'sd':
        return [{
          name: "diversity",
          title: item.PortalName,
          description: item.PortalName,
          path: "dashboardSD",
          portalKey: item.PortalKey,
          portalID: item.PortalId
        }];
      default:
        return [];
    }
  }) || [];

  const adminManagement = {
    title: "Admin Portal",
    name: "admin",
    description: "Portal Admin",
    path: `userprofile/${defaultPortalId}`,
    portalKey: "admin",
    portalID: 99,
    Icon: SettingsIcon
  };

  if (securityReviewer) {
    const securityreviewermanagement = {
      title: "Map Center",
      name: "reviewer",
      description: "Security Reviewer",
      path: "userprofile/3",
      portalKey: "reviewer",
      portalID: 99
    };
    data = [securityreviewermanagement];
  } else if (isAdmin) {
    data = [...data, adminManagement];
  }


  useEffect(() => {
    sessionStorage.removeItem('breadcrumb');
    sessionStorage.removeItem('appMenuItems');
    sessionStorage.setItem('showHeaderMenu', false);
    if (data.length === 1) {
      sessionStorage.setItem('portalID', data[0].portalID);
      handleCardClick(data[0].portalKey, isAdmin, data[0].path);
      sessionStorage.setItem('breadcrumb', data[0].title);
      sessionStorage.setItem('showHeaderMenu', true);
    } else {
      const adminItem = data.find(item => item.name === 'admin');
      if (adminItem) {
        sessionStorage.setItem('portalID', 98);
      }
    }
  }, [data, isAdmin, handleCardClick]);

  const handleClick = (portalKey, path, portalID, title) => {
    sessionStorage.setItem('portalID', portalID);
    handleCardClick(portalKey, isMBAdmin, path);
    sessionStorage.setItem('breadcrumb', title);
    sessionStorage.setItem('showHeaderMenu', true);
    navigate(`/${path}`);
  };

  if (!Array.isArray(data)) {
    return null;
  }

  if (data.length === 1) {
    return null;
  }

  return (
    <div>
      <Typography component="div" className='dashbordpage'>
        <Typography component="div" className='userprofilelist'>
          <Typography variant="h2" >Select a portal</Typography>
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container direction="row" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 8 }} className='CardDetailContainer'>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8, sm: 8, md: 12 }}>
                {data.map((card) =>

                  <CardDetail {...card} handleClick={() => handleClick(card.portalKey, card.path, card.portalID, card.title)} />

                )}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} className='CardDetailContainer-right'>
              <Typography variant="div" component="div" className="">
                <Typography variant="h3" component="h3" className="Announcements-text">Announcements</Typography>
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