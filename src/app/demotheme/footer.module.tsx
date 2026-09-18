'use client';
import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { usePageContext } from "@/components/Providers/PageContext";
import styles from './footer.module.scss';

export default function Footer() {
  const { i18, currency, languages, settings }: any = usePageContext();
  let currentURL = settings ? settings?.socialLinks : {};

return (
    <div>
      {/* Footer Section */}
      <footer className="bg-light mt-5">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-3">
              <h6 className="font-weight-600 text-uppercase text-13" >POPULAR CITIES</h6>
              <ul className="list-unstyled">
                <li>New York</li>
                <li>Sydney</li>
                <li>Paris</li>
                <li>Barcelona</li>
                <li>Berlin</li>
                <li>Budapest</li>
                <li>Singapore</li>
                <li>New Delhi</li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="font-weight-600 text-uppercase text-13">HOSTING</h6>
              <ul className="list-unstyled">
                <li>Help</li>
                <li>About</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Become Host</li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="font-weight-600 text-uppercase text-13">COMPANY</h6>
              <ul className="list-unstyled">
                <li>Policies</li>
                <li>Privacy</li>
                <li>Guest Refund</li>
                <li>Cancellation Policies</li>
              </ul>
            </div>
            <div className="col-md-3 text-center">
              <img src="https://demowpthemes.com/buy2rental/public/front/images/logos/logo.png" alt="Rental Logo" className="mb-2" style={{ width: "130px", height: '30px' }} />
              {/* <h6 className="text-danger">Rental</h6> */}
              <div className={styles['footer-social']}>
                <a href="#" onClick={() =>
                          window.open(currentURL?.facebook, "_blank")
                        }><FaFacebookF /></a>
                <a href="#"><FaLinkedinIn /></a>
                <a href="#" onClick={() =>
                          window.open(currentURL?.twitter, "_blank")
                        }><FaTwitter /></a>
                <a href="#" onClick={() =>
                          window.open(currentURL.instagram, "_blank")
                        }><FaInstagram /></a>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-dark text-white text-center py-2">
          Your experience on this site will be improved by allowing cookies.{" "}
          <button className="btn btn-light btn-sm">Allow Cookies</button>
        </div> */}
      </footer>
    </div>
  );
};