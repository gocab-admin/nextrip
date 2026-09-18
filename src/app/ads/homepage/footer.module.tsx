'use client';
import React from 'react';
import styles from './footer.module.scss';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { IoLocationSharp, IoCall, IoMail } from 'react-icons/io5';
import Link from 'next/link';
import { AppName } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

const Footer = () => {

  const { i18, currency, languages, settings }: any = usePageContext();
  let currentURL = settings ? settings?.socialLinks : {};
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={`${styles.footer_container}`}>
          <div className={`${styles.footer_column}`}>
            {/* <div className={styles['footer-logo']}>
            <img src={'/fitnest/logo_white.png'} alt="FitNest Logo" />
            </div> */}
            <ul className={styles['footer-links']}>
              <li><IoLocationSharp /> 146-147, Vakkil New St, Simmakkal, Madurai Main, Madurai, Tamil Nadu 625001</li>
              <li><IoCall /> 092223 79222</li>
              <li><IoMail /> support@abservetech.com</li>
            </ul>
          </div>
          <div className={`${styles.footer_column}`}>
            <div className={styles['footer-section']}>
              <h5 className={styles.footer_title}>Company</h5>
              <ul className={styles['footer-links']}>
              <li><Link href="/terms/">Terms & Condition</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Refund Policy</Link></li>
              <li><Link href="/privacy/">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className={`${styles.footer_column}`}>
            <div className={styles['footer-section']}>
              <h5 className={styles.footer_title}>Help</h5>
              <ul className={styles['footer-links']}>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              </ul>
            </div>
          </div>
          <div className={`${styles.footer_column}`}>
            <div className={styles['footer-section']}>
              <h5 className={styles.footer_title}>Social profile</h5>
              <div className={styles['footer-social']}>
                <a href={currentURL?.facebook} target="_blank"><FaFacebookF /></a>
                {/* <a href="#"><FaLinkedinIn /></a> */}
                <a href={currentURL?.twitter} target="_blank" ><FaTwitter /></a>
                <a href={currentURL?.instagram} target="_blank" ><FaInstagram /></a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['footer-bottom']}>
                  © {currentYear} <AppName />, Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
