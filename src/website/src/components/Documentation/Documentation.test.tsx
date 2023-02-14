import React from 'react';
import { render, screen } from '@testing-library/react';
import Documentation from './Documentation';
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

test('documentation has a link to TM specification', () => {
    render(<MemoryRouter><Documentation userConfiguration={userConfiguration} /></MemoryRouter>);
    const tmLinkElement = screen.getByText(/Turing Machine Specification/).closest('a');
    expect(tmLinkElement).toHaveAttribute('href', '/documentation/turing-machine/');
});

test('documentation has a link to TML specification', () => {
    render(<MemoryRouter><Documentation userConfiguration={userConfiguration}/></MemoryRouter>);
    const tmlLinkElement = screen.getByText(/Turing Machine Program Specification/).closest('a');
    expect(tmlLinkElement).toHaveAttribute('href', '/documentation/turing-machine-language/');
});

test('documentation has a link to errors', () => {
    render(<MemoryRouter><Documentation userConfiguration={userConfiguration}/></MemoryRouter>);
    const errorLinkElement = screen.getByText(/Errors/).closest('a');
    expect(errorLinkElement).toHaveAttribute('href', '/documentation/errors/');
});