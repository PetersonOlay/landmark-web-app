import React from 'react';

export default function Contact() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-grid">
        <div className="contact-card">
          <div className="icon">📍</div>
          <h3>Address</h3>
          <p>Ontario, Canada</p>
        </div>
        <div className="contact-card">
          <div className="icon">📞</div>
          <h3>Phone / WhatsApp</h3>
          <p>+1 437 215 2483</p>
        </div>
        <div className="contact-card">
          <div className="icon">✉️</div>
          <h3>Email</h3>
          <p>info@mylandmarktech.com</p>
        </div>
      </div>
      <div className="connect-section">
        <h3>Connect with us</h3>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
    </div>
  );
}
