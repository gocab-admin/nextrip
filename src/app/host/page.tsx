"use client";

import React, { useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import {
  HomePlus,
  Starlogo,
  SearchIcon,
  TickIcon,
  CrossIcon,
  Website
} from "@/app/global/svg";
import ImageComponent from "@/components/ImageComponent";
import MapComponent from "@/components/map";
import RangeSlider from "@/components/rangeSlider";
import Footer from "@/components/footer";
import PriceCurreny from "@/components/price";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { useAppSelector } from "@/redux/hooks";
import { APIURLS } from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0px solid transparent`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&:before": {
    display: "none"
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          fontSize: "1rem",
          fill: "var(--footer-text-color)",
          transform: "rotate(90deg)"
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  padding: "16px 0px",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)"
  },
  "& .MuiAccordionSummary-content": {
    margin: theme.spacing(2)
  },
  h2: {
    fontSize: "22px",
    fontWeight: "400",
    color: "var(--footer-text-color)",
    margin: 0
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "0px solid transparent",
  p: {
    fontSize: "18px",
    color: "#717171"
  }
}));

const Host = () => {
  const { i18, settings } = usePageContext();
  const { google, app } = settings;
  const APIKEY = google?.mapApiKey;
  const { CurrencyList } = useAppSelector(currencySelector);
  const [expanded, setExpanded] = useState<string | false>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const [value, setValue] = useState<number>(7);
  const [numberValue, setNumberValue] = useState<number>(7);
  const [price, setPrice] = useState<number>(2711);

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  const handleRangeCommit = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setNumberValue(newValue);
    }
  };

  return (
    <>
      <div className={`${styles.host}`}>
        <header className={`${styles.navigation}`}>
          <div
            className={`${styles.header_nav} d-flex align-items-center h-100`}
          >
            <Link href="/">
              <Starlogo
                height="50"
                color="red"
                // responsive="d-lg-block d-none"
              />
            </Link>
            <div className="ms-auto">
              <div className="d-flex align-items-center">
                <p className="m-0 me-4">
                  {i18?.HOSTHOMEPAGE?.READYTO || "Ready to "} <Website />{" "}
                  {i18?.HOSTHOMEPAGE?.IT || "it"}?
                </p>
                <Link href="#" className={`${styles.btn_setup} btn`}>
                  <Link
                    href="/propertyform"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <span
                      className={`${styles.flexit} d-flex align-items-center`}
                    >
                      <span className="me-2">
                        <HomePlus width="24" height="24" color="#fff" />
                      </span>
                      <Website /> {i18?.HOSTHOMEPAGE?.SETUP || "Setup"}
                    </span>
                  </Link>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className={`${styles.airstar_earn_comp}`}>
          <div className={`${styles.earn_content}`}>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className={`${styles.earn_body}`}>
                  <h1>
                    <span className={`${styles.earn_title}`}>
                      <Website /> it.
                    </span>
                    <br />
                    <span>
                      {i18?.HOSTHOMEPAGE?.YOUCOULDLEARN || "You could earn"}
                    </span>
                  </h1>
                  <span className={`${styles.price_earn}`}>
                    <PriceCurreny value={(numberValue * price).toString()} />
                  </span>
                  <p className={`${styles.estimate_price}`}>
                    <button>
                      {numberValue} {i18?.HOSTHOMEPAGE?.NIGHTS || " nights"}
                    </button>
                    &nbsp;
                    {i18?.HOSTHOMEPAGE?.ATANESTIMATED || "at an estimated"}{" "}
                    {CurrencyList.currency}
                    {price} {i18?.HOSTHOMEPAGE?.ANIGHT || "a night"}
                  </p>
                  <div className={`w-100 my-4 ${styles.price_progress}`}>
                    <RangeSlider
                      value={value}
                      handleRangeChange={handleRangeChange}
                      handleRangeCommit={handleRangeCommit}
                    />
                  </div>
                  <div className={`mb-4 ${styles.estimate_earning}`}>
                    <button>
                      {i18?.HOSTHOMEPAGE?.LEARNHOWWE ||
                        "Learn how we estimate your earnings"}
                    </button>
                  </div>
                  <div className="w-100">
                    <button
                      className={`d-flex align-items-center ${styles.btn_estimate}`}
                    >
                      <div className="me-3">
                        <SearchIcon
                          width="16"
                          height="16"
                          style={{
                            strokeWidth: "4",
                            stroke: "rgb(255, 56, 92)"
                          }}
                        />
                      </div>
                      <div className={`text-start ${styles.btn_place}`}>
                        <div className={`${styles.select_spot}`}>Chennai</div>
                        <div>
                          {i18?.HOSTHOMEPAGE?.ENTIREPLACE || "Entire place"} - 1{" "}
                          {i18?.HOSTHOMEPAGE?.GUEST || "guest"}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`my-3 ${styles.earn_map}`}>
                {/* {APIKEY && (
                  // who provided styles.customarker classname here?? build issue comes
                    <MapComponent className={`${styles.customarker}`} />
                  )} */}
                  {APIKEY && (
                    <MapComponent />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.airstar_setup}`}>
          <div className={`${styles.setup_features}`}>
            <div className={`${styles.setup_body}`}>
              <h1>
                <Website />{" "}
                {i18?.HOSTHOMEPAGE?.ITEASILYWITH || " it easily with "}{" "}
                <Website /> {i18?.HOSTHOMEPAGE?.SETUP || " Setup "}
              </h1>
              <div className={`${styles.setup_image}`}>
                <ImageComponent
                  src="https://res.cloudinary.com/abserve-tech/image/upload/v1676454658/MoroKing_clone_nextjs/airstar-setup.png"
                  alt=""
                  width={2}
                  height={2}
                  onError={handleImageError}
                />
              </div>
              <div className="row justify-content-between">
                <div className={`${styles.setup_content}`}>
                  <h3>
                    {i18?.HOSTHOMEPAGE?.ONETOONE ||
                      "One-to-one guidance from a Superhost"}
                  </h3>
                  <div>
                    {i18?.HOSTHOMEPAGE?.WEWILLMATCHYOUWITHA ||
                      "We’ll match you with a Superhost in your area, who’ll guide you from your first question to your first guest – by phone, video call or chat."}
                  </div>
                </div>
                <div className={`${styles.setup_content}`}>
                  <h3>
                    {i18?.HOSTHOMEPAGE?.ANEXPERIENCEDGUEST ||
                      "An experienced guest for your first booking"}
                  </h3>
                  <div>
                    {i18?.HOSTHOMEPAGE?.FORYOURFIRST ||
                      "For your first booking, you can choose to welcome an experienced guest who has at least three stays and a good track record on "}
                    <Website />.
                  </div>
                </div>
                <div className={`${styles.setup_content}`}>
                  <h3>
                    {i18?.HOSTHOMEPAGE?.SPECIALISEDSUPPORTFROM ||
                      "Specialised support from "}{" "}
                    <Website />
                  </h3>
                  <div>
                    {i18?.HOSTHOMEPAGE?.NEWHOSTSGETONETAP ||
                      "New Hosts get one-tap access to specially trained Community Support agents who can help with everything from account issues to billing support."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.airstar_table}`}>
          <div className={`${styles.table_features}`}>
            <div className={`${styles.table_body}`}>
              <div className={`${styles.table_host_img} text-center`}>
                {/* <Logo height="50px" color="red" /> */}
                <ImageComponent
                  src={app?.logo}
                  onError={handleImageError}
                  width={212}
                  height={50}
                  alt="logo"
                />
              </div>
              <h1>
                <Website />{" "}
                {i18?.HOSTHOMEPAGE?.ITWITHTOPTOBOTTOM ||
                  "it with top‑to‑bottom protection"}
              </h1>
              <div
                className={`${styles.table_present} d-flex flex-column justify-content-center align-items-center`}
              >
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-center">
                        <Website />
                      </th>
                      <th className="text-center">
                        {i18?.HOSTHOMEPAGE?.COMPETITORS || "Competitors"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${styles.border_above}`}>
                      <th>
                        {i18?.HOSTHOMEPAGE?.GUESTIDENTITY ||
                          "Guest identity verification"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.table_description}`}>
                        {i18?.HOSTHOMEPAGE?.OURCOMPREHENSIVE ||
                          "Our comprehensive verification system checks details such as name, address, government ID and more to confirm the identity of guests who book on "}{" "}
                        <Website />.
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th>
                        {i18?.HOSTHOMEPAGE?.RESERVATIONSCREENING ||
                          "Reservation screening"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.table_description}`}>
                        {i18?.HOSTHOMEPAGE?.OURPROPRIETARY ||
                          "Our proprietary technology analyses hundreds of factors in each reservation and blocks certain bookings that show a high risk for disruptive parties and property damage."}
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th>
                        $3m{" "}
                        {i18?.HOSTHOMEPAGE?.DEMAGEPROTECTION ||
                          "damage protection"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.table_description}`}>
                        <Website />{" "}
                        {i18?.HOSTHOMEPAGE?.REIMBURSESYOUFOR ||
                          "reimburses you for damage caused by guests to your home and belongings and includes these specialised protections"}
                        :
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th className={`${styles.text_light}`}>
                        {i18?.HOSTHOMEPAGE?.ARTVALUABLES || "Art & valuables"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th className={`${styles.text_light}`}>
                        {i18?.HOSTHOMEPAGE?.AUTOBOAT || "Auto & boat"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th className={`${styles.text_light}`}>
                        {i18?.HOSTHOMEPAGE?.PETDEMAGE || "Pet damage"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th className={`${styles.text_light}`}>
                        {i18?.HOSTHOMEPAGE?.INCOMELOSS || "Income loss"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th className={`${styles.text_light}`}>
                        {i18?.HOSTHOMEPAGE?.DEEPCLEANING || "Deep cleaning"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th>
                        $1
                        {i18?.HOSTHOMEPAGE?.MUSDLIABILITY ||
                          "m USD liability insurance"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.table_description}`}>
                        {i18?.HOSTHOMEPAGE?.YOUAREPROTECTEDINTHE ||
                          "You’re protected in the rare event that a guest gets hurt or their belongings are damaged or stolen."}
                      </td>
                    </tr>
                    <tr className={`${styles.border_above}`}>
                      <th>
                        24-
                        {i18?.HOSTHOMEPAGE?.HOURSAFETYLINE ||
                          "hour safety line"}
                      </th>
                      <td className="text-center">
                        <TickIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#00a506",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <CrossIcon
                          width="24"
                          height="24"
                          style={{
                            stroke: "#e12c32",
                            strokeWidth: 5.333333333333333,
                            overflow: "visible"
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.table_description}`}>
                        {i18?.HOSTHOMEPAGE?.IFYOUEVERFEEL ||
                          "If you ever feel unsafe, our app provides one-tap access to specially trained safety agents, day or night."}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={`${styles.border_topplace} py-4`}>
                  {i18?.HOSTHOMEPAGE?.COMPARISONISBASEDON ||
                    "Comparison is based on public information and free offerings by top competitors as of 22/10. Find details and exclusions"}{" "}
                  <Link href="#">{i18?.HOSTHOMEPAGE?.HERE || "here"}</Link>.
                </div>
                <Link
                  href="#"
                  className={`${styles.btn_learnmore} d-inline-block`}
                >
                  {i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.airstar_questions}`}>
          <div className={`${styles.ques_section}`}>
            <div className={`${styles.ques_body}`}>
              <div className="row">
                <div className="col-md-6">
                  <h1 className="my-4">
                    {i18?.HOSTHOMEPAGE?.YOURQUESTIONS || "Your questions"},
                    <br />
                    {i18?.HOSTHOMEPAGE?.ANSWERED || "answered"}
                  </h1>
                </div>
                <div className={`${styles.ques_accordion} col-md-6`}>
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                    >
                      <h2>
                        {i18?.HOSTHOMEPAGE?.ITSMYPLACE ||
                          "Is my place right for"}{" "}
                        <Website />?
                      </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        <Website />{" "}
                        {i18?.HOSTHOMEPAGE?.GUESTSAREINTERESTED ||
                          "guests are interested in all kinds of places. We have listings for tiny homes, cabins, tree houses and more. Even a spare room can be a great place to stay."}
                      </p>
                    </AccordionDetails>
                  </Accordion>
                  <hr />
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange("panel2")}
                  >
                    <AccordionSummary
                      aria-controls="panel2d-content"
                      id="panel2d-header"
                    >
                      <h2>
                        {i18?.HOSTHOMEPAGE?.DOIHAVETOHOST ||
                          "Do I have to host all the time?"}
                      </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        {i18?.HOSTHOMEPAGE?.NOTATALL ||
                          "Not at all – you control your calendar. You can host once a year, a few nights a month or more often."}
                      </p>
                    </AccordionDetails>
                  </Accordion>
                  <hr />
                  <Accordion
                    expanded={expanded === "panel3"}
                    onChange={handleChange("panel3")}
                  >
                    <AccordionSummary
                      aria-controls="panel3d-content"
                      id="panel3d-header"
                    >
                      <h2>
                        {i18?.HOSTHOMEPAGE?.HOWMUCHSHOULDI ||
                          "How much should I interact with guests?"}
                      </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        {i18?.HOSTHOMEPAGE?.ITSUPTOYOU ||
                          "It’s up to you. Some Hosts prefer to message guests only at key moments – like sending a short note when they check in – while others also enjoy meeting their guests in person. You’ll find a style that works for you and your guests."}
                      </p>
                    </AccordionDetails>
                  </Accordion>
                  <hr />
                  <Accordion
                    expanded={expanded === "panel4"}
                    onChange={handleChange("panel4")}
                  >
                    <AccordionSummary
                      aria-controls="panel2d-content"
                      id="panel2d-header"
                    >
                      <h2>
                        {i18?.HOSTHOMEPAGE?.ANYTIPSONBEING ||
                          "Any tips on being a great "}{" "}
                        <Website /> {i18?.HOSTHOMEPAGE?.HOST || "Host"}?
                      </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        {i18?.HOSTHOMEPAGE?.GETTINGTHEBASICS ||
                          "Getting the basics down goes a long way. Keep your place clean, respond to guests promptly and provide necessary amenities like fresh towels. Some Hosts like adding a personal touch such as putting out fresh flowers or sharing a list of local places to explore – but it’s not required."}
                      </p>
                    </AccordionDetails>
                  </Accordion>
                  <hr />
                  <Accordion
                    expanded={expanded === "panel5"}
                    onChange={handleChange("panel5")}
                  >
                    <AccordionSummary
                      aria-controls="panel3d-content"
                      id="panel3d-header"
                    >
                      <h2>
                        {i18?.HOSTHOMEPAGE?.WHATARE || "What are "}
                        <Website />
                        {i18?.HOSTHOMEPAGE?.FEES || "’s fees?"}
                      </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        <Website />{" "}
                        {i18?.HOSTHOMEPAGE?.TYPICALLYCOLLECTS ||
                          "typically collects a flat service fee of 3% of the reservation subtotal when you get paid. We also collect a fee from guests when they book. In many areas"}{" "}
                        <Website />{" "}
                        {i18?.HOSTHOMEPAGE?.ALSOCOLLECTSANDPAYS ||
                          "also collects and pays sales and tourism taxes automatically on your behalf."}
                      </p>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.superhost_sec}`}>
          <div className={`${styles.superhost_container}`}>
            <div className="d-flex flex-wrap align-items-center">
              <div className={`${styles.column_img} col-md-5`}>
                <div className={`${styles.superhost_img}`}>
                  <ImageComponent
                    src="https://res.cloudinary.com/abserve-tech/image/upload/v1679894544/airstar_superhost.png"
                    alt=""
                    width={2}
                    height={2}
                    onError={handleImageError}
                  />
                </div>
              </div>
              <div className={`${styles.column_content} col-md-7`}>
                <div className={`${styles.superhost_msg}`}>
                  <h2>
                    {i18?.HOSTHOMEPAGE?.STILLHAVEQUESTIONS ||
                      "Still have questions?"}
                  </h2>
                  <h3 className="mb-4">
                    {i18?.HOSTHOMEPAGE?.GETANSWERSFROMAN ||
                      "Get answers from an experienced Superhost near you."}
                  </h3>
                  <div>
                    <button className={`${styles.btn_superhost}`}>
                      {i18?.HOSTHOMEPAGE?.CHATWITHSUPERHOST ||
                        "Chat with a Superhost"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Host;
