"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter, useSearchParams } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { deleteApiMethod, getApiMethod, putApiMethod } from "@/services/global";
import { APIURLS } from "@/services/config";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import DeleteIcon from "@mui/icons-material/Delete";
import isAuth from "@/components/isAuth";
import { dispatch } from "@/redux/store";
import { addAlert } from "@/redux/slice/AlertSlice";
import { Edit, Website } from "@/app/global/svg";
import {
  StyledTableCell,
  StyledTableRow
} from "@/components/styledComponent/styledcomp";
import TableSkeleton from "@/components/tableskeleton";
import { usePageContext } from "@/components/Providers/PageContext";
import getStepsUrl from "@/services/utils/getPropertySteps";
// import Header from '@/components/header';
// import CustomModal from '@/components/modal';

import "@/components/header.scss";
import styles from "./page.module.scss";
import Create from "../../../../../public/svg/create.svg";
import { handleImageError } from '@/services/utils/utils';
// import { Android12Switch } from "@/components/switch";


dayjs.extend(relativeTime);

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const Checkbox = dynamic(() => import("@mui/material/Checkbox"));
const FormGroup = dynamic(() => import("@mui/material/FormGroup"));
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const FormControlLabel = dynamic(
  () => import("@mui/material/FormControlLabel")
);
const Switch = dynamic(() => import("@mui/material/Switch"));
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const Button = dynamic(() => import("@mui/material/Button"));
const Grid = dynamic(() => import("@mui/material/Grid"));
const InputBase = dynamic(() => import("@mui/material/InputBase"));
const Modal = dynamic(() => import("@mui/material/Modal"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const Badge = dynamic(() => import("@mui/material/Badge"));
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false
});
const Box = dynamic(() => import("@mui/material/Box"));
const Link = dynamic(() => import("next/link"));
const CustomModal = dynamic(() => import("@/components/modal"));
const Header = dynamic(() => import("@/app/ads/components/adsHeader"));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4
};

