import { render, screen } from '@testing-library/react';
import Contact from '../pages/Contact';

describe('Contact Page', () => {
  test('renders page heading', () => {
    render(<Contact />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders address', () => {
    render(<Contact />);
    expect(screen.getByText('Ontario, Canada')).toBeInTheDocument();
  });

  test('renders phone number', () => {
    render(<Contact />);
    expect(screen.getByText('+1 437 215 2483')).toBeInTheDocument();
  });

  test('renders email', () => {
    render(<Contact />);
    expect(screen.getByText('info@mylandmarktech.com')).toBeInTheDocument();
  });

  test('renders social links', () => {
    render(<Contact />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  test('renders connect section', () => {
    render(<Contact />);
    expect(screen.getByText('Connect with us')).toBeInTheDocument();
  });
});
