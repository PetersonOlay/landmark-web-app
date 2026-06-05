import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const renderApp = () => render(<BrowserRouter><App /></BrowserRouter>);

describe('App Component', () => {
  test('renders navbar with brand name', () => {
    renderApp();
    const headings = screen.getAllByText('Landmark Technologies');
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  test('renders navigation links', () => {
    renderApp();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getAllByText('About Us')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Services')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Courses')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Register')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Contact Us')[0]).toBeInTheDocument();
  });

  test('navbar links have correct hrefs', () => {
    renderApp();
    const navLinks = screen.getByRole('navigation').querySelectorAll('a');
    const hrefs = Array.from(navLinks).map(a => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/services');
    expect(hrefs).toContain('/courses');
    expect(hrefs).toContain('/signup');
    expect(hrefs).toContain('/contact');
  });

  test('renders footer', () => {
    renderApp();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });
});
