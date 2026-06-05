import React from 'react';

export default function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>About Us</h1>
      </div>
      <div className="about-content">
        <p>We are an online DevOps and IT training platform.</p>
        <p>Our courses are crafted by industry experts to meet the dynamic expectations of the business and IT world. Our hands-on sessions and practice assignments keep our trainees ahead of the curve in industry best practices.</p>
        <p>We provide <strong>ONE-TO-ONE online Live &amp; Interactive training</strong> through Zoom and Skype with experts always ready to provide training at a convenient time.</p>
        <div className="about-highlights">
          <div className="highlight-card">
            <div className="icon">👨‍🏫</div>
            <h3>Expert Instructors</h3>
            <p>Learn from professionals with 10+ years of industry experience.</p>
          </div>
          <div className="highlight-card">
            <div className="icon">🖥️</div>
            <h3>Live & Interactive</h3>
            <p>One-to-one sessions via Zoom and Skype at your convenience.</p>
          </div>
          <div className="highlight-card">
            <div className="icon">🛠️</div>
            <h3>Hands-On Practice</h3>
            <p>Real-world projects and assignments to build your portfolio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
