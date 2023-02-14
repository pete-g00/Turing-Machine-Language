import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './DocumentationNavigation';

test('Navigation has a p-tag for the final element in the navArray', () => {
    render(<MemoryRouter>
        <Navigation navArray={[{name: 'Documentation'}]}/>
    </MemoryRouter>);
    const documentationElement = screen.getByText("Documentation");
    expect(documentationElement).not.toHaveAttribute('href');
});

test('Navigation has an anchor-tag for a non-final element in the navArray', () => {
    render(<MemoryRouter>
        <Navigation navArray={[{name: 'Errors', link: '/documentation/errors'}, {name: 'Documentation'}]}/>
    </MemoryRouter>);
    const documentationElement = screen.getByText("Errors");
    expect(documentationElement).toHaveAttribute('href', '/documentation/errors');
});