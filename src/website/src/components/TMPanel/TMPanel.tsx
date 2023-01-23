import React, { useEffect, useState } from 'react';
import TMCircle from '../TMCircle/TMCircle';
import TMArrow from '../TMArrow/TMArrow';
import { TransitionData, TuringMachine } from 'parser-tml';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import './TMPanel.css';

interface TMPanelProps {
    turingMachine: TuringMachine|undefined;
}

function generateStateAndCoords(turingMachine:TuringMachine|undefined) {
    let states:string[] = [];
    const coords:{x:number, y:number}[] = [];

    if (turingMachine) {
        states = [...turingMachine.states, "accept", "reject"];
        for (let i = 0; i < turingMachine.states.length+2; i++) {
            coords[i] = {
                x: 50+150*i, 
                y: 100
            };
        }
    }

    return {states, coords};
}


function TMPanel({ turingMachine }:TMPanelProps) {
    // whether the convert button is enabled
    const [isConvertEnabled, setIsConvertEnabled] = useState(true);
    
    // the TM actually being shown
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
    
    // the states within the TM
    const [states, setStates] = useState<string[]>([]);

    // the coords within the TM
    const [coords, setCoords] = useState<{x:number, y:number}[]>([]);

    useEffect(() => {
        setIsConvertEnabled(turingMachine !== undefined);
    }, [turingMachine]);

    function updateTuringMachine() {
        const { coords, states } = generateStateAndCoords(turingMachine);
        setCurrentTM(turingMachine);
        setStates(states);
        setCoords(coords);
    }

    function updateDragCoord(i:number, x:number, y:number) {
        const newCoords = coords.map((value, j) => i === j ? {x, y} : {x: value.x, y: value.y});
        setCoords(newCoords);
    }
    
    const statesIndex:{[key:string]: number} = {};
    const transitions:TransitionData[] = [];

    if (currentTM) {
        for (let i = 0; i < states.length; i++) {
            statesIndex[states[i]] = i;
        }
        
        for (let i = 0; i < states.length-2; i++) {
            const tmState = currentTM.getState(states[i])!;
            for (let j = 0; j < tmState.transitions.length; j++) {
                transitions.push(tmState.transitions[j]);
            }
        }
    }

    return (
        <div className='tm-panel'>
            <Box textAlign="center"><h2>Turing Machine</h2></Box>
            <div className='tm-fsm'>
                <svg viewBox='0 0 1000 300'>
                    <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker></defs>

                    {states.map((state, i) => {
                        let circleLabel:string;
                        switch (state) {
                            case "accept":
                                circleLabel = "A";
                                break;
                            case "reject":
                                circleLabel = "R";
                                break;
                            default:
                                circleLabel = "q"+i;
                                break;
                        }
                        return <TMCircle label={state} updateDragCoord={updateDragCoord} r={25} coords={coords} i={i} key={i} text={circleLabel}/>;
                    })}
                    {transitions.map((transition, i) => {
                        const fromStateIndex = statesIndex[transition.currentState];
                        const toStateIndex = statesIndex[transition.nextState];
                        return <TMArrow key={i} text={transition.label} 
                            x1={coords[fromStateIndex].x} 
                            x2={coords[toStateIndex].x} 
                            y1={coords[fromStateIndex].y} 
                            y2={coords[toStateIndex].y} 
                        />;
                    })}
                </svg>
            </div>
            <div>
                <Box textAlign="center"><p>Convert the Code into the Turing Machine</p></Box>
                <Box textAlign="center"><Button variant="contained" onClick={updateTuringMachine} disabled={!isConvertEnabled}>Convert</Button></Box>
            </div>
        </div>
    );
}

export default TMPanel;