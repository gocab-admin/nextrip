"use client";
import React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useAppSelector } from "@/redux/hooks";
import { userSelector } from "@/redux/slice/user/userSlice";
import { SearchIcon } from "@/app/global/svg";
import Footer from "@/components/footer";

import styles from "./page.module.scss";
import Header from "./header";

const HelpCenter = () => {
  const { userInfo } = useAppSelector(userSelector);
  const [value, setValue] = React.useState("Guest");
  // const [searchhover , setSearchHover] =useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Header />
      <div className={`${styles.body}`}>
        <div className={`${styles.content}`}>
          <h1>Hi {userInfo.firstname},how can we help?</h1>
          <div className={`${styles.flex}`}>
            <div className={`${styles.searchBar}`}>
              <input placeholder="Search how-tos and more" />
            </div>
            <div className={`${styles.icon}`}>
              <div className={`${styles.search}`}>
                <div className={`${styles.searchIcon}`}>
                  <SearchIcon
                    width="20"
                    height="20"
                    style={{
                      strokeWidth: "4",
                      stroke: "white"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.tab}`}>
          {typeof window !== "undefined" && (
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Guest" value="Guest" />
                <Tab label="Host" value="Host" />
              </TabList>
              <TabPanel value="Guest">
                <div>
                  <h3>Recommended for you</h3>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>{" "}
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="Host">
                <div>
                  <h3>Recommended for you</h3>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>{" "}
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Minus, debitis assumenda dignissimos laudantium molestias
                    nobis sequi omnis explicabo adipisci, impedit, minima odio
                    hic accusamus alias eos iusto accusantium ullam. Sunt?
                  </p>
                </div>
              </TabPanel>
            </TabContext>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
