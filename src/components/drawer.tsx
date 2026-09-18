import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const RightDrawer: React.FC<RightDrawerProps> = ({ open, onClose, children }) => (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ style: {marginTop:'100px', width: "100%", height: `calc(100% - 130px)`} }}
    >
      <div  
        role="presentation"
        // style={{ width: '100%', height: '100%', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', position: 'sticky', top: '0',  background: 'white', zIndex: 1 }}>
        <h4>Choose From Gallery</h4>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {children}
      </div>
    </Drawer>
  );

export default RightDrawer;
