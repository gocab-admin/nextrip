import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { usePageContext } from "@/components/Providers/PageContext";
export const SocketContext: any = createContext(null);

let socket: any = null;

export const initSocket = (baseUrl:string) => {
  const URL: any = baseUrl;
  if (!socket) {
    socket = io(URL, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 4
    });

    // socket.on("messageBroadcast", (messageData:any) => {
    //   // alert('hurray message got!')
    // });
    // socket.on("sendMessage", (messageData:any) => {});
    // socket.on("joinChannel", (messageData:any) => {});
    // socket.on("exitChannel", (messageData:any) => {});
    // socket.on("seenMessages", (messageData:any) => {
      
    // });
    // socket.on("messageSawBroadcast", (messageSawData:any) => {});
  }
  return socket;
};

export const SocketProvider = ({ children }:any) => {
  const [socket, setSocket] = useState<any>(null);
  const { baseUrl } = usePageContext();
  const createConnection = () => {
    const socketInstance = initSocket(baseUrl);
    setSocket(socketInstance);
  };

  useEffect(() => {
    createConnection();
    return () => {
      if(socket && socket?.disconnect) {
        debugger;
        socket?.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const UseSocketontext = () => useContext(SocketContext);
