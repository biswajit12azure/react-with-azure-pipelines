import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const AppMenuItemComponent = (props) => {
  const { className,name, onClick, link, children ,setActiveItem} = props;

  // If link is not set, return an ordinary Button
  if (!link || typeof link !== 'string') {
    return (
      <Button
        className={className}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  // Return a Button with a link component
  return (
    <Button      
      className={className}
      component={React.forwardRef((props, ref) => <NavLink exact {...props} innerRef={ref} />)}
      to={link}
      onClick={()=>setActiveItem(name)}
    >
      {children}
    </Button>
  );
};

export default AppMenuItemComponent;