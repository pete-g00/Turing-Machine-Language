import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title in the app', () => {
  render(<App />);
  const linkElement = screen.getByText(/TML/);
  expect(linkElement).toBeInTheDocument();
});