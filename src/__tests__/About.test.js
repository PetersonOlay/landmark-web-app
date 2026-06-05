import { render, screen } from '@testing-library/react';
import About from '../pages/About';

describe('About Page', () => {
  test('renders page heading', () => {
    render(<About />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  test('renders about description', () => {
    render(<About />);
    expect(screen.getByText(/online DevOps and IT training platform/)).toBeInTheDocument();
  });

  test('renders training method info', () => {
    render(<About />);
    expect(screen.getByText(/ONE-TO-ONE online Live/)).toBeInTheDocument();
  });

  test('renders highlight cards', () => {
    render(<About />);
    expect(screen.getByText('Expert Instructors')).toBeInTheDocument();
    expect(screen.getByText('Live & Interactive')).toBeInTheDocument();
    expect(screen.getByText('Hands-On Practice')).toBeInTheDocument();
  });
});
