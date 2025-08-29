'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  const missionItems = [
    'Deliver value-driven services',
    'Uphold professionalism', 
    'Promote sustainability',
    'Embrace innovation'
  ];

  const visionItems = [
    'Be the benchmark for QS excellence',
    'Empower client success',
    'Lead with integrity', 
    'Shape the future of the industry'
  ];

  const coreValues = [
    { title: 'Integrity', icon: '⚖️', description: 'Honest and ethical practices in all dealings' },
    { title: 'Transparency', icon: '🔍', description: 'Clear communication and open processes' },
    { title: 'Innovation', icon: '💡', description: 'Embracing technology and modern solutions' },
    { title: 'Client Focus', icon: '🎯', description: 'Dedicated to exceeding client expectations' }
  ];

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.aboutSection} ${isVisible ? styles.visible : ''}`}
      id="about"
    >
      {/* Technical Grid Background */}
      <div className={styles.technicalGrid}></div>
      <div className={styles.blueprintLines}></div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          {/* <div className={styles.technicalLabel}>SECTION 02</div> */}
          <h2 className={styles.sectionTitle}>About Us</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Company Overview */}
          <div className={styles.overviewCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>01</div>
              <h3>Company Overview</h3>
            </div>
            <div className={styles.cardContent}>
              <p>
                At <strong>myQS</strong>, we combine industry expertise with innovative 
                technology to deliver exceptional quantity surveying services that add 
                tangible value to your construction projects.
              </p>
              <p>
                Our team of chartered quantity surveyors brings decades of combined 
                experience across residential, commercial, industrial, and infrastructure sectors.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className={styles.missionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>02</div>
              <h3>Mission</h3>
            </div>
            <div className={styles.cardContent}>
              <ul className={styles.itemList}>
                {missionItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <span className={styles.bulletPoint}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vision */}
          <div className={styles.visionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>03</div>
              <h3>Vision</h3>
            </div>
            <div className={styles.cardContent}>
              <ul className={styles.itemList}>
                {visionItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <span className={styles.bulletPoint}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <div className={styles.technicalLabel}>CORE VALUES</div>
            <h3>Our Foundation</h3>
          </div>
          
          <div className={styles.valuesGrid}>
            {coreValues.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueDescription}>{value.description}</p>
                <div className={styles.valueNumber}>{String(index + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs Footer */}
        {/* <div className={styles.specsFooter}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>TEAM SIZE</span>
            <span className={styles.specValue}>15+ Professionals</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>EXPERIENCE</span>
            <span className={styles.specValue}>25+ Years Combined</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>PROJECTS</span>
            <span className={styles.specValue}>200+ Completed</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>SECTORS</span>
            <span className={styles.specValue}>4 Major Industries</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default About;