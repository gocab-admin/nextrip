import React, { ReactNode, useState, forwardRef } from 'react';
import { Dialog, IconButton, styled } from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';

import { setModal } from '@/redux/slice/modalSlice';
import { getReviews } from '@/redux/slice/user/userAboutDataSlice';

type MyModalProps = {
  login?: string;
  buttonText: string;
  title: string;
  message: string;
  children: ReactNode;
  show: boolean;
  width?: string;
  closeModal?: any;
  type?:string
};
const PopDialog = styled(Dialog)(({ theme }) => ({
  overflow: 'hidden',
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    border: '1px solid #fff',
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
      border: '1px solid transparent',
      backgroundClip: 'content-box'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#000000bf'
    },
    [theme.breakpoints.up('sm')]: {
      borderRadius: '12px',
      border: '1px solid #fff',
      width: 'calc(100% - 32px)',
      margin: '21px'
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: '12px',
      border: '1px solid #fff',
      width: 'calc(100% - 64px)',
      margin: '32px'
    }
  }
}));

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="down" ref={ref} {...props} >{props.children}</Slide>;
});

const EditModal: React.FC<MyModalProps> = ({
  buttonText, title, message, show, children, width = 'max-w-md', closeModal, login , type
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
      if(type === 'review&raings'){
        dispatch(getReviews({} as any))
      }
    // }
  };

  return (
    <PopDialog
      open={show}
      onClose={closeModalFunc}
      TransitionComponent={Transition}
    >
      <>
        <div className='d-flex align-items-center border-bottom p-2' style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'white'
        }}>
          {/* {!login && */}
            <IconButton
              onClick={closeModalFunc}
            >
              <CloseIcon />
            </IconButton>
          {/* } */}
          <h4 className='flex-fill text-center m-0'>{title}</h4>
        </div>
        {children}
      </>
    </PopDialog>
  );
};

export default EditModal;
