"use client";
import React from "react";
import Link from "next/link";

import HeaderProfile from "@/components/headerprofile";
import { Starlogo } from "@/app/global/svg";

import styles from "./page.module.scss";

const Header = () => (
    <>
      <div className={`${styles.logosec}`}>
        <div className="d-flex justify-content-between">
          <div>
            <Link
              href="/"
              onClick={() => {
                localStorage.setItem("usersType", "user");
              }}
            >
              <Starlogo
                height="50"
                color="red"
                responsive="d-xl-block d-none"
              />
            </Link>
          </div>
            {" "}
            <div>
              <HeaderProfile />
            </div>
        </div>
      </div>
    </>
  );

export default Header;
