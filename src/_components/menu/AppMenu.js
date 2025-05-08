import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import AppMenuItem from './AppMenuItem';

const AppMenu = ({ appMenuItems }) => {
  const classes = useStyles();
  const auth = useSelector(x => x.auth.value);
  const isAuthenticated = auth?.Succeeded;
  const [activeItem, setActiveItem] = useState(null);
  // only show nav when logged in
  if (!isAuthenticated) return null;

  return (
    <div className="menulist">
    <div className={classes.appMenu}>
      {appMenuItems.map((item, index) => (
        <AppMenuItem key={index}
        {...item}
        activeItem={activeItem}
        setActiveItem={setActiveItem} />
      ))}
    </div>
    </div>
  );
};

const useStyles = makeStyles(theme =>
  createStyles({
    appMenu: {
      display: 'flex',
      flexDirection: 'row', // Arrange items in a row
      justifyContent: 'flex-start', // Align items to the left
      alignItems: 'center',
      width: '100%', // Ensure it takes full width
      padding: theme.spacing(1), // Add some padding
      margin:theme.spacing(4)
    },
  }),
);

export default AppMenu;