import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

import LoginForm from './LoginForm';

export default function UserMenu({anchor,handleClose}) {


  

 

  return (
    <div>
     
      <Menu
      style={{marginTop:"50px",marginRight:"30px"}}
        id="user-menu"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={handleClose}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
      >
        <LoginForm />
      </Menu>
    </div>
  );
}
