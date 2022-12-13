import React from 'react';
import { render, screen } from '@testing-library/react';
import AppToolbar from './Apptoolbar';
import { MemoryRouter } from 'react-router-dom';

test('renders link to documentation in homescreen', () => {
    render(<MemoryRouter><AppToolbar/></MemoryRouter>);
    const docLinkElement = screen.getByText(/Documentation/);
    expect(docLinkElement).toBeInTheDocument();
});

test('doesn\'t render link to homescreen in homescreen', () => {
    render(<MemoryRouter><AppToolbar/></MemoryRouter>);
    expect(() => {
        screen.getByText(/Home/);
    }).toThrow();
});

test('renders link to homescreen in documentation', () => {
    render(<MemoryRouter><AppToolbar isDocumentation/></MemoryRouter>);
    const editorLinkElement = screen.getByText(/Home/);
    expect(editorLinkElement).toBeInTheDocument();
});

test('doesn\'t render link to documentation in homescreen', () => {
    render(<MemoryRouter><AppToolbar isDocumentation/></MemoryRouter>);
    expect(() => {
        screen.getByText(/Documentation/);
    }).toThrow();
});
