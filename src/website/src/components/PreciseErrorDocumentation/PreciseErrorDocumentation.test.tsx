import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PreciseErrorDocumentation from './PreciseErrorDocumentation';
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({label: 'unexpected-eof'}),
    useNavigate: () => ((val:string) => {throw val;})
}));

test("When a valid route is given, the page shows the right page", () => {
    render(<MemoryRouter><PreciseErrorDocumentation userConfiguration={userConfiguration} /></MemoryRouter>);
    expect(document.title).toBe("TML Errors- Unexpected End Of File");
});