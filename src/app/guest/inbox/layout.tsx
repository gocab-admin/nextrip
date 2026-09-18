"use client";
import React from "react";

import { SocketProvider } from "@/components/SocketIO/SocketContext";

const GuestInbox = ({ children }: any) => (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
export default GuestInbox;
