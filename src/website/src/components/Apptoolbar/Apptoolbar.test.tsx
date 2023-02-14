import React from 'react';
import { render, screen } from '@testing-library/react';
import AppToolbar from './Apptoolbar';
import { MemoryRouter } from 'react-router-dom';
import { EditorFontSize, EditorTheme, ExampleKey, UserConfiguration } from '../../App';

function setEditorTheme(userConfiguration:UserConfiguration, theme:EditorTheme) {
    userConfiguration.editorTheme = theme;
}

function setEditorFontSize(userConfiguration:UserConfiguration, fontSize:EditorFontSize) {
    userConfiguration.editorFontSize = fontSize;
}

function setShowEditorLineNumber(userConfiguration:UserConfiguration, showLineNumber:boolean) {
    userConfiguration.showEditorLineNumber = showLineNumber;
}

function setTransitionTime(userConfiguration:UserConfiguration, time:number) {
    userConfiguration.transitionTime = time;
}

function openDrawer(userConfiguration:UserConfiguration) {
    userConfiguration.isDrawerOpen = true;
}

function closeDrawer(userConfiguration:UserConfiguration) {
    userConfiguration.isDrawerOpen = false;
}

function setExampleKey(userConfiguration:UserConfiguration, exampleKey:ExampleKey|undefined) {
    userConfiguration.exampleKey = exampleKey;
}

const userConfiguration:UserConfiguration = {
    editorTheme: "dracula",
    editorFontSize: EditorFontSize.NORMAL,
    isDrawerOpen: false,
    showEditorLineNumber: true,
    transitionTime: 0.5,
    exampleKey: "isDiv2",
    setEditorTheme,
    setEditorFontSize,
    setShowEditorLineNumber,
    setTransitionTime,
    openDrawer,
    closeDrawer,
    setExampleKey
};

test('renders link to documentation in homescreen', () => {
    render(<MemoryRouter><AppToolbar userConfiguration={userConfiguration}/></MemoryRouter>);
    const docLinkElement = screen.getByText(/Documentation/);
    expect(docLinkElement).toHaveAttribute('href', '/documentation');
});

test('doesn\'t render link to homescreen in homescreen', () => {
    render(<MemoryRouter><AppToolbar userConfiguration={userConfiguration}/></MemoryRouter>);
    expect(() => {
        screen.getByText(/Editor/);
    }).toThrow();
});

test('renders link to homescreen in documentation', () => {
    render(<MemoryRouter><AppToolbar isDocumentation userConfiguration={userConfiguration}/></MemoryRouter>);
    const editorLinkElement = screen.getByText(/Editor/);
    expect(editorLinkElement).toHaveAttribute('href', '/');
});

test('doesn\'t render link to documentation in homescreen', () => {
    render(<MemoryRouter><AppToolbar isDocumentation userConfiguration={userConfiguration}/></MemoryRouter>);
    expect(() => {
        screen.getByText(/Documentation/);
    }).toThrow();
});