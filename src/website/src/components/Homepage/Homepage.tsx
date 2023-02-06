import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Editor, { code } from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TapePanel from '../TapePanel/TapePanel';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import { CodeParser, CodeConverter, ProgramContext, TuringMachine } from 'parser-tml';
import AppDrawer from '../AppDrawer/AppDrawer';
import { UserConfiguration } from '../../App';

interface HomePageProps {
    userConfiguration: UserConfiguration;
}

function HomePage({ userConfiguration }:HomePageProps) {
    const [program, setProgram] = useState<ProgramContext|undefined>(undefined);
    const [turingMachine, setTuringMachine] = useState<TuringMachine|undefined>(undefined);

    useEffect(() => {
        const parser = new CodeParser(code);
        const program = parser.parse();
        setProgram(program);
        const converter = new CodeConverter(program);
        setTuringMachine(converter.convert());
    }, []);

    useEffect(() => {
        if (program) {
            const converter = new CodeConverter(program);
            setTuringMachine(converter.convert());
        } else {
            setTuringMachine(undefined);
        }
    }, [program]);

    return (
        <div>
            <AppToolbar userConfiguration={userConfiguration} />
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Editor 
                        userConfiguration={userConfiguration} 
                        setProgram={setProgram}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TMPanel turingMachine={turingMachine}/>
                    <TapePanel turingMachine={turingMachine}/>
                </Grid>
            </Grid>
            <AppDrawer 
                userConfiguration={userConfiguration}/>
        </div>
    );
}

export default HomePage;