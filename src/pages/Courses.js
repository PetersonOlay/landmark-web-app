import React from 'react';

const courses = [
  {
    title: 'DevOps Engineering',
    modules: [
      'Linux Administration & Shell Scripting',
      'Git & GitHub Version Control',
      'CI/CD with Jenkins',
      'CI/CD with GitHub Actions & CircleCI',
      'Docker & Containerization',
      'Kubernetes & Container Orchestration',
      'Terraform - Infrastructure as Code',
      'Ansible - Configuration Management',
      'AWS Cloud (EC2, S3, VPC, IAM, EKS, ECS)',
      'Monitoring with Prometheus & Grafana',
      'Log Management with ELK Stack',
    ],
  },
  {
    title: 'AI & Machine Learning',
    modules: [
      'Python for AI/ML',
      'Data Processing with Pandas & NumPy',
      'Machine Learning Fundamentals',
      'Deep Learning with TensorFlow & PyTorch',
      'Natural Language Processing (NLP)',
      'Computer Vision',
      'MLOps - Deploying ML Models',
      'Generative AI & Large Language Models',
      'AI on AWS (SageMaker, Bedrock)',
    ],
  },
];

export default function Courses() {
  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#1a237e' }}>Course Outline</h2>
      {courses.map((course) => (
        <div className="course-card" key={course.title}>
          <h3>{course.title}</h3>
          <ul>
            {course.modules.map((mod) => (
              <li key={mod}>{mod}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
