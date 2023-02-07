import React, { useEffect, useRef, useState } from 'react';
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
    const program = useRef<ProgramContext|undefined>(undefined);
    const [turingMachine, setTuringMachine] = useState<TuringMachine|undefined>(undefined);
    
    const [currentState, setCurrentState] = useState<string|undefined>(undefined);
    const [currentEdge, setCurrentEdge] = useState<string|undefined>(undefined);
    
    const [isTapeExecuting, setIsTapeExecuting] = useState(false);

    // the timeout fn to revert current edge and marker position back to undefined 
    // (animation occurs even if the previous value equals the current value)
    const [changeCurrentEdgeFn, setChangeCurrentEdgeFn] = useState<NodeJS.Timeout|undefined>(undefined);

    useEffect(() => {
        if (currentEdge) {
            const changeCurrentEdgeFn = setTimeout(() => {
                setCurrentEdge(undefined);
            }, 500);
            setChangeCurrentEdgeFn(changeCurrentEdgeFn);
        }
        
        return (() => {
            if (changeCurrentEdgeFn) {
                clearTimeout(changeCurrentEdgeFn);
            }
        });
    }, [currentEdge]);

    useEffect(() => {
        const parser = new CodeParser(code);
        const _program = parser.parse();
        program.current = _program;
        const converter = new CodeConverter(_program);
        setTuringMachine(converter.convert());
    }, []);

    useEffect(() => {
        if (program.current) {
            const converter = new CodeConverter(program.current);
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
                    <Editor userConfiguration={userConfiguration} 
                        program={program} isTapeExecuting={isTapeExecuting}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TMPanel turingMachine={turingMachine} currentEdge={currentEdge} currentState={currentState} />
                    <TapePanel program={program} turingMachine={turingMachine} 
                        setIsTapeExecuting={setIsTapeExecuting} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge}/>
                </Grid>
            </Grid>
            <AppDrawer userConfiguration={userConfiguration}/>
        </div>
    );
}

export default HomePage;