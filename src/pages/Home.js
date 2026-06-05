import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Landmark Technologies</h1>
        <p>Premier DevOps & AI Training Program. Master the tools and practices that drive modern software delivery and artificial intelligence.</p>
      </section>
      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="icon">🚀</div>
            <h3>Hands-On Labs</h3>
            <p>Real-world projects with industry tools like Jenkins, Docker, Kubernetes & AWS.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🤖</div>
            <h3>AI & ML Training</h3>
            <p>From Python fundamentals to deploying large language models in production.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💼</div>
            <h3>Career Support</h3>
            <p>Resume reviews, mock interviews, and job placement assistance.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 0 3rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#1a237e' }}>Ready to transform your career?</h2>
          <p style={{ marginBottom: '2rem', color: '#555' }}>Enroll today and gain hands-on experience with industry-leading technologies.</p>
          <Link to="/signup" className="cta-btn">Sign Up Now</Link>
        </div>
      </div>
    </>
  );
}
