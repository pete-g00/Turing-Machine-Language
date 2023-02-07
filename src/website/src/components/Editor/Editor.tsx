import React, { useEffect, useRef } from 'react';
import './Editor.css';
import * as monaco from 'monaco-editor';
import { getProgram } from '../MonacoConfig';
import { ProgramContext } from 'parser-tml';
import { UserConfiguration } from '../../App';

interface EditorProps {
    program: React.MutableRefObject<ProgramContext | undefined>;
    userConfiguration:UserConfiguration;
    isTapeExecuting:boolean;
}

export const code = `// checks whether a binary number is divisible by 2
alphabet = {0, 1}
module isDiv2 {
    while 0, 1 {
        move right
    } if blank {
        move left
        if 0 {
            accept
        } if 1, blank {
            reject
        }
    }
}`;

function Editor({ userConfiguration, program, isTapeExecuting }:EditorProps) {
    const divEl = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor|null>(null);
    const markers:monaco.editor.IMarkerData[] = [];
    
    useEffect(() => {
        if (divEl.current) {
            const _editor = monaco.editor.create(divEl.current, {
                value: code,
                language: 'TMProgram',
                theme: "dracula",
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                detectIndentation: true,
            });
            _editor.onDidChangeModelContent(() => {
                console.log("program changed");
                const _program = getProgram(_editor.getValue(), markers);
                monaco.editor.setModelMarkers(_editor.getModel()!, "validate-TMP", markers);
                
                if (markers.length === 0) {
                    program.current = _program;
                } else {
                    program.current = undefined;
                }
            });
            editor.current = _editor;
        }
        return () => {
            if (editor.current) {
                editor.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (isTapeExecuting) {
            editor.current?.updateOptions({
                readOnly: true
            });
        } else {
            editor.current?.updateOptions({
                readOnly: false
            });
        }
    }, [isTapeExecuting]);

    useEffect(() => {
        if (editor.current) {
            editor.current.updateOptions({
                theme: userConfiguration.editorTheme,
                fontSize: userConfiguration.editorFontSize.value,
                lineNumbers: userConfiguration.showEditorLineNumber ? "on" : "off"
            });
        }
    }, [userConfiguration]);

    return (
        <div className="Editor" ref={divEl}></div>
    );
}

export default Editor;