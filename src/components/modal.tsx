import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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

const CustomModal = (props?: any) => {
    const { className, maxWidth, style, open, fullWidth, children, onClose, title ,sx} = props;

    return (
        <PopDialog
            open={open}
            onClose={onClose}
            className={className}
            TransitionComponent={Transition}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            style={style}
            sx={sx}
        >
            <>
                <div className='d-flex align-items-center border-bottom p-2' style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 101,
                    background: 'var(--btn-color)' 
                }}>
                    <IconButton
                        onClick={onClose}

                
                    >
                        <CloseIcon style={{color : 'var(--text-color'}}  />
                    </IconButton>
                    <h5 style={{color: 'var(--text-color)'}} className='flex-fill text-center m-0'>{title}</h5>
                </div>
                {children}
            </>
        </PopDialog >
    )
}

export default CustomModal;

