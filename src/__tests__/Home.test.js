import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

const renderHome = () => render(<BrowserRouter><Home /></BrowserRouter>);

describe('Home Page', () => {
  test('renders hero heading', () => {
    renderHome();
    expect(screen.getByText('Landmark Technologies')).toBeInTheDocument();
  });

  test('renders hero description', () => {
    renderHome();
    expect(screen.getByText(/Premier DevOps & AI Training Program/)).toBeInTheDocument();
  });

  test('renders call to action button', () => {
    renderHome();
    const cta = screen.getByText('Sign Up Now');
    expect(cta).toBeInTheDocument();
    expect(cta.closest('a')).toHaveAttribute('href', '/signup');
  });

  test('renders enrollment prompt', () => {
    renderHome();
    expect(screen.getByText('Ready to transform your career?')).toBeInTheDocument();
  });
});