const Ads = () => {
  const { i18 } = usePageContext();
  const searchParams: any = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openAmenities, setOpenAmenities] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [bedRoom, setBedRoom] = useState(0);
  const [bathRoom, setBathRoom] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmit, setModalSubmit] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [value, setValue] = React.useState("");
  const [data, setData] = useState({
    total: 0,
    listingdata: []
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [rowId, setRowId] = useState("");
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [amenityData, setamenityData] = useState<any>([]);
  const [checkedAmenities, setCheckedAmenities] = useState<string[]>([]);
  const [responsiveView, setResponsiveView] = useState<any>("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { }, [responsiveView]);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const data: any = {}
    if (search.bedRoom) {
      data.bedRoom = search.bedRoom
      setBedRoom(search.bedRoom)
    }
    if (search.bathRoom) {
      data.bathRoom = search.bathRoom
      setBathRoom(search.bathRoom)
    }
    if (search.list === 'listed') {
      data.list = search.list
      setValue(search.list)
    }
    if (search.list === 'unListed') {
      data.list = search.list
      setValue(search.list)
    }
    if (search.list === 'inProgress') {
      data.list = search.list
      setValue(search.list)
    }
    if (search.list === 'incomplete') {
      data.list = search.list
      setValue(search.list)
    }
    if (search.amenities) {
      data.amenities = `[${search.amenities}]`;
      setCheckedAmenities(search.amenities?.split(','))
    }
    //setIsLoading(true)
    fetchData(data)
  }, [searchParams, searchValue, page, rowsPerPage])

  const handleClose = () => {
    setModalOpen(false);
    setModalSubmit(true);
  };

  const handleBack = () => {
    setModalOpen(true);
    setModalSubmit(false);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleCloseAmenities = () => {
    setOpenAmenities(false);
  };
  const handleOpenStatus = () => {
    setOpenStatus(true);
  };

  const handleCloseStatus = () => {
    setOpenStatus(false);
  };
  const bedIncrement = () => {
    setBedRoom(bedRoom + 1);
  };

  const bathIncrement = () => {
    setBathRoom(bathRoom + 1);
  };

  const bedDecrement = () => {
    if (bedRoom > 0) {
      setBedRoom(bedRoom - 1);
    }
  };

  const bathDecrement = () => {
    if (bathRoom > 0) {
      setBathRoom(bathRoom - 1);
    }
  };

  const clearRoomdata = (type: string) => (e: any) => {
    if (type === "bed") {
      if (search.bathRoom || search.bedRoom) {
        delete search.bathRoom;
        delete search.bedRoom;
        setBathRoom(0);
        setBedRoom(0);
        setOpen(false);
      }
      setBathRoom(0);
      setBedRoom(0);
      // setOpen(false)
    }
    if (type === "amenity") {
      if (search.amenities) {
        delete search.amenities;
        setCheckedAmenities([]);
        setOpenAmenities(false);
      }
      setCheckedAmenities([]);
      // setOpenAmenities(false)
    }
    if (type === "status") {
      if (search.list) {
        delete search.list;
        setValue("");
        setOpenStatus(false);
      }
      setValue("");
      setOpenStatus(false);
    }
    const queryString = Object.keys(search)
      .map((key) => `${key}=${encodeURIComponent(search[key])}`)
      .join("&");
    router.push(`?${queryString}`);
  };

  const handleChangeCheck = (event: any) => {
    const isCheck = (event.target as HTMLInputElement).checked
    if (isCheck) {
      setValue((event.target as HTMLInputElement).value);
    } else {
      setValue('')
    }
  };

  const fetchData = async (data?: any) => {
    try {
      const res = await getApiMethod(
        `${ADSAPICONSTANT.hostListings
        }?_page=${page}&_limit=${rowsPerPage}&search=${searchValue}`,
        data
      );
      if (res.statusCode === 200) {
        setIsLoading(false);
        setData({
          listingdata: res.data.providerAds,
          total: res.data.total
        });
      } else {
        console.error(`API request failed with status: ${res.status}`);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenSoldModal = (id: any) => {
    setRowId(id)
    setSoldModalOpen(true);
  }

  const handleCloseModal = () => setSoldModalOpen(false);

  const handleMarkAsSold = async () => {
    try {
      const response = await putApiMethod(`ads/sold/${rowId}`)
      if (response.statusCode === 200) {
        setSoldModalOpen(false);
        fetchData();
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (error: any) {
      dispatch(
        addAlert({
          isOpen: true,
          message: error?.response?.data?.message,
          type: "warning",
          severity: "warning",
        })
      );
    }
  };


  const handleDelete = async (id: any) => {
    setOpenDelete(true);
    setRowId(id);
  };

  const handleDeleteAPI = async () => {
    try {
      const response = await deleteApiMethod(`ads/delete/${rowId}`);
      if (response.statusCode === 200) {
        setOpenDelete(false);
        fetchData();
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success"
          })
        );
      }
    } catch (err: any) {
      dispatch(
        addAlert({
          isOpen: true,
          message: err.response.data.message,
          type: "warning",
          severity: "warning"
        })
      );
    }
  };

  const handleApplyFilters = () => {
    const data: any = {};
    if (bedRoom > 0) {
      data.bedRoom = bedRoom;
    }
    if (bathRoom > 0) {
      data.bathRoom = bathRoom;
    }
    if (value) {
      data.list = value;
    }
    if (checkedAmenities.length > 0) {
      data.amenities = checkedAmenities.join();
    }
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    router.push(`?${queryString}`);
    setOpen(false);
    setOpenAmenities(false);
    setOpenStatus(false);
  };

  const handleChangeAmenityCheck = (categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedAmenities((prevChecked) => [...prevChecked, categoryId]);
    } else {
      setCheckedAmenities((prevChecked) =>
        prevChecked.filter((id) => id !== categoryId)
      );
    }
  };

  const handleResize = () => {
    const windowWidth = window.innerWidth;

    const breakpoints = [
      { name: "xs", width: 0, maxWidth: 575 },
      { name: "sm", width: 576, maxWidth: 767 },
      { name: "md", width: 768, maxWidth: 991 },
      { name: "lg", width: 992, maxWidth: 1199 },
      { name: "xl", width: 1200, maxWidth: 1399 },
      { name: "xxl", width: 1400 }
    ];

    let responsiveVw =
      breakpoints.find(
        (bp: any) => windowWidth >= bp?.width && windowWidth <= bp?.maxWidth
      )?.name || "xxl";

    if (responsiveVw !== responsiveView) {
      setResponsiveView(responsiveVw);
    }
  };

  const showMore = (type: any) => {
    if (type === "more") {
      setDisplayCount(amenityData.length);
      setShowAll(true);
    }
    if (type === "less") {
      setDisplayCount(6);
      setShowAll(false);
    }
  };

  const handleNavigateForm = async (row: any) => {
    if (row.status === 'pending') {
      const res = await getApiMethod(ADSAPICONSTANT.getSteps);
      const stepData = Array.isArray(res?.data?.steps) ? res?.data?.steps : [];
      const progress = parseInt(row.progressPercentage)
      let mypages = ["/"]; // First page
      if (Array.isArray(stepData)) {
        for (let i = 0; i < stepData.length; ++i) {
          const stepPages = getStepsUrl(stepData[i].pages, row._id, i);
          mypages = [...mypages, ...stepPages.steps];
        }
      }
      if (!Number.isNaN(progress)) {
        let url = mypages[progress]
        if (url) {
          url = url.replace(/\/{2,}/g, '/'); // remove duplicate /
          return router.push(`/ads/form${url}`);
        }
      }
    }
    router.push(`/manage-ad?id=${row._id}`);
  }

  return (
    <>
      <div className={`${styles.listings} px-2`}>
        <div>
          <Header
            page="hide"
            center={
              responsiveView === "sm" || responsiveView === "xs"
                ? "center"
                : "inbox"
            }
            type="provider"
          />
        </div>
        <div className="d-flex justify-content-between align-items-center py-3 px-4">
          <div>
            <h5>
              {data.total} {i18?.ADS?.ADS || "Ads"}
            </h5>
          </div>
          <div>
            <Link
              href="/ads/form"
              className={`${styles.createlist} d-flex align-items-center`}
            >
              <AddIcon />
              {i18?.ADS?.CREATEADS || "Create Ads"}
            </Link>
          </div>
        </div>
        <div className={`${styles.filter} `}>
          <span
            className={`${styles.searchbox} rounded-pill text-secondary me-4`}
          >
            <IconButton type="button" aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ flex: 1 }}
              placeholder={`${i18?.ADS?.SEARCHADS || "Search Ads"
                }`}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </span>
          <div className={`${styles.filter_data}`}>
            {/* <button
                            className={`${styles.button} rounded-pill text-black py-2 px-3 me-2 position-relative`}
                            onClick={handleOpenMenu}
                        >
                            <Badge color="error" badgeContent="" variant="dot" invisible={(search.bathRoom || search.bedRoom) ? false : true} >
                                <div className='d-flex align-items-center justify-content-center'>
                                    <span>{i18?.LISTING?.ROOMSBED || "Rooms & bed"}</span>
                                </div>
                            </Badge>
                        </button> */}

            <button
              className={`${styles.button} rounded-pill text-black py-2 px-3 me-2 position-relative`}
              onClick={() => handleOpenStatus()}
            >
              <Badge
                badgeContent=""
                variant="dot"
                invisible={search.list ? false : true}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--btn-bg-color)!important"
                  }
                }}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <span>
                    {" "}
                    {i18?.ADS?.ADSSTATUS || "Ads status"}
                  </span>
                </div>
              </Badge>
            </button>
          </div>
          {/* <Button className={`${styles.button} rounded-pill text-black py-0 px-3 me-2`} onClick={() => handleOpenMenu()}
                        endIcon={<ArrowForwardIosIcon className={`${styles.iosicon}`} />}>
                        More filters
                    </Button> */}
        </div>
        {isLoading ? (
          <div>
            <TableSkeleton />
          </div>
        ) : (
          <div className={`${styles.scroll}`}>
            <div className={`${styles.scrollcontent} d-flex flex-column px-3`}>
              <div className={`${styles.tables}`}>
                {data.total > 0 ? (
                  <>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {/* <StyledTableCell
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 'bold',
                                                            width: '60px',
                                                            position: 'sticky',
                                                            backgroundColor: '#ffffff !important',
                                                            left: 0,
                                                            zIndex: 1,
                                                        }}
                                                        align="left"
                                                    >
                                                        <Checkbox size="small"
                                                        sx={{
                                                            color: 'black',
                                                            '&.Mui-checked': {
                                                                color: 'black',
                                                            },
                                                        }}
                                                    />
                                                    </StyledTableCell> */}
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                width: "150px",
                                // position: 'sticky',
                                // backgroundColor: '#ffffff !important',
                                textTransform: "Uppercase",
                                left: 0,
                                zIndex: 1
                              }}
                              align="left"
                            >
                              {i18?.ADS?.LISTING || "Ads"}
                            </StyledTableCell>
                            {/* <TableCell sx={{ width: '150px', whiteSpace: 'nowrap', fontWeight: 'bold' }} align="center">Id</TableCell> */}
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                width: "150px",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            >
                              {i18?.TRIPS?.STATUS || "Status"}
                            </StyledTableCell>
                            {/* <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">To Do</TableCell> */}
                            {/* <StyledTableCell  className='host-listing-table' sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px', textTransform: 'Uppercase' }} align="center">{i18?.LISTING?.INSTANTBOOK || "Instant book"}</StyledTableCell>
                                                        <StyledTableCell  className='host-listing-table' sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px', textTransform: 'Uppercase' }} align="center">{i18?.FILTER?.BEDROOMS || "Bedrooms"}</StyledTableCell>
                                                        <StyledTableCell  className='host-listing-table' sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px', textTransform: 'Uppercase' }} align="center">{i18?.FILTER?.BEDS || "Beds"}</StyledTableCell>
                                                        <StyledTableCell  className='host-listing-table' sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.LISTING?.BATHS || "Baths"}</StyledTableCell> */}
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            >
                              {i18?.LISTING?.LOCATION || "Location"}
                            </StyledTableCell>
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            >
                              {i18?.LISTING?.LASTMODIFICATION ||
                                "Last Modification"}
                            </StyledTableCell>
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            >
                              {i18?.TRIPS?.AVAILABILITYSTATUS || "Availability Status"}
                            </StyledTableCell>
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            >
                              {i18?.TRIPS?.ACTION || "Action"}
                            </StyledTableCell>
                            <StyledTableCell
                              className="host-listing-table"
                              sx={{
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                textTransform: "Uppercase"
                              }}
                              align="center"
                            ></StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {data &&
                            data.listingdata?.map((row: any, index: any) => (
                              <>
                                <StyledTableRow
                                  key={row._id}
                                  // hover
                                  sx={{
                                    // '&:nth-of-type(odd)': {
                                    //     backgroundColor: '#dddddd',
                                    // },
                                    "&:last-child td, &:last-child th": {
                                      border: 0
                                    }
                                  }}
                                >
                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{
                                      paddingLeft: 2,
                                      whiteSpace: "nowrap"
                                    }}
                                    align="left"
                                    onClick={() => handleNavigateForm(row)}
                                  >
                                    <div className={`d-flex ${styles.flex}`}>
                                      <div className={`${styles.box}`}>
                                        {row?.coverImage?.length > 0 ? (
                                          <ImageComponent
                                            width={60}
                                            height={40}
                                            src={
                                              row.coverImage
                                            }
                                            onError={handleImageError}
                                            alt="pro"
                                          />
                                        ) : (
                                          <HomeIcon sx={{ color: "white" }} />
                                        )}
                                      </div>

                                      <p>{row.name}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                                    align="center"
                                  >
                                    {row.status}
                                  </TableCell>
                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                                    align="center"
                                  >
                                    {row.address?.city === ""
                                      ? "--"
                                      : `${row.address?.city
                                      }, ${row.address?.country}`}
                                  </TableCell>
                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{ whiteSpace: "nowrap" }}
                                    align="center"
                                  >
                                    {row?.updatedAt
                                      ? dayjs(row?.updatedAt).fromNow()
                                      : "--"}
                                  </TableCell>

                                  {row?.status !== "sold" ? (
                                    <TableCell
                                      className="host-listing-cell"
                                      sx={{ whiteSpace: "nowrap" }}
                                      align="center"
                                      onClick={() => handleOpenSoldModal(row?._id)}
                                    >
                                      <button
                                        className="mark-sold-button"
                                        style={{
                                          border: "2px solid #ff6347", 
                                          borderRadius: "50px",        
                                          backgroundColor: "transparent", 
                                          color: "#ff6347",            
                                          padding: "5px 15px",         
                                          cursor: "pointer",           
                                        }}
                                      >
                                        Mark as Sold
                                      </button>
                                    </TableCell>
                                  ) : (
                                    <TableCell
                                      className="host-listing-cell"
                                      sx={{ whiteSpace: "nowrap" }}
                                      align="center"
                                    >
                                      <span
                                        className="sold-badge"
                                        style={{
                                          display: "inline-block",
                                          backgroundColor: "#4cb557",
                                          color: "#fff",
                                          borderRadius: "50px",
                                          padding: "5px 15px",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Sold
                                      </span>
                                    </TableCell>
                                  )}

                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{ whiteSpace: "nowrap" }}
                                    align="center"
                                    onClick={() => handleDelete(row._id)}
                                  >
                                    <DeleteIcon
                                      style={{ cursor: "pointer" }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    className="host-listing-cell"
                                    sx={{ whiteSpace: "nowrap" }}
                                    align="center"
                                    onClick={() => handleNavigateForm(row)
                                    }
                                  >
                                    <Edit
                                      className="me-3"
                                      style={{
                                        cursor: "pointer",
                                        display: "block",
                                        height: "30px",
                                        width: "30px",
                                        fill: "transparent"
                                      }}
                                    />
                                  </TableCell>
                                </StyledTableRow>
                              </>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className={`${styles.pagination}`}>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.total}
                        rowsPerPage={rowsPerPage}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className={`${styles.list} d-flex justify-content-center align-items-center`}
                  >
                    <div className={`${styles.bookinglist} `}>
                      <div className="py-2">
                        <ImageComponent src={Create} alt="create" />
                      </div>
                      <div className="py-2">
                        <h6>
                          {i18?.ADS?.CREATEANEWADS || "Create a new Ads"}
                        </h6>
                      </div>
                      <div className="py-2">
                        <p className="m-0">
                          {i18?.ADS?.YOUDONTHAVEANYADSON ||
                            "You dont have any ads on"}{" "}
                          <Website /> {i18?.LISTING?.RIGHTNOW || "Right now"}.
                          <br />{" "}
                          {i18?.ADS?.CREATEANEWADSINGTO ||
                            "create a new ads to start getting bookings"}
                          .
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/ads/form"
                          className={`${styles.createlist} bg-white`}
                        >
                          {i18?.ADS?.CREATEADS || "Create Ads"}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className='py-3'>
                            <button className={`${styles.feedback} border-0`} onClick={handleClickFeed} >
                                Give feedback
                            </button>
                        </div> */}
            </div>
          </div>
        )}
      </div>



      <CustomModal open={open} onClose={handleCloseMenu}>
        <div className={`p-3`}>
          <div className="d-flex justify-content-between p-3">
            <div>
              <p>{i18?.LISTING?.BEDOROOM || "Bed room"}</p>
            </div>
            <div className="d-flex gap-5 align-items-center">
              <div>
                <Button
                  disabled={bedRoom === 0 ? true : false}
                  onClick={bedDecrement}
                  sx={{ color: "black" }}
                >
                  <RemoveIcon />
                </Button>
              </div>
              <div>
                <Typography textAlign={"center"}>{bedRoom}</Typography>
              </div>
              <div>
                <Button sx={{ color: "black" }} onClick={bedIncrement}>
                  <AddIcon />
                </Button>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between p-3">
            <div>
              <p>{i18?.LISTING?.BATHROOM || "Bathroom"}</p>
            </div>
            <div className="d-flex gap-5 align-items-center">
              <div>
                <Button
                  className={`${styles.cursorevent}`}
                  disabled={bathRoom === 0 ? true : false}
                  onClick={bathDecrement}
                  sx={{ color: "black" }}
                >
                  <RemoveIcon />
                </Button>
              </div>
              <div>
                <Typography textAlign={"center"}>{bathRoom}</Typography>
              </div>
              <div>
                <Button sx={{ color: "black" }} onClick={bathIncrement}>
                  <AddIcon sx={{ color: "black" }} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Grid className={`${styles.stickybtn} border-top`}>
          <Grid>
            <Button sx={{ color: "error.main" }} onClick={clearRoomdata("bed")}>
              {i18?.LISTING?.CLEAR || "Clear"}
            </Button>
          </Grid>
          <Grid>
            <DynamicButtonComponent
              onClick={handleApplyFilters}
              text={i18?.LISTING?.APPLY || "Apply"}
            />
          </Grid>
        </Grid>
      </CustomModal>

      <CustomModal
        open={openAmenities}
        onClose={handleCloseAmenities}
        title={i18?.LISTING?.CHOOSEAMENITIES || "Choose Amenities"}
      >
        <div className={`p-3`}>
          {amenityData.slice(0, displayCount).map((data: any) => (
            <FormGroup key={data.categoryId}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#717171",
                      "&.Mui-checked": {
                        color: "black"
                      }
                    }}
                    onChange={(event) =>
                      handleChangeAmenityCheck(data._id, event.target.checked)
                    }
                    checked={checkedAmenities?.includes(data._id)}
                  />
                }
                label={data.name}
              />
            </FormGroup>
          ))}
          {amenityData.length > 6 &&
            (showAll ? (
              <button
                onClick={() => showMore("less")}
                className={`${styles.bttn}`}
              >
                {i18?.FILTER?.SHOWLESS || "Show less"}
              </button>
            ) : (
              <button
                onClick={() => showMore("more")}
                className={`${styles.bttn}`}
              >
                {i18?.FILTER?.SHOWMORE || "Show more"}
              </button>
            ))}
        </div>

        <Grid className={`${styles.stickybtn} border-top`} >
          <Grid >
            <Button sx={{ color: 'error.main' }} onClick={clearRoomdata('amenity')}>
              {i18?.LISTING?.CLEAR || "Clear"}
            </Button>
          </Grid>
          <Grid >
            <Button onClick={handleApplyFilters}
              disabled={checkedAmenities.length === 0}
              sx={{
                borderColor: checkedAmenities.length === 0 ? '#BDBDBD' : 'var(--btn-color)',
                color: checkedAmenities.length === 0 ? '#757575 !important' : 'var(--btn-color) !important',
                backgroundColor: checkedAmenities.length === 0 ? '#E0E0E0' : 'var(--text-color)',
                '&:hover': {
                  backgroundColor: checkedAmenities.length === 0 ? '#E0E0E0' : 'var(--text-color)'
                },
                cursor: checkedAmenities.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >{i18?.LISTING?.APPLY || "Apply"}
            </Button>
          </Grid>
        </Grid>
      </CustomModal>

      <CustomModal open={openStatus} onClose={handleCloseStatus}>
        <div className={`p-3`}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#717171",
                    "&.Mui-checked": {
                      color: "black"
                    }
                  }}
                />
              }
              label="Listed"
              value="listed"
              checked={value === "listed"}
              onChange={handleChangeCheck}
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#717171",
                    "&.Mui-checked": {
                      color: "black"
                    }
                  }}
                />
              }
              label="Unlisted"
              value="unListed"
              checked={value === "unListed"}
              onChange={handleChangeCheck}
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#717171",
                    "&.Mui-checked": {
                      color: "black"
                    }
                  }}
                />
              }
              label="Inprogress"
              value="inProgress"
              checked={value === "inProgress"}
              onChange={handleChangeCheck}
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#717171",
                    "&.Mui-checked": {
                      color: "black"
                    }
                  }}
                />
              }
              label="Incomplete"
              value="incomplete"
              checked={value === "incomplete"}
              onChange={handleChangeCheck}
            />
          </FormGroup>
        </div>

        <Grid className={`${styles.stickybtn} border-top`}>
          <Grid >
            <Button sx={{ color: 'error.main' }} onClick={clearRoomdata('status')}>
              {i18?.LISTING?.CLEAR || "Clear"}
            </Button>
          </Grid>
          <Grid >
            <Button onClick={handleApplyFilters} disabled={value === ""}
              sx={{
                borderColor: value === "" ? '#BDBDBD' : 'var(--btn-color)',
                color: value === "" ? '#757575 !important' : 'var(--btn-color) !important',
                backgroundColor: value === "" ? '#E0E0E0' : 'var(--text-color)',
                '&:hover': {
                  backgroundColor: value === "" ? '#E0E0E0' : 'var(--text-color)'
                },
                cursor: value === "" ? 'not-allowed' : 'pointer'
              }}>
              {i18?.LISTING?.APPLY || "Apply"}
            </Button>
          </Grid>
        </Grid>
      </CustomModal>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box sx={style}>
          <>
            <div className={`${styles.modal_group}`}>
              <div className="">
                <button
                  aria-label="Close"
                  onClick={() => {
                    setModalOpen(false);
                  }}
                  type="button"
                  className={`${styles.close} border-0 ps-0 p-2`}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={`${styles.modal_header} py-2`}>
                <h4 className={`${styles.feedback}`}>
                  {i18?.LISTING?.GIVEFEEDBACK || "Give feedback"}
                </h4>
              </div>
              <section>
                <fieldset className={`${styles.fieldset}`}>
                  <p className="">
                    {i18?.LISTING?.PLEASELETUS ||
                      "Please let us know what your feedback is about we review all but are unable to respond individually"}
                  </p>
                  <div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_0"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="general"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.GENERALFEEDBACK ||
                                "General feedback about the listing page"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_1"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="quickReplies"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.SEARCHINGFILTERING ||
                                "Searching, filtering or sorting listings"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="scheduledMessages"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.MAKINGCHANGESTO ||
                                "Making changes to individual listings"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="scheduledMessages"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.EDITINGLISTINGSINBULK ||
                                "Editing listings in bulk"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="scheduledMessages"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.ALERTSANDERRORMESSAGES ||
                                "Alerts and error messages"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </section>
              <div className={`${styles.modal_footer}`}>
                <div className="_1hbsadf py-2">
                  <div className="_1hfa947x">
                    <div className="_10ejfg4u"></div>
                    <div className="_ni9axhe d-flex justify-content-end">
                      <button
                        type="button"
                        className={`${styles.continue} d-flex py-3 px-3`}
                        onClick={handleClose}
                      >
                        {i18?.LISTING?.CONTINUE || "Continue"}
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-black">
                    {i18?.LISTING?.NEEDTOCONNECT ||
                      "Need to connect with our support team? Visit the"}{" "}
                    &nbsp;
                    <a
                      href="/help"
                      className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr"
                    >
                      {i18?.LISTING?.HELPCENTRE || "Help centre"}
                    </a>{" "}
                    &nbsp;
                    {i18?.LISTING?.OR || "or"}
                    &nbsp;
                    <a
                      href="/help/contact_us"
                      className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr"
                    >
                      {i18?.LISTING?.CONTACTUS || "Contact us"}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </>
        </Box>
      </Modal>

      <Modal
        open={modalSubmit}
        onClose={() => {
          setModalSubmit(false);
        }}
      >
        <Box sx={style}>
          <>
            <div className={`${styles.modal_group}`}>
              <div className="">
                <button
                  aria-label="Close"
                  onClick={() => {
                    setModalSubmit(false);
                  }}
                  type="button"
                  className={`${styles.close} border-0 ps-0 p-2`}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={`${styles.modal_header} py-2`}>
                <h4 className={`${styles.feedback}`}>
                  {i18?.LISTING?.TELLUSABOUTIT || "Tell us about it"}
                </h4>
              </div>
              <section>
                <fieldset className={`${styles.fieldset}`}>
                  <p className="">
                    {i18?.LISTING?.SHAREYOUREXPERIENCE ||
                      "Share your experience with us. What’s working well? What could’ve gone better?"}
                  </p>
                  <div>
                    <div>
                      <textarea className="w-100" rows={4}></textarea>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="checkbox"
                                value="scheduledMessages"
                              />
                              <div
                                data-fake-radio="true"
                                data-style-select="false"
                                data-style-default="true"
                                className="_1ropm41"
                              ></div>
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              {i18?.LISTING?.IAMREPORTINGABUG ||
                                "I am reporting a bug"}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </section>
              <div className={`${styles.modal_footer}`}>
                <div className="_1hbsadf py-2">
                  <div className="d-flex justify-content-between">
                    <div className="_ni9axhe d-flex justify-content-end align-items-center">
                      <button
                        type="button"
                        className={`${styles.back} d-flex`}
                        onClick={handleBack}
                      >
                        <ArrowBackIosIcon className={`${styles.back_icon}`} />
                        {i18?.LISTING?.BACK || "Back"}
                      </button>
                    </div>
                    <div className="_ni9axhe d-flex justify-content-end">
                      <button
                        type="button"
                        className={`${styles.continue} d-flex py-3 px-3`}
                      >
                        {i18?.LISTING?.SUBMIT || "Submit"}
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Box>
      </Modal>

      <CustomModal open={openDelete} onClose={() => setOpenDelete(false)}>
        <span className="p-3">
          {i18?.LISTING?.DOYOUWANTTODELETE ||
            "Do you want to delete this listings"}
        </span>
        <div className={`${styles.footer} border-top`}>
          <button
            onClick={() => setOpenDelete(false)}
            className={`${styles.btn1}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          {/* <DynamicButtonComponent onClick={handleDeleteAPI} text={i18?.LISTING?.YES || "Yes"}/> */}
          <button onClick={handleDeleteAPI} className={`${styles.btn2}`}>
            {i18?.LISTING?.YES || "Yes"}
          </button>
        </div>
      </CustomModal>

      <CustomModal open={soldModalOpen} onClose={handleCloseModal}>
        <span className="p-3">
          {i18?.LISTING?.MARKASSOLD ||
            "Are you sure you want to mark this product as sold?"}
        </span>
        <div className={`${styles.footer} border-top`}>
          <button
            onClick={handleCloseModal}
            className={`${styles.btn1}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button onClick={handleMarkAsSold} className={`${styles.btn2}`}>
            {i18?.LISTING?.CONFIRM || "Confirm"}
          </button>
        </div>
      </CustomModal>
    </>
  );
};

export default isAuth(Ads);
