import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AppMenuItemComponent from './AppMenuItemComponent';

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.elementType,
  items: PropTypes.array,
  activeItem: PropTypes.string,
  setActiveItem: PropTypes.func,
};

// Improve child items declaration
export const AppMenuItem = (props) => {
  const { name, Icon, items = [], link, activeItem, setActiveItem } = props;
  const classes = useStyles();
  const isExpandable = items && items.length > 0;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (isExpandable) {
      setAnchorEl(event.currentTarget);
    } else if (link) {
      window.location.href = link;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubMenuClick = (item) => {
    setActiveItem(item.name);
    handleClose();
  };

  const isActive = () => {
    if (activeItem === name) {
      return true;
    }
    if (items.some(item => item.name === activeItem)) {
      return true;
    }
    return false;
  };

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={`${classes.menuItem} ${isActive() ? 'active' : ''}`}
      name={name}
      link={link}
      onClick={handleClick}
      setActiveItem={setActiveItem}
    >
      {!!Icon && (
        <span className="menuItemIcon">
          <Icon />
        </span>
      )}
      {name}
      {isExpandable && (anchorEl ? <ExpandLess /> : <ExpandMore />)}
    </AppMenuItemComponent>
  );

  const MenuItemChildren = isExpandable && (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {items.map((item, index) => (
        <MenuItem key={index} onClick={() => handleSubMenuClick(item)}>
          <AppMenuItem {...item} activeItem={activeItem} setActiveItem={setActiveItem} />
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    menuItem: {
      '&.active': {
        background: '#DFEDFF',
      },
    },
  })
);

export default AppMenuItem;