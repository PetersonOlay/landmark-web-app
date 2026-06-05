import { render, screen } from '@testing-library/react';
import Courses from '../pages/Courses';

describe('Courses Page', () => {
  test('renders page heading', () => {
    render(<Courses />);
    expect(screen.getByText('Course Outline')).toBeInTheDocument();
  });

  test('renders DevOps Engineering course', () => {
    render(<Courses />);
    expect(screen.getByText('DevOps Engineering')).toBeInTheDocument();
  });

  test('renders AI & Machine Learning course', () => {
    render(<Courses />);
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument();
  });

  test('renders DevOps modules', () => {
    render(<Courses />);
    expect(screen.getByText('Linux Administration & Shell Scripting')).toBeInTheDocument();
    expect(screen.getByText('Git & GitHub Version Control')).toBeInTheDocument();
    expect(screen.getByText('CI/CD with Jenkins')).toBeInTheDocument();
    expect(screen.getByText('Docker & Containerization')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes & Container Orchestration')).toBeInTheDocument();
    expect(screen.getByText('Terraform - Infrastructure as Code')).toBeInTheDocument();
    expect(screen.getByText('Ansible - Configuration Management')).toBeInTheDocument();
    expect(screen.getByText(/AWS Cloud/)).toBeInTheDocument();
    expect(screen.getByText('Monitoring with Prometheus & Grafana')).toBeInTheDocument();
    expect(screen.getByText('Log Management with ELK Stack')).toBeInTheDocument();
  });

  test('renders AI modules', () => {
    render(<Courses />);
    expect(screen.getByText('Python for AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning with TensorFlow & PyTorch')).toBeInTheDocument();
    expect(screen.getByText('Natural Language Processing (NLP)')).toBeInTheDocument();
    expect(screen.getByText('Computer Vision')).toBeInTheDocument();
    expect(screen.getByText('MLOps - Deploying ML Models')).toBeInTheDocument();
    expect(screen.getByText('Generative AI & Large Language Models')).toBeInTheDocument();
    expect(screen.getByText(/AI on AWS/)).toBeInTheDocument();
  });

  test('renders correct number of course cards', () => {
    const { container } = render(<Courses />);
    const cards = container.querySelectorAll('.course-card');
    expect(cards).toHaveLength(2);
  });
});
