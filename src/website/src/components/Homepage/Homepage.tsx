import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Editor, { code } from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TapePanel from '../TapePanel/TapePanel';
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
        <div className="homepage">
            <AppToolbar></AppToolbar>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Editor setTuringMachine={setTuringMachine}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TMPanel turingMachine={turingMachine}/>
                    <TapePanel turingMachine={turingMachine}/>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;