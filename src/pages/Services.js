import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  { icon: '⚙️', title: 'DevOps Training', desc: 'Master CI/CD, Docker, Kubernetes, Terraform, Ansible, and cloud infrastructure on AWS.' },
  { icon: '🤖', title: 'AI & Machine Learning', desc: 'Learn Python, TensorFlow, NLP, computer vision, and MLOps for production deployments.' },
  { icon: '☁️', title: 'Cloud Computing (AWS)', desc: 'Hands-on training with EC2, S3, VPC, IAM, EKS, ECS, and cloud architecture best practices.' },
  { icon: '🐧', title: 'Linux Administration', desc: 'Shell scripting, system administration, networking, and server management.' },
  { icon: '📦', title: 'Containerization', desc: 'Docker and Kubernetes orchestration for scalable microservices deployments.' },
  { icon: '🔄', title: 'CI/CD Pipelines', desc: 'Jenkins, GitHub Actions, CircleCI — automate your build, test, and deployment workflows.' },
];

export default function Services() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Our Services</h1>
        <p style={{ color: '#555', marginTop: '0.5rem' }}>Industry-leading training programs tailored to your career goals</p>
      </div>
      <div className="services-grid">
        {services.map((s) => (
          <div className="service-card" key={s.title}>
            <div className="icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <Link to="/signup" className="cta-btn">Get Started Today</Link>
      </div>
    </div>
  );
}
