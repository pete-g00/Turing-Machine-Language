import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ErrorDocumentation from './ErrorDocumentation';
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


test("The page should have a link for unexpected-eof", () => {
    render(<MemoryRouter><ErrorDocumentation userConfiguration={userConfiguration} /></MemoryRouter>);
    const eofElement = screen.getByText('Unexpected End Of File').closest("a");
    expect(eofElement).toHaveAttribute('href', '/documentation/errors/unexpected-eof');
});