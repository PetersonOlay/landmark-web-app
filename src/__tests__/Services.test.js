import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Services from '../pages/Services';

const renderServices = () => render(<BrowserRouter><Services /></BrowserRouter>);

describe('Services Page', () => {
  test('renders page heading', () => {
    renderServices();
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  test('renders all service cards', () => {
    renderServices();
    expect(screen.getByText('DevOps Training')).toBeInTheDocument();
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Cloud Computing (AWS)')).toBeInTheDocument();
    expect(screen.getByText('Linux Administration')).toBeInTheDocument();
    expect(screen.getByText('Containerization')).toBeInTheDocument();
    expect(screen.getByText('CI/CD Pipelines')).toBeInTheDocument();
  });

  test('renders CTA button linking to signup', () => {
    renderServices();
    const cta = screen.getByText('Get Started Today');
    expect(cta.closest('a')).toHaveAttribute('href', '/signup');
  });

  test('renders correct number of service cards', () => {
    const { container } = renderServices();
    const cards = container.querySelectorAll('.service-card');
    expect(cards).toHaveLength(6);
  });
});
