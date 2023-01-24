import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Editor, { code } from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TapePanel from '../TapePanel/TapePanel';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import { TuringMachine, CodeParser, CodeConverter } from 'parser-tml';
import { UserConfiguration } from '../../App';

interface HomePageProps {
    userConfiguration:UserConfiguration;
}

function HomePage({ userConfiguration }:HomePageProps) {
    const parser = new CodeParser(code);
    const program = parser.parse();
    const converter = new CodeConverter(program!);
    const firstTM = converter.convert();
    
    const [turingMachine, setTuringMachine] = useState<TuringMachine|undefined>(firstTM);
    
    return (
        <div>
            <AppToolbar userConfiguration={userConfiguration}></AppToolbar>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Editor userConfiguration={userConfiguration} setTuringMachine={setTuringMachine}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TMPanel turingMachine={turingMachine}/>
                    <TapePanel turingMachine={turingMachine}/>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;