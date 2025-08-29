'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './GrowWithUs.module.css';

const GrowWithUs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.growWithUsSection} ${isMounted && isVisible ? styles.visible : ''}`}
      id="signup"
    >
      <div className={styles.technicalBackground}></div>
      <div className={styles.constructionGrid}></div>
      <div className={styles.container}>
        <div className={styles.growWithUsHeader}>
          <div className={styles.technicalLabel}>JOIN OUR NETWORK</div>
          <h3 className={styles.growWithUsTitle}>Grow with us!</h3>
        </div>
        <p className={styles.growWithUsText}>
          Are you a qualified Quantity Surveyor looking to grow your client base and get real
          project opportunities? We’re building Africa’s leading QS referral platform — and we want
          <strong className={styles.highlight}> YOU</strong> to be part of it.
        </p>
        <div className={styles.growWithUsCta}>
          <h4 className={styles.growWithUsCtaTitle}>Partner With Us</h4>
          <p className={styles.growWithUsCtaText}>
            Look no more! Click here to be part of the community transforming construction to a top
            level
          </p>
          <button className={styles.signUpButton} aria-label="Sign up as a Quantity Surveyor">
            Sign Up Now
            <span className={styles.buttonArrow}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrowWithUs;