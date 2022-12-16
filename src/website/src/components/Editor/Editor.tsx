import React, { useEffect, useRef } from 'react';
import './Editor.css';
import * as monaco from 'monaco-editor';
import { showErrors } from '../MonacoConfig';

const code = `// checks whether a binary number is divisible by 2
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

function Editor() {
    const divEl = useRef<HTMLDivElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;
    const markers:monaco.editor.IMarkerData[] = [];
    useEffect(() => {
        if (divEl.current) {
            editor = monaco.editor.create(divEl.current, {
                value: code,
                language: 'TMProgram',
                theme: "TMProgramTheme-dark",
                automaticLayout: true,
                wordWrap: "on",
            });
            editor.onDidChangeModelContent(() => {
                showErrors(editor.getValue(), markers);
                monaco.editor.setModelMarkers(editor.getModel()!, "validate-TMP", markers);
            });
        }
        return () => {
            editor.dispose();
        };
    }, []);
    return (
        <div className="Editor" ref={divEl}></div>
    );
}

export default Editor;