import React, { useEffect, useRef, useState } from 'react';
import './Editor.css';
import * as monaco from 'monaco-editor';
import { getProgram } from '../MonacoConfig';
import { CodePosition, ProgramContext } from 'parser-tml';
import { UserConfiguration } from '../../App';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface EditorProps {
    setProgram: (program:ProgramContext|undefined) => void;
    userConfiguration:UserConfiguration;
    isTapeExecuting:boolean;
    executingPositions:CodePosition[];
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

function Editor({ userConfiguration, setProgram, isTapeExecuting, executingPositions }:EditorProps) {
    const divEl = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor|null>(null);
    const markers:monaco.editor.IMarkerData[] = [];
    const event = useRef<monaco.IDisposable|undefined>(undefined);
    
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
                if (!isTapeExecuting) {
                    const program = getProgram(_editor.getValue(), markers);
                    monaco.editor.setModelMarkers(_editor.getModel()!, "validate-TMP", markers);
                    
                    if (markers.length === 0) {
                        setProgram(program);
                    } else {
                        setProgram(undefined);
                    }
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
            const value = editor.current?.getValue();
            event.current = editor.current?.onDidChangeModelContent(() => {
                if (editor.current?.getValue() !== value) {
                    editor.current?.setValue(value!);
                    setShowSnackbar(true);
                }
            });
        } else {
            markers.length = 0;
            monaco.editor.setModelMarkers(editor.current!.getModel()!, "executing-code", markers);
            event.current?.dispose();
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

    useEffect(() => {
        if (editor.current) {
            markers.length = 0;
            monaco.editor.setModelMarkers(editor.current!.getModel()!, "executing-code", markers);
            for (const position of executingPositions) {
                markers.push({
                    endColumn: position.endColNumber+1,
                    endLineNumber: position.endLineNumber,
                    startColumn: position.startColNumber+1,
                    startLineNumber: position.startLineNumber+1,
                    message: "The code being executed",
                    severity: monaco.MarkerSeverity.Info
                });
            }
            setTimeout(() => {
                monaco.editor.setModelMarkers(editor.current!.getModel()!, "executing-code", markers);
            }, 100);
        }
    }, [executingPositions]);

    const [showSnackbar, setShowSnackbar] = useState(false);
    function handleSnackbarClose(event?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
          return;
        }
        setShowSnackbar(false);
    }

    return (<>
        <div className="Editor" ref={divEl}></div>
        
        <Snackbar open={showSnackbar} onClick={() => setShowSnackbar(true)} onClose={handleSnackbarClose} 
            autoHideDuration={2000} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
            <MuiAlert elevation={6} variant="filled" severity='error' onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                Cannot Edit When Executing on Tape.
            </MuiAlert>
        </Snackbar>
    </>);
}

export default Editor;