"use client";
import React from "react";
import {
  Breadcrumbs,
  Link,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Website } from "@/app/global/svg";

import styles from "./page.module.scss";

const CssTextField = styled(TextField)({
  "& .MuiInput-underline:after": {
    borderBottomColor: "transparent",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
});

const PaymentsMethods = () => {
  return (
    <>
      <div className={`${styles.professional}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.tabpanel} mx-auto`}>
          <div className={`${styles.breadcrums}`}>
            <div className="mx-3">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" href="/account-settings">
                  Accounts
                </Link>
                <Typography color="text.primary">
                  Professional hosting tools
                </Typography>
              </Breadcrumbs>
            </div>
            <div>
              <h1 className={`m-3`}>Professional hosting tools</h1>
            </div>
          </div>
          <div className={`${styles.tab}`}>
            <div className={`${styles.tabwidth}`}>
              <div className="px-3">
                <div className={`d-flex justify-content-between pt-3 pb-2`}>
                  <h6 className="m-0">Company</h6>
                  <button className={`${styles.button}`}>Manage</button>
                </div>
                <div className=" pb-3">
                  <p className="m-0">
                    Edit your company info and manage your listings at scale
                  </p>
                </div>

                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>

                <div className={``}>
                  <h6 className="m-0">Create a custom profile URL</h6>
                  <p>
                    Share this URL when you want to show off your <Website />{" "}
                    profile, which has links to all of your listings.
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className={`${styles.textborder} d-flex align-items-center me-3`}
                  >
                    <div className={`${styles.url} ps-3`}>
                      <Website />
                      .co.in/p/
                    </div>
                    <div className="">
                      <CssTextField className={`${styles.textfield} w-100'`} />
                    </div>
                  </div>
                  <div className="my-3 me-3">
                    <button className={`${styles.save}`}>Save</button>
                  </div>
                  <div>
                    <button disabled className={`${styles.copy}`}>
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p>
                    <span>Tip:</span> Help to make your URL memorable by using
                    words and phrases relevant to what you offer.
                  </p>
                </div>
                <div>
                  <p>
                    Avoid including contact info, property types and regions
                    only, trademarks, or travel company names (including{" "}
                    <Website />
                    ). <a href=""> Learn more about our policies</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default PaymentsMethods;
