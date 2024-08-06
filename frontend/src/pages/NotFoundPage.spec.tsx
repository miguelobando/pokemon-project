import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';
import { it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

it('renders NotFoundPage', () => {
  render(
    <BrowserRouter>
      <NotFoundPage />
    </BrowserRouter>
  );
  expect(screen.getByText("Oops! The page you're looking for doesn't exist.")).toBeInTheDocument();
});