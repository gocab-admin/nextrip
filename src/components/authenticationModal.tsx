import React, { ReactNode, useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, styled } from '@mui/material';
import Slide from '@mui/material/Slide';

import { setModal } from '@/redux/slice/modalSlice';

type MyModalProps = {
  login?: string;
  buttonText: string;
  title: string;
  message: string;
  children: ReactNode;
  show: boolean;
  width?: string;
  closeModal?: any;
};
const PopDialog = styled(Dialog)(({ theme }) => ({
  overflow: 'hidden',
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    border: 'none',
    width: 'calc(100% - 8px)',
    margin: '10px',
    // padding: '20px',
    '&::-webkit-scrollbar': {
      // width: '5px',
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#00000080',
      borderRadius: '20px',
      border: 'none',
      backgroundClip: 'content-box'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#000000bf'
    },
    [theme.breakpoints.up('sm')]: {
      borderRadius: '12px',
      border: 'none',
      width: 'calc(100% - 32px)',
      margin: '21px'
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: '12px',
      border: 'none',
      width: 'calc(100% - 64px)',
      margin: '32px'
    }
  }
}));

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="down" ref={ref} {...props} >{props.children}</Slide>;
});

const AuthModal: React.FC<MyModalProps> = ({
  buttonText, title, message, show, children, width = 'max-w-md', closeModal, login
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const closeModalFunc = () => {
    // if (login === 'showlogin') {
    //   dispatch(setModal('LoginModal' as any));
    // } else if (login === 'showsignup') {
    //   dispatch(setModal('SignupModal' as any));
    // } else {
      dispatch(setModal('' as any));
    // }
  };

  return (
    <PopDialog
      open={show}
      onClose={closeModalFunc}
      TransitionComponent={Transition}
    >
      <>
        {/* <div className='d-flex align-items-center border-bottom p-2' style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'white'
        }}>
            <IconButton
              onClick={closeModalFunc}
            >
              <CloseIcon />
            </IconButton>

          <h3 className='flex-fill text-center m-0'>{title}</h3>
        </div> */}
        {children}
      </>
    </PopDialog>
  );
};

export default AuthModal;
