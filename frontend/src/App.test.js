import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './js components/header';
//import App from './App';

test('renders learn react link', () => {
    render(<Header />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
