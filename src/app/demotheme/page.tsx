"use client"
import { useState } from "react";
import Carousel from "./carousel.module";
import Footer from "./footer.module";
import PopularCities from "./popularcities.module";
import RecentExperience from "./recentexperience.module";
import RecommHome from "./recomhome.module";
import RecommHomeCard from "./recomhomecard.module";

export default function demo(){
  const [themeData, setThemeData] = useState();

    return(
        <>
            <Carousel/>
            {/* <RecentExperience/> */}
            <RecommHome themeData={themeData} />
            <PopularCities/>
            <Footer/>
        </>
    )
}