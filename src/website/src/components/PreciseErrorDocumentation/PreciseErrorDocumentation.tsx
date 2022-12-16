import React, { useEffect, useRef } from 'react';
import { Container, Divider } from '@mui/material';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import Navigation from '../DocumentationNavigation/DocumentationNavigation';
import * as _errors from '../errors.json';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorInterface } from '../ErrorDocumentation/ErrorDocumentation';
import * as monaco from 'monaco-editor';

const errors:ErrorInterface = _errors;

function PreciseErrorDocumentation() {
    const {label} = useParams();
    const errorData = errors.parser[label!] ?? errors.validator[label!];
    if (errorData === undefined) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate();
        navigate('/');
    }
    
    const navArray = [
        {name: "Documentation", link: "/documentation"},
        {name: "Errors", link: "/documentation/errors"},
        {name: errorData.title}
    ];

    const divEl = useRef<HTMLDivElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;
    useEffect(() => {
        if (divEl.current) {
            editor = monaco.editor.create(divEl.current, {
                value: errorData.code,
                language: 'TMProgram',
                theme: "TMProgramTheme-dark",
                automaticLayout: true,
                wordWrap: "on",
                readOnly: true,
            });
        }
        return () => {
            editor.dispose();
        };
    }, []);
    return (
        <Container>
            <AppToolbar isDocumentation></AppToolbar>
            <Navigation navArray={navArray}></Navigation>
            <div className="content">
                <h1>Turing Machine Program Error- {errorData.title}</h1>
                <Divider/>
                <h4>Code</h4>
                <div className="Editor" ref={divEl}></div>
                <p>{"Caption: " + errorData.caption}</p>
                <h4>Issue</h4>
                <p dangerouslySetInnerHTML={{__html: errorData.description}}></p>
                <h4>How To Fix</h4>
                <p dangerouslySetInnerHTML={{__html: errorData.fix}}></p>
            </div>
        </Container>
    );
}

export default PreciseErrorDocumentation;