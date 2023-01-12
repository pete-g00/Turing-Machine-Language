import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Editor, { code } from '../Editor/Editor';
import TMPanel from '../TMPanel/TMPanel';
import TMTape from '../TMTape/TMTape';
import './Homepage.css';
import AppToolbar from '../Apptoolbar/Apptoolbar';
import { TuringMachine, CodeParser, CodeConverter } from 'parser-tml';

function generateStateAndCoords(turingMachine:TuringMachine|undefined) {
    let states:string[] = [];
    const coords:{x:number, y:number}[] = [];

    if (turingMachine) {
        states = [...turingMachine.states, "accept", "reject"];
        for (let i = 0; i < turingMachine.states.length+2; i++) {
            coords[i] = {
                x: 50+150*i, 
                y: 150
            };
        }
    }

    return {states, coords};
}

function HomePage() {
    const parser = new CodeParser(code);
    const program = parser.parse();
    const converter = new CodeConverter(program!);
    const firstTM = converter.convert();
    
    // the latest TM from the editor
    const [turingMachine, setTuringMachine] = useState<TuringMachine>(firstTM);
    const [isConvertEnabled, setIsConvertEnabled] = useState(true);
    
    function updateTM(tm:TuringMachine|undefined) {
        if (tm !== undefined) {
            setTuringMachine(tm);
            setIsConvertEnabled(true);
        } else {
            setIsConvertEnabled(false);
        }
    }
    
    // the current TM
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
    
    // the states within the TM
    const [states, setStates] = useState<string[]>([]);
    // the coords within the TM
    const [coords, setCoords] = useState<{x:number, y:number}[]>([]);

    function updateTuringMachine() {
        setCurrentTM(turingMachine);
        const { coords, states } = generateStateAndCoords(turingMachine);
        setStates(states);        
        setCoords(coords);
    }

    function updateDragCoord(i:number, x:number, y:number) {
        const newCoords = coords.map((value, j) => i === j ? {x, y} : {x: value.x, y: value.y});
        setCoords(newCoords);
    }
    
    return (
        <div>
            <AppToolbar></AppToolbar>
            <Grid container className="code-section">
                <Grid item xs={12} md={6} className="editor">
                    <Editor setTuringMachine={updateTM}></Editor>
                </Grid>
                <Grid item xs={12} md={6} className="tm">
                    <div className="tm-panel">
                        <TMPanel 
                            coords={coords}
                            getUpdateDragCoord={() => updateDragCoord}
                            turingMachine={currentTM}
                            states={states} 
                            updateTM={updateTuringMachine} 
                            btnEnabled={isConvertEnabled} />
                    </div>
                    <div className="tm-tape"><TMTape></TMTape></div>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomePage;