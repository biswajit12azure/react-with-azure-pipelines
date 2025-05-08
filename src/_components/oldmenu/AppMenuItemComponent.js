import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { NavLink } from 'react-router-dom';

const AppMenuItemComponent = (props) => {
  const { className, onClick, link, children } = props;

  // If link is not set return the ordinary ListItem
  if (!link || typeof link !== 'string') {
    return (
      <ListItem
        button
        className={className}
        onClick={onClick}
      >
        {children}
      </ListItem>
    );
  }

  // Return a ListItem with a link component
  return (
    <ListItem
      button
      className={className}
      component={React.forwardRef((props, ref) => <NavLink exact {...props} innerRef={ref} />)}
      to={link}
    >
      {children}
    </ListItem>
  );
};

export default AppMenuItemComponent;

