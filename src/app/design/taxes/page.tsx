"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { usePageContext } from "@/components/Providers/PageContext";
import CustomModal from "@/components/modal";

import styles from "./page.module.scss";

const TabPanel: any = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false,
});

const TabList: any = dynamic(() => import("@mui/lab/TabList"), {
  ssr: false,
});

const PaymentsMethods = () => {
  const { i18 } = usePageContext();
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [openVATNumber, setopenVATNumber] = React.useState(false);
  const handleOpenVATModal = () => {
    setopenVATNumber(true);
  };
  const handleCloseVATModal = () => {
    setopenVATNumber(false);
  };
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className={`${styles.taxes}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.tabpanel} mx-auto`}>
          <div className={`${styles.breadcrums}`}>
            <div className="mx-3">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" href="/account-settings">
                  {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                </Link>
                <Typography color="text.primary">
                  {i18?.RESERVATIONS?.TAXES || "Taxes"}
                </Typography>
              </Breadcrumbs>
            </div>
            <div>
              <h1 className={`m-3`}>{i18?.RESERVATIONS?.TAXES || "Taxes"}</h1>
            </div>
          </div>
          <div className={`${styles.tab}`}>
            <div className={`${styles.tabwidth}`}>
              <TabContext value={value}>
                <div className={`${styles.tablist}`}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Taxpayers" value="1" />
                    <Tab label="Tax documents" value="2" />
                  </TabList>
                </div>
                <TabPanel className={`${styles.panels}`} value="1">
                  <div className="">
                    <div>
                      <div className={`${styles.guestcontent} p-3`}>
                        <div className={`${styles.referal}`}>
                          <div className={`${styles.background}`}>
                            <h5>
                              {i18?.TAX?.TAXPAYERINFORMATION ||
                                "Taxpayer information"}
                            </h5>
                            <div className={`pt-3 pb-2`}>
                              <p className="m-0">
                                {i18?.TAX?.TAXINFOISREQUIRED ||
                                  "Tax info is required for most countries/regions."}{" "}
                                <a href="">
                                  {i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                                </a>
                              </p>
                            </div>
                            <div className={`pt-3 pb-2`}>
                              <button
                                onClick={handleOpenModal}
                                className={`${styles.button}`}
                              >
                                {i18?.TAX?.ADDTAXINFO || "Add tax info"}
                              </button>
                            </div>
                            <div className={`pt-3 pb-2`}>
                              <h5>
                                {i18?.TAX?.VAT || "Value Added Tax (VAT)"}
                              </h5>
                              <p className="m-0">
                                {i18?.TAX?.IFYOUAREVAT ||
                                  "If you are VAT-registered, please add your VAT ID."}{" "}
                                <a href="">
                                  {i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          <div className={`p-3`}>
                            <button
                              className={`${styles.button}`}
                              onClick={handleOpenVATModal}
                            >
                              {i18?.TAX?.ADDVATID || "Add VAT ID Number"}
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h5>{i18?.TAX?.NEEDHELP || "Need help?"}</h5>
                          <p>
                            {i18?.TAX?.GETANSWERSTO ||
                              "Get answers to questions about taxes in our  "}{" "}
                            <a href="">
                              {i18?.LISTING?.HELPCENTRE || "Help Centre"}
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className={`${styles.panels}`} value="2">
                  <div className="">
                    <div className={`${styles.guestcontent} p-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          {/* <h5>Your payments</h5> */}
                          <div className={`pt-3 pb-2`}>
                            <p className="m-0">
                              {i18?.TAX?.TAXDOCUMENTSREQUIRED ||
                                "Tax documents required for filing taxes are available to review and download here."}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            {/* <h5>Payment methods</h5> */}
                            <p className="m-0">
                              {i18?.TAX?.YOUCANALSOFILE ||
                                "You can also file taxes using detailed earnings info, available in the "}{" "}
                              <a href="">
                                {i18?.TAX?.EARNINGSSUMMARY ||
                                  "earnings summary"}
                              </a>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div className={`${styles.referal}`}>
                      <div className={`${styles.background} p-3`}>
                        <h5>2022</h5>
                        <div className={`pt-3 pb-2`}>
                          <p>
                            {i18?.TAX?.NOTAXDOCUMENTS ||
                              "No tax document issued"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div className={`${styles.referal}`}>
                      <div className={`${styles.background} p-3`}>
                        <h5>2021</h5>
                        <div className={`pt-3 pb-2`}>
                          <p>
                            {i18?.TAX?.NOTAXDOCUMENTS ||
                              "No tax document issued"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div className={`${styles.referal}`}>
                      <div className={`${styles.background} p-3`}>
                        <h5>2020</h5>
                        <div className={`pt-3 pb-2`}>
                          <p>
                            {i18?.TAX?.NOTAXDOCUMENTS ||
                              "No tax document issued"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div className={`${styles.referal}`}>
                      <div className={`${styles.background} p-3`}>
                        <h5>2019</h5>
                        <div className={`pt-3 pb-2`}>
                          <p>
                            {i18?.TAX?.NOTAXDOCUMENTS ||
                              "No tax document issued"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div className={`p-3`}>
                      <p>
                        {i18?.TAX?.FORTAXDOCUMENTS ||
                          "For tax documents issued prior to "}{" "}
                        2019,{" "}
                        <a href="">{i18?.listing?.CONTACTUS || "contact us"}</a>
                        .
                      </p>
                    </div>
                    <div>
                      <div className={`${styles.background} p-3`}>
                        <h5>{i18?.TAX?.NEEDHELP || "Need help?"}</h5>
                        <div className={`pt-3 pb-2`}>
                          <p className="m-0">
                            {i18?.TAX?.GETANSWERSTO ||
                              "Get answers to questions about taxes in our  "}
                            <a href="">
                              {i18?.LISTING?.HELPCENTRE || "Help Centre"}
                            </a>
                            <a href="">
                              {i18?.LISTING?.HELPCENTRE || "Help Centre"}
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <CustomModal
        open={open}
        onClose={handleCloseModal}
        padding={4}
        radius={5}
        w={556}
      >
        <div className={`${styles.modal}`}>
          <div className={`${styles.modal_header}`}>
            <h6>{i18?.TAX?.ADDTAXINFO || "Add tax info"}</h6>
          </div>
          <p>
            {i18?.TAX?.TOGETSTARTED ||
              "To get started, select a country/region to add your tax info."}
          </p>
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChangeRadio}
            >
              <FormControlLabel
                value="unitedstate"
                control={<Radio />}
                label="United States"
                sx={{ borderBottom: "1px solid #c4c4c4", padding: "10px" }}
              />
              <FormControlLabel
                value="european"
                control={<Radio />}
                label="European Union (EU)"
                sx={{ borderBottom: "1px solid #c4c4c4", padding: "10px" }}
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Another country/region"
                sx={{
                  padding: "10px",
                  paddingBottom: "30px",
                  borderBottom: "1px solid #c4c4c4",
                }}
              />
            </RadioGroup>
          </FormControl>
          <div className={`${styles.bottom}`}>
            <button onClick={handleCloseModal} className={`${styles.button2}`}>
              {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
            </button>
            <button onClick={handleCloseModal}>
              {i18?.LISTING?.CONTINUE || "Continue"}
            </button>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={openVATNumber}
        onClose={handleCloseModal}
        padding={4}
        w={556}
        radius={5}
      >
        <div className={`${styles.modal}`}>
          <div className={`${styles.modal_header}`}>
            <h6>{i18?.TAX?.ADDVATID || "Add VAT ID Number"}</h6>
          </div>
          <p>
            {i18?.TAX?.IFYOUAREREGISTERED ||
              "If you are registered with the European Commission, verification may take up to 48 hours. We’ll send you an email when it’s finished. More information on VAT IDs can be found here."}
          </p>
          <div className={`${styles.content}`}>
            <select
              id="selectBox"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="option1">{i18?.TAX?.OPTION || "Option "} 1</option>
              <option value="option2">{i18?.TAX?.OPTION || "Option "} 2</option>
              <option value="option3">{i18?.TAX?.OPTION || "Option "} 3</option>
            </select>
            <TextField
              fullWidth
              label="Add VAT ID number"
              id="VATnumber"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="Neme on registration"
              id="registration"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="Adress line 1"
              id="adress1"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="Adress line 2"
              id="adress2"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="City"
              id="City"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="Province or region"
              id="Province or region"
              sx={{ marginBottom: "30px" }}
            />
            <TextField
              fullWidth
              label="Postalcode"
              id="Postalcode"
              sx={{ marginBottom: "30px" }}
            />
          </div>
          <div className={`${styles.bottom}`}>
            <button
              onClick={handleCloseVATModal}
              className={`${styles.button2}`}
            >
              {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
            </button>
            <button onClick={handleCloseVATModal}>
              {i18?.LISTING?.CONTINUE || "Continue"}
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default PaymentsMethods;
