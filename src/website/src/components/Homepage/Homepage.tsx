import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Editor from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TMTape from '../TMTape/TMTape';
import './Homepage.css';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import { TuringMachine } from 'parser-tml';

function HomePage() {
    const [turingMachine, setTuringMachine] = useState<TuringMachine|undefined>(undefined);
    
    return (
        <div>
            <AppToolbar></AppToolbar>
            <Grid container className="code-section">
                <Grid item xs={12} md={6} className="editor">
                    <Editor setTuringMachine={setTuringMachine}></Editor>
                </Grid>
                <Grid item xs={12} md={6} className="tm">
                    <div className="tm-panel"><TMPanel turingMachine={turingMachine}></TMPanel></div>
                    <div className="tm-tape"><TMTape></TMTape></div>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;