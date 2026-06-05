import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Services from './pages/Services';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <img src="/logo.png" alt="Landmark Technologies" className="navbar-logo" />
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/signup">Register</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/signup">Register</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <p>We are an online DevOps and IT training platform. Our courses are crafted by industry experts to meet the dynamic expectations of the business and IT world.</p>
          </div>
          <div className="footer-col">
            <h4>Contacts</h4>
            <p>📍 Ontario, Canada</p>
            <p>📞 +1 437 215 2483</p>
            <p>✉️ info@mylandmarktech.com</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Landmark Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
