import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Editor, { code } from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TMTape from '../TMTape/TMTape';
import './Homepage.css';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import { TuringMachine, CodeParser, CodeConverter } from 'parser-tml';

function HomePage() {
    const parser = new CodeParser(code);
    const program = parser.parse();
    const converter = new CodeConverter(program!);
    const firstTM = converter.convert();
    
    const [turingMachine, setTuringMachine] = useState<TuringMachine|undefined>(firstTM);
    
    return (
        <div>
            <AppToolbar></AppToolbar>
            <Grid container className="code-section">
                <Grid item xs={12} md={6} className="editor">
                    <Editor setTuringMachine={setTuringMachine}></Editor>
                </Grid>
                <Grid item xs={12} md={6} className="tm">
                    <div className="tm-panel"><TMPanel turingMachine={turingMachine} /></div>
                    <div className="tm-tape"><TMTape></TMTape></div>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;