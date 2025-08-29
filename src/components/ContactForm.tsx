'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', email: '', subject: '', message: '' };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.contactSection} ${isMounted && isVisible ? styles.visible : ''}`}
      id="contact"
    >
      <div className={styles.technicalBackground}></div>
      <div className={styles.constructionGrid}></div>
      <div className={styles.container}>
        <div className={styles.contactHeader}>
          <div className={styles.technicalLabel}>GET IN TOUCH</div>
          <h3 className={styles.contactTitle}>Contact Us</h3>
        </div>
        <div className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className={styles.formInput}
              placeholder="Your full name"
              aria-required="true"
            />
            {formErrors.name && <span className={styles.formError}>{formErrors.name}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className={styles.formInput}
              placeholder="Your email address"
              aria-required="true"
            />
            {formErrors.email && <span className={styles.formError}>{formErrors.email}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.formLabel}>Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              className={styles.formInput}
              placeholder="Subject of your message"
              aria-required="true"
            />
            {formErrors.subject && <span className={styles.formError}>{formErrors.subject}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              className={styles.formTextarea}
              placeholder="Your message"
              rows={5}
              aria-required="true"
            />
            {formErrors.message && <span className={styles.formError}>{formErrors.message}</span>}
          </div>
          <button
            className={styles.submitButton}
            onClick={handleFormSubmit}
            aria-label="Submit contact form"
          >
            Send Message
            <span className={styles.buttonArrow}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;