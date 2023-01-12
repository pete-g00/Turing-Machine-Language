import React from 'react';
import './TMPanel.css';
import TMCircle from '../TMCircle/TMCircle';
import TMArrow from '../TMArrow/TMArrow';
import { TransitionData, TuringMachine } from 'parser-tml';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

interface TMPanelProps {
    states:string[];
    coords:{x:number, y:number}[];
    turingMachine: TuringMachine|undefined;
    updateTM: () => void;
    btnEnabled: boolean;
    getUpdateDragCoord: () => (i:number, x:number, y:number) => void;
}

function TMPanel({ states, coords, getUpdateDragCoord, turingMachine, updateTM, btnEnabled }:TMPanelProps) {
    const statesIndex:{[key:string]: number} = {};
    const transitions:TransitionData[] = [];

    if (turingMachine) {
        for (let i = 0; i < states.length; i++) {
            statesIndex[states[i]] = i;
        }
        
        for (let i = 0; i < states.length-2; i++) {
            const tmState = turingMachine.getState(states[i])!;
            for (let j = 0; j < tmState.transitions.length; j++) {
                transitions.push(tmState.transitions[j]);
            }
        }
    }

    return (
        <div className='tm-panel'>
            <Box textAlign="center"><h2>Turing Machine</h2></Box>
            <svg viewBox='0 0 800 250'>
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
                    return <TMCircle label={state} getUpdateDragCoord={getUpdateDragCoord} r={25} coords={coords} i={i} key={i} text={circleLabel}/>;
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
            <div>
                <Box textAlign="center"><p>Convert the Code into the Turing Machine</p></Box>
                <Box textAlign="center"><Button variant="contained" onClick={updateTM} disabled={!btnEnabled}>Convert</Button></Box>
            </div>
        </div>
        );
}

export default TMPanel;