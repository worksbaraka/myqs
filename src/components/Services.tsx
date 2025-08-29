'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Services.module.css';

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to track active tab

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

  const services = [
    {
      icon: '📊',
      title: 'Planning Your Budget',
      description: 'Comprehensive cost planning and budget development for your construction projects'
    },
    {
      icon: '💰',
      title: 'Pricing Tenders',
      description: 'Accurate tender pricing and bid evaluation to ensure competitive advantage'
    },
    {
      icon: '🔄',
      title: 'Managing Contractors&apos; Payments',
      description: 'Professional payment certification and contractor management throughout project lifecycle'
    },
    {
      icon: '⚖️',
      title: 'Controlling Costs',
      description: 'Ongoing cost monitoring and control to keep your project within budget'
    }
  ];

  const hashtags = ['#myQS', '#buildnaplan', '#BuildSmart', '#CostControl', '#ProjectSuccess'];

  return (
    <section
      ref={sectionRef}
      className={`${styles.servicesSection} ${isMounted && isVisible ? styles.visible : ''}`}
      id="services"
    >
      {/* Background Elements */}
      <div className={styles.technicalBackground}></div>
      <div className={styles.constructionGrid}></div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.alertBanner}>
            <div className={styles.alertIcon}>⚠️</div>
            <h2 className={styles.alertTitle}>Don&apos;t go in blind</h2>
            <div className={styles.alertSubtitle}>Get referred to a QS!</div>
          </div>

          <div className={styles.targetAudience}>
            Whether you&apos;re a <span className={styles.highlight}>contractor</span>,
            <span className={styles.highlight}> homeowner</span>, or
            <span className={styles.highlight}> developer</span>, we connect you with
            certified QSs across Africa to guide you through your projects financially.
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {services.map((service, index) => (
              <button
                key={index}
                className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span className={styles.tabIcon}>{service.icon}</span>
                {service.title}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          <div className={styles.tabContentInner}>
            <div className={styles.tabIconLarge}>{services[activeTab].icon}</div>
            <h3 className={styles.tabTitle}>{services[activeTab].title}</h3>
            <p className={styles.tabDescription}>{services[activeTab].description}</p>
            <div className={styles.tabNumber}>{String(activeTab + 1).padStart(2, '0')}</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>🎯</div>
            <h3 className={styles.ctaTitle}>Ready to Start?</h3>
            <p className={styles.ctaSubtitle}>Click myQS to get started now!</p>
            <button className={styles.ctaButton}>
              Get Connected with a QS
              <span className={styles.buttonArrow}>→</span>
            </button>
          </div>
        </div>

        {/* Problem Statement */}
        <div className={styles.problemStatement}>
          <div className={styles.problemHeader}>
            <div className={styles.technicalLabel}>THE CHALLENGE</div>
            <h3>Why Choose myQS?</h3>
          </div>

          <div className={styles.problemContent}>
            <p>
              Securing a qualified Quantity Surveyor can be challenging for individual clients
              and small-scale developers. Whether constructing a new home, undertaking renovations,
              or managing a limited budget, professional cost oversight is essential—yet often
              difficult to access.
            </p>

            <div className={styles.solutionHighlight}>
              <div className={styles.solutionIcon}>✨</div>
              <div className={styles.solutionText}>
                <strong>That&apos;s where we come in.</strong> myQS facilitates seamless connections
                between property owners, developers, and licensed Quantity Surveyors—promptly,
                reliably, and with professionalism.
              </div>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className={styles.hashtagSection}>
          {hashtags.map((hashtag, index) => (
            <span key={index} className={styles.hashtag}>
              {hashtag}
            </span>
          ))}
        </div>

        {/* Technical Specs */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>COVERAGE</span>
            <span className={styles.specValue}>Africa-wide</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>RESPONSE TIME</span>
            <span className={styles.specValue}>24-48 Hours</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>CERTIFICATION</span>
            <span className={styles.specValue}>Licensed QSs Only</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>SECTORS</span>
            <span className={styles.specValue}>All Project Types</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;