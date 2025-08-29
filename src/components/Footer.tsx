'use client';

import React from 'react';
import Head from 'next/head';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>myQS</h4>
            <p className={styles.footerText}>
              Delivering comprehensive quantity surveying solutions across all sectors of the built environment with precision, integrity, and innovation.
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#services" className={styles.footerLink}>Services</a></li>
              <li><a href="#about" className={styles.footerLink}>About Us</a></li>
              <li><a href="#contact" className={styles.footerLink}>Contact</a></li>
              <li><a href="#signup" className={styles.footerLink}>Join as a QS</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Contact Info</h4>
            <p className={styles.footerText}>
              Email: <a href="mailto:info@myqs.africa" className={styles.footerLink}>info@myqs.africa</a>
            </p>
            {/* <p className={styles.footerText}>Phone: +123-456-7890</p> */}
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a
                href="https://x.com/myQS"
                className={styles.socialIcon}
                aria-label="Follow myQS on X"
                role="img"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a
                href="https://linkedin.com/myQS"
                className={styles.socialIcon}
                aria-label="Follow myQS on LinkedIn"
                role="img"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href="https://facebook.com/myQS"
                className={styles.socialIcon}
                aria-label="Follow myQS on Facebook"
                role="img"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} myQS. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;