"use client";
import React, { useState, useEffect } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { TablePagination, useMediaQuery } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import APICONSTANT from '@/services/config';
import { usePageContext } from "@/components/Providers/PageContext";
import { dispatch } from '@/redux/store';
import { addAlert } from '@/redux/slice/AlertSlice';
import { getApiMethod, putApiMethod } from '@/services/global';

import styles from './page.module.scss';

const Notifications = () => {
    const {i18} = usePageContext()
    const isAuth = (typeof window !== 'undefined' && localStorage?.getItem('appToken')) ? true : false
    const [notificationlist, setnotificationlist] = useState<any>({
        data: [],
        count: 0
    })
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setPage(1);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    const handleFetch = async () => {
        try {
            const reponse = await getApiMethod(APICONSTANT.notifications + `?_page=${page}&_limit=${rowsPerPage}`)
            if (reponse.statusCode === 200) {
                setnotificationlist({
                    count: reponse.data.totalCount ? reponse.data.totalCount : 0,
                    data: reponse.data.notifications
                })

            }
        } catch (err) {
            console.error(err)
        }
    }
    const handleDeleteOne = async (id: any) => {
        try {
            const response = await putApiMethod(APICONSTANT.notifications + `/clear/${id}`)
            if (response.statusCode === 200) {
                handleFetch()
                dispatch(addAlert({
                    isOpen: true,
                    message: 'Notification deleted',
                    type: "success",
                    severity: "success",
                }))
            }
        } catch (err) {
            console.error(err)
        }
    }
    const handleClearAll = async () => {

        try {
            const response = await putApiMethod('notifications/clearAll')
            if (response.statusCode === 200) {
                handleFetch()
                dispatch(addAlert({
                    isOpen: true,
                    message: 'Notifications deleted',
                    type: "success",
                    severity: "success",
                }))
            }
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        {
            isAuth &&
                handleFetch()
        }
    }, [page, rowsPerPage])

     // Define media queries for different screen sizes
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:960px)');

  // Determine responsive view based on screen size
  let responsiveView;
  if (isSmallScreen) {
    responsiveView = 'xs';
  } else if (isMediumScreen) {
    responsiveView = 'sm';
  } else {
    responsiveView = 'md'; // or 'lg', etc.
  }
    
    return (
        // <div className={`${styles.notify}`}>
        //     <div className={`${styles.Menuitem}`}>
        //         <div className={`${styles.Header} d-flex justify-content-between align-items-center border-bottom`}>
        //             <h5 className='m-0'>Notifications</h5>
        //             <div className={`${styles.clear}`}>
        //                 <button onClick={handleClearAll}>Clear all</button>
        //             </div>
        //         </div>
        //         {notificationlist.count !== 0 ? (
        //             <>
        //                 {notificationlist.data.map((data: any) => (
        //                     // <>
        //                     <div className={`${styles.notificationBody} `} key={data._id}>
        //                         <ListItem>
        //                             <ListItemIcon onClick={() => handleDeleteOne(data._id)}>
        //                                 <CancelIcon />
        //                             </ListItemIcon>
        //                             <ListItemText primary={data.message} />
        //                         </ListItem>
        //                         <Divider />
        //                     </div>
        //                     // </>
        //                 ))}
        //             </>
        //         ) : (
        //             <div className={`${styles.noContent} mt-5`}>
        //                 <NotificationsActiveIcon sx={{ color: '#717171', margin: 'auto' }} />
        //                 <p>Notification is empty</p>
        //             </div>
        //         )}

        //     </div>
        // </div>
        <>
            {/* <div className={`${styles.header} border-bottom`}>
                <div className='position-absolute right-0' onClick={()=>router.push('/account-settings/')}><ChevronLeftIcon /></div>
                <div >
                    <h5 className='m-0 d-flex justify-content-center'>Notifications</h5>
                </div>
            </div> */}
            <div className={`${styles.notify}`}>
                <div className={`${styles.Menuitem}`}>
                    {notificationlist.count !== 0 &&
                        <div className={`${styles.clear}`}>
                            <button onClick={handleClearAll}>{i18?.NOTIFICATION?.CLEARALL || "Clear all"}</button>
                        </div>
                    }
                    {notificationlist.count !== 0 ? (
                        <>
                            {notificationlist.data.map((data: any) => (
                                // <>
                                <div className={`${styles.notificationBody} `} key={data._id}>
                                    {/* <div className={`${styles.logo}`}>
                                    <Starlogo
                                        height="50"
                                        color="#ff385c"
                                        responsive="d-lg-block d-none" />
                                    </div> */}
                                    <ListItem>
                                        <ListItemText primary={data.message} />
                                        <ListItemIcon onClick={() => handleDeleteOne(data._id)} sx={{ display: 'flex', justifyContent: 'end' }}>
                                            <CancelIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider />
                                </div>
                                // </>
                            ))}
                        </>
                    ) : (
                        <div className={`${styles.noContent} mt-5`}>
                            <NotificationsActiveIcon sx={{ color: 'var(--svg-color)', margin: 'auto' }} /> 
                            <p>{i18?.NOTIFICATION?.NOTIFICATIONISEMPTY || "Notification is empty"}</p>
                        </div>
                    )}

                </div>

            </div>
            <div className={`${styles.stickyFooter} border-top`}>
                {notificationlist.count > 0 &&
                    <div>
                        {(responsiveView !== 'sm' && responsiveView !== 'xs') && (
                        <div className={`${styles.pagination}`}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={notificationlist.count || 0}
                                rowsPerPage={rowsPerPage}
                                page={page - 1}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage} />
                        </div>
                        )}
                    </div>
                }
            </div>
        </>
    )
}

export default Notifications