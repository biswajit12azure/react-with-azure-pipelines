import React from 'react';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import { makeStyles, createStyles } from '@material-ui/core/styles'
import AppMenuItem from './AppMenuItem';

const AppMenu = ({appMenuItems}) => {
    const classes = useStyles()
    // const auth = useSelector(x => x.auth.value);
    // const isAuthenticated= auth?.Succeeded;
    const isAuthenticated = useSelector(x => x.auth.isAuthenticated);
    // only show nav when logged in
    if (!isAuthenticated) return null;
        
    return (
      <List component="nav" className={classes.appMenu} disablePadding>
        {/* <AppMenuItem {...appMenuItems[0]} /> */}
        {appMenuItems.map((item, index) => (
          <AppMenuItem {...item} key={index} />
        ))}
      </List>
    )
};

const drawerWidth = 240

const useStyles = makeStyles(theme =>
  createStyles({
    appMenu: {
      width: '100%',
    },
    navList: {
      width: drawerWidth,
    },
    menuItem: {
      width: drawerWidth,
    },
    menuItemIcon: {
      color: '#97c05c',
    },
  }),
)

export default AppMenu;