"use client";
import React, {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/material/styles";
import { Badge, Chip } from "@mui/material";
import { Popper } from "@mui/base/Popper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMore } from "react-icons/ai";
import { LuMessagesSquare } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import moment from "moment";

import { MessageClose } from "@/app/global/svg";
import { UseSocketontext } from "@/components/SocketIO/SocketContext";
import { deleteApiMethod, getApiMethod, patchApiMethod, putApiMethod } from "@/services/global";
import { useAppDispatch } from "@/redux/hooks";
import { addAlert } from "@/redux/slice/AlertSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import isAuth from "@/components/isAuth";
import APICONSTANT, { APIURLS } from "@/services/config";
import { GenerateUrl } from "@/services/utils/helperURL";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

const Dropdown = dynamic(
  () => import("@mui/base/Dropdown").then((module) => module.Dropdown),
  { ssr: false }
);
const MenuButton = dynamic(
  () => import("@mui/base/MenuButton").then((module) => module.MenuButton),
  { ssr: false }
);
const Menu = dynamic(
  () => import("@mui/base/Menu").then((module) => module.Menu),
  { ssr: false }
);
const MenuItem = dynamic(
  () => import("@mui/base/MenuItem").then((module) => module.MenuItem),
  { ssr: false }
);
const Notifications = dynamic(
  () => import("@/app/account-settings/notification/page")
);
const MobileFooternav = dynamic(
  () => import("@/components/MobileFooterNav")
);
const Link = dynamic(() => import("next/link"));

const Header = dynamic(() => import('@/app/ads/components/adsHeader'), { ssr: false });

const StyledListbox = styled("ul")(
  ({ }) => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 8px 0;
    margin: 8px 0;
    min-width: 150px;
    border-radius: 8px;
    overflow: auto;
    background: white;
    border: 1px solid none;
    color: #24292f;
    box-shadow: 0px 2px 16px #d0d7de;
    `
);

const StyledMenuItem = styled(MenuItem)(
  ({ }) => `
    list-style: none;
    padding: 8px;
    cursor: default;
    user-select: none;
    color: var(--text-color);
  
    &:last-of-type {
      border-bottom: none;
    
    }
  
    &.${menuItemClasses.focusVisible} {
      background-color: #F7F7F7;
      color: red;
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: #F7F7F7;
      color: red;
      cursor: pointer;
    }
    `
);

const TriggerButton = styled(MenuButton)(
  ({ text }: any) => `
    font-weight: 600;
    box-sizing: border-box;
    border-radius: 50%;
    line-height: 1.5;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${text ? "24px" : "20px"};
    height: 20px;
   
  
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: transparent;
      border-color: none;
    }

    &:focus {
        background: transparent;
        border-color: none;
    }
    `
);

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025"
};

// Styled Popper content
const StyledPopperDiv = styled("div")(
  ({ theme }) => `
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 10px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: ${theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
    padding: 1rem;
    color: var(--trips-subtitle-color) !important;
    font-size: var(--homepage-header-size);
    margin-left: 10px;
    margin-top: 8px;
    min-width: 180px;
  `
);

interface Props {
  type: string;
}

const Chat = ({ type }: Props) => {
  const { i18, responsiveView, baseUrl } = usePageContext();
  const chatRef = useRef<any>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [chatcenter, setChatcenter] = useState(false);
  const [chatblockcenter, setChatblockcenter] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Message");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [chatHistoryUser, setChatHistoryUser] = useState<any>([]);
  const [chatlist, setChatlist] = useState<any>([]);
  const [chatblocklist, setChatblocklist] = useState<any>([]);
  const [formattime, setformattime] = useState<any>("");
  const [formatrighttime, setformatrighttime] = useState<any>("");
  const [title, setTitle] = useState<any>("");
  const [image, setImage] = useState<any>("");
  const [catTitle, setCatTitle] = useState<any>("");
  const [titleId, setTitleId] = useState<any>("");
  const propertyData = useSelector(
    (state: any) => state.listingData.ListingData
  );

  const searchParams: any = useSearchParams();
  const slugid = searchParams.get("id");
  const [value, setValue] = React.useState("1");
  const [status, setStatus] = useState("allchat");

  const userType =
    typeof window !== "undefined" && localStorage?.getItem("usersType");

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  const handleChange =
    (newValue: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setValue(newValue);
      setChatHistory([]);
      setChatHistoryUser([]);
      setOppositeuser([]);
      setSameuser([]);
      setChatcenter(false);
      setChatblockcenter(false);
    };

  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    if (socket && socket.socket && typeof socket.socket.emit === "function") {
      const UserID = localStorage.getItem("appUserId");
      let chatIdList =
        chatlist &&
        chatlist.find((chatss: any) => chatIdm === chatss._id)?.userDetails[0]
          ?._id;
      let payload = {
        senderId: UserID,
        receiverId: chatIdList,
        chatId:
          chatlist &&
          chatlist.find((chatss: any) => chatIdm === chatss._id)?._id,
        message: message
      };
      socket.socket.emit("sendMessage", payload, (data: any) => {
        // message will be updated from socket
        // const newMessages =
        //   data.data.newMessage
        //     ?.filter(
        //       (newMsg: any) => newMsg.message.userId === payload.senderId
        //     )
        //     ?.map((newMsg: any) => newMsg.message) || [];
        //     debugger;
        // setChatHistory((prevChatHistory: any) => [
        //   ...prevChatHistory,
        //   ...newMessages
        // ]);
        // setApiResponse(data);
        if (data.code === 200) {
          Chatlistapi();
        }
      });
    }
    if (message.trim() !== "") {
      setMessage("");
    }
  };

  const createHandleLeftMenuClick = async (data: any) => {
    const res = await deleteApiMethod(`${APICONSTANT.chatdelete}/${data}`);
    if (res.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.message,
          type: "success",
          severity: "success"
        })
      );
      Chatlistapi();
      // handleClose();
    }
  };

  const HandleAllMessageClick = async (allId: any) => {
    const messageIdsArray = chatHistory.map((item: any) => item._id);
    const deleteParamas = {
      messageIds: messageIdsArray.join()
    };
    const res = await deleteApiMethod(
      `${APICONSTANT.messagedeleteall}?messageIds=${messageIdsArray}`
    );
    if (res.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.message,
          type: "success",
          severity: "success"
        })
      );
      setChatHistory([]);
      Chatlistapi();
    }
  };

  const handleImportantChat = async (chatID: any, status: any) => {
    const payload = {
      important: status
    }
    try {
      const response = await patchApiMethod(`chat/importantChat/${chatID}`, payload)
      if(response?.statusCode === 200) {
        Chatlistapi();
      }
    } catch (error) {
      console.error("Error in important chats", error);

    }
  }

  const dispatch = useAppDispatch();

  const createHandleDeleteClick = async (chatId: string) => {
    const res = await deleteApiMethod(
      `${APICONSTANT.messagedelete}/${chatId}`,
      ""
    );

    if (res.statusCode === 200) {
      setChatHistory((prevChatHistory: any) =>
        prevChatHistory.filter((chat: any) => chat.messageId !== chatId)
      );

      dispatch(
        addAlert({
          isOpen: true,
          message: "Message deleted",
          type: "success",
          severity: "success"
        })
      );
      Chatlistapi();
    }
  };

  const socket: any = UseSocketontext();
  const [chatIdm, setChatIdm] = useState<any>("");
  const [unseencount, setUnseencount] = useState<any>("");
  const [oppositeuser, setOppositeuser] = useState<any>({});
  const [sameuser, setSameuser] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const chatId = useMemo(() => {
    let id = ','; // reciverid, senderid, provided in string for useEffect change
    if (Array.isArray(chatlist)) {
      let receiverId = chatlist.find((chatss: any) => chatIdm === chatss._id)?.userDetails[0]?._id
      let senderId = chatlist.find((chatss: any) => chatIdm === chatss._id)?._id
      id = `${receiverId || ''},${senderId || ''}`
    }
    return id;
  }, [chatlist, chatIdm])

  useEffect(() => {
    let [receiverId, senderId] = chatId.split(',');
    if (socket.socket && receiverId && senderId) {
      const UserID = localStorage.getItem("appUserId");
      let payload = {
        senderId: UserID,
        receiverId: receiverId,
        chatId: senderId
      };
      socket.socket.emit("joinChannel", payload, (data: any) => { });
      const onNewMessage = (messageData: any) => {

        let payload = {
          userId: UserID,
          chatId: chatIdm
        };
        socket?.socket?.emit("seenMessages", payload, (data: any) => {
          Chatlistapi();
        });

        // setUnseencount(messageData.chatId);
        let obj: any[] = [];
        if (
          messageData.data.newMessages.find(
            (ele: any) =>
              ele.message.userId === localStorage.getItem("appUserId")
          )
        ) {
          obj.push(
            messageData.data.newMessages.find(
              (ele: any) => ele.message.status === "seen"
            ).message
          );
        } else {
          obj.push(
            messageData.data.newMessages.find(
              (ele: any) => ele.message.status === "unseen"
            ).message
          );
        }

        setChatHistory((prevChatHistory: any) => [...prevChatHistory, ...obj]);
      };
      socket.socket.on("messageBroadcast", onNewMessage);

      return () => {
        socket.socket.emit("exitChannel", payload, (data: any) => { });
        socket.socket.off("messageBroadcast", onNewMessage);
      };
    } else {
      console.warn("Socket connection is not properly configured.");
    }
    return () => {
      if (socket.socket && socket.socket?.off)
        socket.socket.off("messageBroadcast");
    };
  }, [socket.socket, chatId]);

  const Chatlistapi = async () => {
    type Data = {
      status?: string;
      type: string;
    };

    const data: Data = {
      type: type
    };
    // if (checkType) {
    //   data.status = checkType;
    // }
    if (status) {
      data.status = status;
    }
    try {
      const url: any = APICONSTANT.chatList;
      const res = await getApiMethod(url, data);
      setChatlist(res?.data);
      const formattedTimes = res?.data.map((item: any) => {
        // Check if lastMessageDate is defined and not null
        if (item?.lastMessageDate) {
          const originalDate = new Date(item.lastMessageDate);

          // Check if the Date object is valid
          if (!isNaN(originalDate.getTime())) {
            return new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true
            }).format(originalDate);
          } else {
            console.warn("Invalid date:", item.lastMessageDate);
            return "Invalid date";
          }
        } else {
          console.warn("No lastMessageDate for item:", item);
          return "No date";
        }
      });
      setformattime(formattedTimes);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    Chatlistapi();
  }, [status]);

  const blocklistapi = async () => {
    try {
      const url: any = APICONSTANT.blockedList;
      const res = await getApiMethod(url);
      setChatblocklist(res?.data);
      const formattedTimes = res?.data.map((item: any) => {
        const originalDate = new Date(item.date);
        return new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true
        }).format(originalDate);
      });
      setformattime(formattedTimes);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  const Chatlistconversation = async (data: any) => {
    setChatIdm(data);
    const url: any = `${APICONSTANT.chat}/ads/${data}`;
    const res = await getApiMethod(url);
    setChatHistory(
      res?.data.map((conversation: any) => conversation.message).flat()
    );
    setChatHistoryUser(
      res?.userData.map((conversation: any) => conversation.userDetails).flat()
    );
    setOppositeuser(
      res?.length !== 0 &&
      res.userData[0].userDetails.find(
        (data: any) => data.userId !== localStorage.getItem("appUserId")
      )
    );
    setTitle(res?.adsDetails[0].adsName);
    setImage(res?.adsDetails[0].adsImages.coverImage);
    setCatTitle(res?.adsDetails[0].adsCategoryName);
    setTitleId(res?.adsDetails[0].adsId);

    setSameuser(
      res?.length !== 0 &&
      res.userData[0].userDetails.find(
        (data: any) => data.userId === localStorage.getItem("appUserId")
      )
    );

    const formattedTimes = chatHistory?.map((item: any) => {
      const originalDate = new Date(item.date);
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      }).format(originalDate);
    });
    setformatrighttime(formattedTimes);
    setChatcenter(true);
    setIsClicked(!isClicked);
    setChatblockcenter(false);
    if (res.statusCode === 200) {
      const UserID = localStorage.getItem("appUserId");
      let payload = {
        userId: UserID,
        chatId: data
      };
      socket?.socket?.emit("seenMessages", payload, (data: any) => { });
      Chatlistapi();
    }
  };
  useEffect(() => {
    if (slugid) {
      // Chatlistconversation(slugid);
    }
  }, [slugid]);

  const Chatlistconversationblock = async (data: any) => {
    setChatIdm(data);
    const url: any = `${APICONSTANT.chat}/${data}`;
    const res = await getApiMethod(url);
    setChatHistory(
      res?.data.map((conversation: any) => conversation.message).flat()
    );
    setOppositeuser(
      res?.length !== 0 &&
      res.userData[0].userDetails.find(
        (data: any) => data.userId !== localStorage.getItem("appUserId")
      )
    );

    setTitle(res?.listingDetails[0].listingName);
    setImage(res?.listingDetails[0].listingImages.coverImage);
    setCatTitle(res?.listingDetails[0].listingCategoryName);
    setTitleId(res?.listingDetails[0].listingId);

    const formattedTimes = chatHistory?.map((item: any) => {
      const originalDate = new Date(item.date);
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      }).format(originalDate);
    });
    setformatrighttime(formattedTimes);
    setChatblockcenter(true);
    setChatcenter(false);
    setIsClicked(!isClicked);
  };

  const HandleBlockMessageClick = async (block: any) => {
    const blockdata = {
      blockStatus: true
    };
    const response = await putApiMethod(
      `${APICONSTANT.chatblock}/${chatIdm}`,
      blockdata
    );
    if (response.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: response.message,
          type: "success",
          severity: "success"
        })
      );
      Chatlistapi();
      setChatHistory([]);
      setChatcenter(false);
    }
  };

  const HandleUnBlockMessageClick = async (chatIdm: any) => {
    const blockdata = {
      blockStatus: "false"
    };
    const response = await putApiMethod(
      `${APICONSTANT.chatblock}/${chatIdm}`,
      blockdata
    );
    if (response.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: response.message,
          type: "success",
          severity: "success"
        })
      );
      Chatlistapi();
      blocklistapi();
      setChatcenter(false);
      setChatblockcenter(false);
      setChatHistory([]);
    }
  };

  const formatChatDate = (dateString: string) => {
    const originalDate = moment(dateString);

    if (!originalDate.isValid()) {
      return "Invalid Date";
    }

    return originalDate.format("h:mm A");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlebackbutton = () => {
    setIsClicked(!isClicked);
  };

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory) {
      scrollToBottom();
    }
  }, [chatHistory]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openChat, setOpenChat] = React.useState<Boolean | HTMLElement>(false);
  const [selectedChatType, setSelectedChatType] = useState<string>("All Chats");
  const popperRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpenChat((previousOpen) => !previousOpen);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClickOutside = (event: any) => {
    if (
      popperRef.current &&
      !popperRef.current.contains(event.target as Node)
    ) {
      setAnchorEl(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (newStatus: any, chatType: string) => {
    setStatus(newStatus);
    setSelectedChatType(chatType);
    setAnchorEl(null);
  };

  return (
    <>
      <div className={`${styles.guestinbox}`}>
        <div className={`${styles.mainheader}`}>
          {responsiveView === "sm" || responsiveView === "xs" ? null : (
            <Header
              center={
                userType === "user"
                  ? "hide"
                  : responsiveView === "sm" || responsiveView === "xs"
                    ? "center"
                    : "inbox"
              }
              type={userType === "user" ? "" : "host"}
              page="hide"
            />
          )}
        </div>
        <div className={`${styles.main_chat}`}>
          <div className={`${!showDetails ? styles.hide : styles.column}`}>
            <div className={`${styles.gridone}`}>
              {/* <div
                className={`${styles.header} d-flex align-items-center justify-content-between`}
              >
                <h5>{selectedMenu}</h5>
              
              </div> */}
              {selectedMenu === "Message" && (
                <>
                  <div className={`${styles.btn_AllChats} position-relative`}>
                    <Badge aria-describedby="example-id">
                      <button
                        className={`${styles.more_filter}`}
                        onClick={handleClick}
                      >
                        {selectedChatType}
                        {openChat ? (
                          <KeyboardArrowUpIcon
                            sx={{
                              ml: 1,
                              fontSize: "var(--homepage-header-size)"
                            }}
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            sx={{
                              ml: 1,
                              fontSize: "var(--homepage-header-size)"
                            }}
                          />
                        )}
                      </button>
                    </Badge>
                  </div>

                  <Popper id={id} open={open} anchorEl={anchorEl}>
                    <StyledPopperDiv>
                      <div
                        className={`${styles.poper_list}`}
                        onClick={() => {
                          handleOptionClick("allchat", "All Chats");
                        }}
                      >
                        {i18?.GUESTINBOX?.ALLCHATSss || "All Chatssss"}
                      </div>
                      <div
                        className={`${styles.poper_list}`}
                        onClick={() =>
                          handleOptionClick("travelling", "Travelling")
                        }
                      >
                        {i18?.GUESTINBOX?.TRAVELLING || "Travelling"}
                      </div>
                      <div
                        className={`${styles.poper_list}`}
                        onClick={() => handleOptionClick("hosting", "Hosting")}
                      >
                        {i18?.GUESTINBOX?.HOSTING || "Hosting"}
                      </div>
                      {/* <div className={`${styles.poper_list}`} onClick={() => (setStatus('blocked'), setAnchorEl(null))}>{i18?.GUESTINBOX?.BLOCKEDCHATS || 'Blocked chats'}</div> */}
                      <div
                        className={`${styles.poper_list}`}
                        onClick={() => {
                          handleOptionClick(
                            "blocked",
                            i18?.GUESTINBOX?.BLOCKEDCHATS || "Blocked chats"
                          );
                          setAnchorEl(null);
                        }}
                      >
                        {i18?.GUESTINBOX?.BLOCKEDCHATS || "Blocked chats"}
                      </div>
                      <div
                        className={`${styles.poper_list}`}
                        onClick={() => {
                          handleOptionClick(
                            "important",
                            i18?.GUESTINBOX?.IMPORTANTCHATS || "Important chats"
                          );
                        }}
                      >
                        {i18?.GUESTINBOX?.IMPORTANTCHATS || "Important chats"}
                      </div>
                      {/* <div className={`${styles.poper_list}`} onClick={()=>{!isMobile ? (setStatus('blocked'), setAnchorEl(null)) : (setStatus("notification"), setAnchorEl(null))}} onChange={handleChange}>
                  {isMobile ? 'Notification' : `${i18?.GUESTINBOX?.BLOCKEDCHATS || 'Blocked chats'}`}</div> */}
                    </StyledPopperDiv>
                  </Popper>

                  {/* </div> */}

                  <div className={`${styles.tabpanel}`}>
                    {status !== "notification" &&
                      chatlist?.map((data: any, index: any) => (
                        <div
                          key={data._id}
                          className={`${styles.chatboxleft} d-flex align-items-center border-bottom ${chatIdm === data._id ? styles.activeChat : ''}`}

                        >
                          <div
                            onClick={() => Chatlistconversation(data._id)}
                            className={`${styles.default} flex-fill d-flex align-items-center justify-content-between pb-3 pt-3`}
                          >
                            <div className="d-flex">
                              {/* <FaUserCircle
                                  className={`${styles.usericon1} me-3`}
                                /> */}
                              {data.userDetails[0]?.profilePicture ? (
                                <img
                                  src={
                                    data.userDetails[0]?.profilePicture?.startsWith(
                                      "https"
                                    )
                                      ? data.userDetails[0]?.profilePicture
                                      : APIURLS.baseUrl +
                                      data.userDetails[0]?.profilePicture
                                  }
                                  alt=""
                                  className={`${styles.usericon}`}
                                />
                              ) : (
                                <>
                                  <img
                                    src={`${baseUrl}public/UserProfile/file-1700546913959.png`}
                                    alt=""
                                    className={`${styles.usericon}`}
                                  ></img>
                                </>
                              )}

                              <div className="d-flex flex-column">
                                {data?.isImportant === true && <Chip 
                                  sx={{
                                    height: "18px",
                                    borderRadius: "2px",
                                  }} 
                                  label="Important" 
                                  color="primary" 
                                  size="small" 
                                />}
                                <span className={`${styles.user}`}>
                                  <span style={{ fontWeight: 'bold' }}>
                                    {data.userDetails[0]?.name}
                                  </span>
                                  {/* Uncomment below if needed */}
                                  {/* - {data.listingName} */}
                                </span>


                                {/*                           
                                  {data.deliverMessage.map(
                                    (message: any, messageIndex: any) => (
                                      <div key={messageIndex}>
                                        <div>{message.message}</div>
                                      </div>
                                    )
                                  )} */}
                                <div className={`${styles.user_message}`}>
                                  {" "}
                                  {data.lastMessage}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="d-flex align-items-center flex-column me-1">
                                <span>
                                  {formatChatDate(data?.lastMessageDate)}
                                </span>

                                {/* {unseencount === chatIdm ? ( */}
                                <>
                                  {data.participants.map(
                                    (message: any, messageIndex: any) => (
                                      <Fragment key={messageIndex}>
                                        {message.unseen !== 0 ? (
                                          <div
                                            className={`${styles.unseencount}`}
                                          >
                                            <div>{message.unseen}</div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </Fragment>
                                    )
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                          <Dropdown>
                            <TriggerButton /* text={true} */>
                              <AiOutlineMore
                                style={{
                                  display: "block",
                                  height: "22px",
                                  width: "22px",
                                  fill: "black"
                                }}
                              />
                            </TriggerButton>
                            <Menu slots={{ listbox: StyledListbox }}>
                              {/* <StyledMenuItem
                                      onClick={createHandleMenuClick("Message")}
                                    >
                                      Archive
                                    </StyledMenuItem> */}

                              {/* <StyledMenuItem
                                onClick={() => {
                                  status !== "blocked"
                                    ? createHandleLeftMenuClick(data._id)
                                    : HandleUnBlockMessageClick(data._id);
                                }}
                              >
                                {status === "blocked"
                                  ? i18?.GUESTINBOX?.UNBLOCK || "Unblock"
                                  : i18?.GUESTINBOX?.DELETE || "Delete"}
                              </StyledMenuItem> */}
                              {status !== "blocked" && (
                                <StyledMenuItem
                                  onClick={() => {
                                    createHandleLeftMenuClick(data._id);
                                  }}
                                >
                                  {i18?.GUESTINBOX?.DELETE || "Delete"}
                                </StyledMenuItem>
                              )}
                              {/* Important Menu Item */}
                              {status !== "blocked" && data?.isImportant !== true  && (
                                <StyledMenuItem
                                  onClick={() => {
                                    handleImportantChat(data._id, true);
                                  }}
                                >
                                  {i18?.GUESTINBOX?.MARKASIMPORTANT || "Mark As Important"}
                                </StyledMenuItem>
                              )}
                              {/* Important Menu Item */}
                              {status !== "blocked" && data?.isImportant !== false && (
                                <StyledMenuItem
                                  onClick={() => {
                                    handleImportantChat(data._id, false);
                                  }}
                                >
                                  {i18?.GUESTINBOX?.UNMARKIMPORTANT || "Unmark Important"}
                                </StyledMenuItem>
                              )}
                              {/* Unblock Menu Item */}
                              {status === "blocked" && (
                                <StyledMenuItem
                                  onClick={() => {
                                    HandleUnBlockMessageClick(data._id);
                                  }}
                                >
                                  {i18?.GUESTINBOX?.UNBLOCK || "Unblock"}
                                </StyledMenuItem>
                              )}
                            </Menu>
                          </Dropdown>
                        </div>
                      ))}

                    {status === "notification" ? (
                      <>
                        <Notifications />
                      </>
                    ) : (
                      <>
                        {!isMobile &&
                          chatblocklist?.map((data: any, index: any) => (
                            <div
                              key={index}
                              className={`${styles.chatboxleft} d-flex align-items-center border-bottom`}
                            >
                              <div
                                onClick={() =>
                                  Chatlistconversationblock(data._id)
                                }
                                className={`${styles.default} flex-fill d-flex align-items-center justify-content-between py-3`}
                              >
                                <div className="d-flex align-items-center">
                                  <>
                                    {data.userDetails[0]?.profilePicture ? (
                                      <img
                                        src={
                                          data.userDetails[0]?.profilePicture?.startsWith(
                                            "https"
                                          )
                                            ? data.userDetails[0]
                                              ?.profilePicture
                                            : APIURLS.baseUrl +
                                            data.userDetails[0]
                                              ?.profilePicture
                                        }
                                        alt=""
                                        className={`${styles.usericon}`}
                                      />
                                    ) : (
                                      <img
                                        src={`${baseUrl}public/UserProfile/file-1700546913959.png`}
                                        alt=""
                                        className={`${styles.usericon}`}
                                      />
                                    )}
                                  </>

                                  {/* <FaUserCircle
                                  className={`${styles.usericon} me-3`}
                                /> */}
                                  {/* {data.userDetails[0].profilePicture} */}
                                  <div>
                                    <span className={`${styles.user}`}>
                                      {data.userDetails[0].name}
                                    </span>
                                    {/*                           
                                  {data.deliverMessage.map(
                                    (message: any, messageIndex: any) => (
                                      <div key={messageIndex}>
                                        <div>{message.message}</div>
                                      </div>
                                    )
                                  )} */}
                                    <div className={`${styles.block_msg}`}>
                                      {" "}
                                      {data.lastMessage}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="d-flex align-items-center flex-column me-2">
                                    <span>
                                      {formatChatDate(data?.lastMessageDate)}
                                    </span>
                                    {/* <span className={`${styles.unseencount}`}>
                                      {data.participants.map(
                                        (message: any, messageIndex: any) => (
                                          <div key={messageIndex}>
                                            <div>{message.unseen}</div>
                                          </div>
                                        )
                                      )}
                                      {data.deliverMessage.length}
                                    </span> */}
                                  </div>
                                </div>
                              </div>
                              {/* <Dropdown>
                                    <TriggerButton>
                                      <AiOutlineMore
                                        style={{
                                          display: "block",
                                          height: "22px",
                                          width: "22px",
                                          fill: "black",
                                        }}
                                      />
                                    </TriggerButton>
                                    <Menu slots={{ listbox: StyledListbox }}>
                                      <StyledMenuItem
                                        onClick={() => {
                                          HandleUnBlockMessageClick(data._id);
                                        }}
                                      >
                                        {i18?.GUESTINBOX?.UNBLOCK || "Unblock"}
                                      </StyledMenuItem>
                                    </Menu>
                                  </Dropdown> */}
                            </div>
                          ))}
                      </>
                    )}
                  </div>

                  {/* </Box> */}
                </>
              )}
              {selectedMenu === "Archived" && (
                <div className={`${styles.messagecontent} mx-3`}>
                  <p className="py-2">
                    {i18?.GUESTINBOX?.NORESULT || "No result"}
                  </p>
                </div>
              )}
              {selectedMenu === "Unread" && (
                <div className={`${styles.messagecontent} mx-3`}>
                  <p className="py-2">
                    {i18?.GUESTINBOX?.NORESULT || "No result"}
                  </p>
                </div>
              )}
            </div>
            {/* 
            <div className={`${styles.more_filter}`}>
                  <Badge color="error" badgeContent=" " variant="dot" >
                    <button
                      className="d-flex align-items-center"
                    >
                      <Filter/>
                    </button>
                  </Badge>
                </div> */}

            <div
              className={`${styles.gridtwo} ${isMobile ? styles.ismobileadd : styles.ismobileremove
                } ${isClicked ? styles.mobiletransformadd : ""}`}
            >
              {!chatblockcenter && chatcenter ? (
                <>
                  <div className={`${styles.header} p-3`}>
                    <div className="d-flex align-items-center">
                      {isMobile ? (
                        <p onClick={handlebackbutton} className=" mb-0">
                          <ArrowBackIosIcon />
                        </p>
                      ) : (
                        <></>
                      )}
                      {/* {
                        chatHistory.userId === 
                      } */}
                      {oppositeuser.profileImage ? (
                        <img
                          src={
                            oppositeuser.profileImage?.startsWith("https")
                              ? oppositeuser.profileImage
                              : APIURLS.baseUrl + oppositeuser.profileImage
                          }
                          onError={handleImageError}
                          className={`${styles.usericon} me-3`}
                        />
                      ) : (
                        <FaUserCircle className={`${styles.usericon} me-3`} />
                      )}

                      <div>
                        <h5 className={`${styles.user} text-capitalize m-0`}>
                          {oppositeuser.name}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Dropdown>
                        <TriggerButton>
                          <AiOutlineMore
                            style={{
                              display: "block",
                              height: "16px",
                              width: "16px",
                              fill: "black"
                            }}
                          />
                        </TriggerButton>
                        <Menu
                          style={{ zIndex: 999999999 }}
                          className="z-10"
                          slots={{ listbox: StyledListbox }}
                        >
                          <StyledMenuItem
                            onClick={() => {
                              HandleBlockMessageClick("");
                            }}
                          >
                            {status !== "blocked"
                              ? i18?.GUESTINBOX?.BLOCKMESSAGE || "Block message"
                              : <></>}
                          </StyledMenuItem>
                          <StyledMenuItem
                            onClick={() => {
                              HandleAllMessageClick("Archived");
                            }}
                          >
                            {i18?.GUESTINBOX?.DELETEALLMESSAGE ||
                              "Delete all message"}
                          </StyledMenuItem>
                        </Menu>
                      </Dropdown>
                      {!showDetails && !isMobile && (
                        <button
                          className={`${styles.getdetails}`}
                          onClick={() => setShowDetails(true)}
                        >
                          {i18?.GUESTINBOX?.GETDETAILS || "Get details"}
                        </button>
                      )}
                    </div>
                  </div>
                  {isMobile && (
                    <div
                      className="border-bottom position-relative"
                      style={{ paddingTop: "2rem", paddingBottom: "0.5rem" }}
                    >
                      <Link
                        href={GenerateUrl("/", catTitle, title, titleId)}
                        target="_blank"
                        className="d-flex align-items-center"
                      >
                        <img
                          src={image}
                          onError={handleImageError}
                          className={`${styles.usericon} mx-3`}
                        />
                        <p
                          className={`${styles.user} text-capitalize text-decoration-underline m-0`}
                        >
                          {title}
                        </p>
                      </Link>
                    </div>
                  )}

                  <div
                    className={`${isMobile ? styles.chatmobilecenter : styles.chatboxcenter
                      }`}
                  >
                    <div className={`${styles.chathistory} p-3`}>
                      {chatHistory?.map((chat: any, index: any) => (
                        // <div key={index} className="d-flex mt-4">

                        //   {chat.userId ===
                        //     localStorage.getItem("appUserId") ? (
                        //     <img
                        //       src={sameuser.profileImage}
                        //       className={`${styles.usericon} me-3`}
                        //     />
                        //   ) : (
                        //     // <FaUserCircle className={`${styles.usericon} me-3`} />
                        //     <img
                        //       src={oppositeuser.profileImage}
                        //       className={`${styles.usericon} me-3`}
                        //     />
                        //   )}

                        //   <div className="d-flex flex-column">
                        //     <div className="d-flex align-items-center">
                        //       <span className={`${styles.fontBold}`}>
                        //         {chat.userId ===
                        //           localStorage.getItem("appUserId") ? (
                        //           <>{sameuser.name}</>
                        //         ) : (
                        //           <>{oppositeuser.name}</>
                        //         )}
                        //         {/* {chat.userId ===
                        //         localStorage.getItem("appUserId") ? (
                        //           <>bharathi</>
                        //         ) : (
                        //           <>Test</>
                        //         )} */}
                        //       </span>
                        //       <div
                        //         className={`${styles.fontBoldhead} d-flex align-items-center `}
                        //       >
                        //         {/* <span className={`${styles.fontBold}`}>
                        //           {chat.name}
                        //         </span> */}
                        //         <span className={`${styles.fontlight} me-2`}>
                        //           {chat.date && formatChatDate(chat?.date)}
                        //         </span>

                        //         <Dropdown>
                        //           <TriggerButton>
                        //             {/* <BsChevronDown
                        //               style={{
                        //                 display: "block",
                        //                 height: "16px",
                        //                 width: "16px",
                        //                 fill: "black",
                        //               }}
                        //             /> */}
                        //             <AiOutlineMore
                        //               style={{
                        //                 display: "block",
                        //                 height: "16px",
                        //                 width: "16px",
                        //                 fill: "black",
                        //               }}
                        //             />
                        //           </TriggerButton>
                        //           <Menu slots={{ listbox: StyledListbox }}>
                        //             <StyledMenuItem
                        //               onClick={() => {
                        //                 createHandleDeleteClick(chat.messageId);
                        //               }}
                        //             >
                        //               Delete Message
                        //             </StyledMenuItem>
                        //           </Menu>
                        //         </Dropdown>
                        //       </div>
                        //     </div>

                        //     <div className="d-flex">
                        //       <span>{chat.message}</span>
                        //       {/* <p>{chat.status}</p> */}
                        //     </div>
                        //   </div>
                        // </div>

                        <div key={index}>
                          <div className=" mt-2">
                            {
                              chat.userId !==
                              localStorage.getItem("appUserId") && (
                                <div className="d-flex">
                                  {/* <img
                                  src={oppositeuser.profileImage}
                                  className={`${styles.usericon} me-3`}
                                /> */}
                                  {/* <div className="d-flex flex-column"> */}
                                  {/* <div className="d-flex align-items-center">
                                    <span className={`${styles.fontBold}`}>
                                      {oppositeuser.name}
                                    </span>
                                    <div className={`${styles.fontBoldhead} d-flex align-items-center `}>
                                      <span className={`${styles.fontlight} me-2`}>
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black",
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu slots={{ listbox: StyledListbox }}>
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(chat.messageId);
                                            }}
                                          >
                                            Delete Message
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div> */}

                                  <div className={`${styles.oppmsg} rounded`}>
                                    <p className={`${styles.chat_msg} m-0`}>
                                      {chat.message}
                                    </p>
                                    <div
                                      className={`${styles.fontBoldhead} ${styles.chat_date} d-flex align-items-center `}
                                    >
                                      <span
                                        className={`${styles.fontlight} mx-2`}
                                      >
                                        {chat.date &&
                                          formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black"
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu
                                          style={{ zIndex: 999999999 }}
                                          slots={{ listbox: StyledListbox }}
                                        >
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(
                                                chat.messageId
                                              );
                                            }}
                                          >
                                            {i18?.GUESTINBOX?.DELETEMESSAGE ||
                                              "Delete message"}
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                    {/* <p>{chat.status}</p> */}
                                  </div>
                                </div>
                              )
                              // </div>
                            }
                            {chat.userId ===
                              localStorage.getItem("appUserId") && (
                                <div className="d-flex justify-content-end">
                                  {/* <img
                                  src={sameuser.profileImage}
                                  className={`${styles.usericon} me-3`}
                                /> */}
                                  {/* <div className="d-flex flex-column"> */}
                                  {/* <div className="d-flex align-items-center">
                                    <span className={`${styles.fontBold}`}>
                                      {sameuser.name}
                                    </span>
                                    <div className={`${styles.fontBoldhead} d-flex align-items-center `}>
                                      <span className={`${styles.fontlight} me-2`}>
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black",
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu slots={{ listbox: StyledListbox }}>
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(chat.messageId);
                                            }}
                                          >
                                            Delete Message
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div> */}

                                  <div className={`${styles.samemsg} rounded`}>
                                    <p className={`${styles.chat_msg} m-0`}>
                                      {chat.message}
                                    </p>
                                    <div
                                      className={`${styles.fontBoldhead} ${styles.chat_date} d-flex align-items-center `}
                                    >
                                      <span
                                        className={`${styles.fontlight} mx-2`}
                                      >
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black"
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu
                                          style={{ zIndex: 999999999 }}
                                          slots={{ listbox: StyledListbox }}
                                        >
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(
                                                chat.messageId
                                              );
                                            }}
                                          >
                                            {i18?.GUESTINBOX?.DELETEMESSAGE ||
                                              "Delete message"}
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                    {/* <p>{chat.status}</p> */}
                                  </div>
                                  {/* </div> */}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatRef} />
                    </div>
                  </div>

                  <div className={`${styles.chatsubmitbox} border-top`}>
                    <input
                      className={`${styles.searchinput}`}
                      type="text"
                      value={message}
                      onChange={handleInputChange}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleKeyDown();
                        }
                      }}
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={handleKeyDown}
                      disabled={message.length === 0}
                      className={`${message.length !== 0
                        ? styles.sendbtn
                        : styles.disablebtn
                        }`}
                    >
                      {i18?.REVIEWS?.SEND || "Send"}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {!chatblockcenter && !chatcenter ? (
                <>
                  {" "}
                  <div
                    className={`${styles.messagecontent} mx-3 d-flex flex-wrap justify-content-center flex-column align-items-center h-100`}
                  >
                    <LuMessagesSquare
                      color="var(--msg-svg-icon-color)"
                      size="100"
                    />
                    <h5
                      style={{
                        fontSize: "var(--notes-text)",
                        fontFamily: "var(--font-family-base)"
                      }}
                      className="pt-3"
                    >
                      {i18?.GUESTINBOX?.YOUHAVENOUNREADMESSAGES ||
                        "You have no unread messages"}
                    </h5>
                    <p
                      style={{
                        fontFamily: "var(--font-family-base)",
                        textAlign: "center",
                        color: "var(--font-color-adddates)"
                      }}
                    >
                      {i18?.GUESTINBOX?.WHENYOUBOOKATRIP ||
                        "When you book a trip or experience, messages from your host will show up here"}
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}

              {chatblockcenter ? (
                <>
                  <div
                    className={`${styles.header} d-flex align-items-center justify-content-between border-bottom py-3 px-3`}
                  >
                    <div className="d-flex align-items-center">
                      {isMobile ? (
                        <p onClick={handlebackbutton} className=" mb-0">
                          <ArrowBackIosIcon />
                        </p>
                      ) : (
                        <></>
                      )}
                      {oppositeuser.profileImage ? (
                        <img
                          src={
                            oppositeuser.profileImage?.startsWith("https")
                              ? oppositeuser.profileImage
                              : APIURLS.baseUrl + oppositeuser.profileImage
                          }
                          className={`${styles.usericon} me-3`}
                        />
                      ) : (
                        <FaUserCircle className={`${styles.usericon} me-3`} />
                      )}
                      <div>
                        <span className={`${styles.user}`}>
                          {oppositeuser.name}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Dropdown>
                        <TriggerButton>
                          <AiOutlineMore
                            style={{
                              display: "block",
                              height: "16px",
                              width: "16px",
                              fill: "black"
                            }}
                          />
                        </TriggerButton>
                        <Menu
                          style={{ zIndex: 999999999 }}
                          className="z-10"
                          slots={{ listbox: StyledListbox }}
                        >
                          {/* <StyledMenuItem
                          onClick={() => {
                            HandleBlockMessageClick("");
                          }}
                        >
                          Block Message
                        </StyledMenuItem> */}
                          <StyledMenuItem
                            onClick={() => {
                              HandleAllMessageClick("Archived");
                            }}
                          >
                            {i18?.GUESTINBOX?.DELETEALLMESSAGE ||
                              "Delete all message"}
                          </StyledMenuItem>
                        </Menu>
                      </Dropdown>
                      {!showDetails && !isMobile && (
                        <button
                          className={`${styles.getdetails}`}
                          onClick={() => setShowDetails(true)}
                        >
                          {i18?.GUESTINBOX?.GETDETAILS || "Get details"}
                        </button>
                      )}
                    </div>
                  </div>
                  {isMobile && (
                    <div className="py-2 border-bottom">
                      <Link
                        href={GenerateUrl("/", catTitle, title, titleId)}
                        target="_blank"
                        className="d-flex align-items-center"
                      >
                        <img
                          src={image}
                          className={`${styles.usericon} mx-3`}
                        />
                        <p
                          className={`${styles.user} text-capitalize text-decoration-underline m-0`}
                        >
                          {title}
                        </p>
                      </Link>
                    </div>
                  )}
                  <div
                    className={`${isMobile ? styles.chatmobilecenter : styles.chatboxcenter
                      } px-5 pt-3`}
                  >
                    <>
                      {chatHistory?.map((chat: any, index: any) => (
                        // <div
                        //   key={index}
                        //   className="d-flex align-items-center mt-4"
                        // >
                        //   {oppositeuser.profileImage ? (
                        //     <img
                        //       src={oppositeuser.profileImage.split('com/')[1]}
                        //       className={`${styles.usericon} me-3`}
                        //     />
                        //   ) : (
                        //     <FaUserCircle className={`${styles.usericon} me-3`} />
                        //   )}
                        //   <div>
                        //     <div
                        //       className={`${styles.fontBoldhead} d-flex align-items-center `}
                        //     >
                        //       <span className={`${styles.fontBold}`}>
                        //         {chat.name}
                        //       </span>
                        //       <span className={`${styles.fontlight}`}>
                        //         {chat.date && formatChatDate(chat?.date)}
                        //       </span>

                        //       <Dropdown>
                        //         <TriggerButton>
                        //           <AiOutlineMore
                        //             style={{
                        //               display: "block",
                        //               height: "16px",
                        //               width: "16px",
                        //               fill: "black",
                        //             }}
                        //           />
                        //         </TriggerButton>
                        //         <Menu slots={{ listbox: StyledListbox }}>
                        //           <StyledMenuItem
                        //             onClick={() => {
                        //               createHandleDeleteClick(chat.messageId);
                        //             }}
                        //           >
                        //             Delete Message
                        //           </StyledMenuItem>
                        //         </Menu>
                        //       </Dropdown>
                        //     </div>
                        //     <div className="d-flex align-items-center">
                        //       <span> {chat.message}</span>
                        //     </div>
                        //   </div>
                        // </div>

                        <div key={index}>
                          <div className=" mt-2">
                            {
                              chat.userId !==
                              localStorage.getItem("appUserId") && (
                                <div className="d-flex">
                                  {/* <img
                                  src={oppositeuser.profileImage}
                                  className={`${styles.usericon} me-3`}
                                /> */}
                                  {/* <div className="d-flex flex-column"> */}
                                  {/* <div className="d-flex align-items-center">
                                    <span className={`${styles.fontBold}`}>
                                      {oppositeuser.name}
                                    </span>
                                    <div className={`${styles.fontBoldhead} d-flex align-items-center `}>
                                      <span className={`${styles.fontlight} me-2`}>
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black",
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu slots={{ listbox: StyledListbox }}>
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(chat.messageId);
                                            }}
                                          >
                                            Delete Message
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div> */}

                                  <div className={`${styles.oppmsg} rounded`}>
                                    <p className={`${styles.chat_msg} m-0`}>
                                      {chat.message}
                                    </p>
                                    <div
                                      className={`${styles.fontBoldhead} ${styles.chat_date} d-flex align-items-center `}
                                    >
                                      <span
                                        className={`${styles.fontlight} mx-2`}
                                      >
                                        {chat.date &&
                                          formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black"
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu
                                          style={{ zIndex: 999999999 }}
                                          slots={{ listbox: StyledListbox }}
                                        >
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(
                                                chat.messageId
                                              );
                                            }}
                                          >
                                            {i18?.GUESTINBOX?.DELETEMESSAGE ||
                                              "Delete message"}
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                    {/* <p>{chat.status}</p> */}
                                  </div>
                                </div>
                              )
                              // </div>
                            }
                            {chat.userId ===
                              localStorage.getItem("appUserId") && (
                                <div className="d-flex justify-content-end">
                                  {/* <img
                                  src={sameuser.profileImage}
                                  className={`${styles.usericon} me-3`}
                                /> */}
                                  {/* <div className="d-flex flex-column"> */}
                                  {/* <div className="d-flex align-items-center">
                                    <span className={`${styles.fontBold}`}>
                                      {sameuser.name}
                                    </span>
                                    <div className={`${styles.fontBoldhead} d-flex align-items-center `}>
                                      <span className={`${styles.fontlight} me-2`}>
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black",
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu slots={{ listbox: StyledListbox }}>
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(chat.messageId);
                                            }}
                                          >
                                            Delete Message
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div> */}

                                  <div className={`${styles.samemsg} rounded`}>
                                    <p className={`${styles.chat_msg} m-0`}>
                                      {chat.message}
                                    </p>
                                    <div
                                      className={`${styles.fontBoldhead} ${styles.chat_date} d-flex align-items-center `}
                                    >
                                      <span
                                        className={`${styles.fontlight} mx-2`}
                                      >
                                        {chat.date && formatChatDate(chat?.date)}
                                      </span>
                                      <Dropdown>
                                        <TriggerButton>
                                          <AiOutlineMore
                                            style={{
                                              display: "block",
                                              height: "16px",
                                              width: "16px",
                                              fill: "black"
                                            }}
                                          />
                                        </TriggerButton>
                                        <Menu slots={{ listbox: StyledListbox }}>
                                          <StyledMenuItem
                                            onClick={() => {
                                              createHandleDeleteClick(
                                                chat.messageId
                                              );
                                            }}
                                          >
                                            {i18?.GUESTINBOX?.DELETEMESSAGE ||
                                              "Delete message"}
                                          </StyledMenuItem>
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                    {/* <p>{chat.status}</p> */}
                                  </div>
                                  {/* </div> */}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatRef} />
                    </>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            {showDetails && image && (
              <div className={`${styles.gridthree}`}>
                <div
                  className={`${styles.header} d-flex align-items-center justify-content-between`}
                >
                  <h5>{i18?.GUESTINBOX?.DETAILS || "Details"}</h5>
                  <button
                    className={`${styles.hidedetail}`}
                    onClick={() => {
                      setShowDetails(false);
                    }}
                  >
                    <MessageClose
                      style={{
                        display: "block",
                        fill: "none",
                        height: "20px",
                        width: "20px",
                        stroke: "currentcolor",
                        overflow: "visible"
                      }}
                    />
                  </button>
                </div>
                <div className="p-4">
                  {/* {image && */}
                  <>
                    <div className=" mb-4">
                      <img
                        src={image}
                        onError={handleImageError}
                        alt="img"
                        className={`${styles.detailsImage}`}
                      />
                      <h5
                        className={`${styles.user} text-capitalize mt-2 mb-0`}
                      >
                        {title}
                      </h5>
                    </div>
                    {/* <div className={`${styles.bookbtn}`}> */}
                    <Link
                      href={'/ads' + GenerateUrl("/", catTitle, title, titleId)}
                      target="_blank"
                      className={`${styles.bookbtn}`}
                    >
                      {i18?.ADS?.REQUESTTOBOOK || "View Ads"}
                    </Link>
                    {propertyData.isBooking && <small>{i18?.ADS_CHAT?.YOU_OWN_ADS || "You own this ads"}</small>}
                    {/* </div> */}
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {(responsiveView === "sm" || responsiveView === "xs") && (
        <MobileFooternav />
      )}
    </>
  );
};
export default isAuth(Chat);
