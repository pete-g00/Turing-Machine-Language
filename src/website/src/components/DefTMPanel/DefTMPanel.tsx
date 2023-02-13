import React from 'react';
import { TMChange, TuringMachine } from 'parser-tml';
import { MathComponent } from "mathjax-react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import "./DefTMPanel.css";
import { Box } from '@mui/system';

interface DefTMPanelProps {
    turingMachine: TuringMachine;
}

function convertValue(label:string) {
    switch (label) {
        case "accept":
            return "q_A";
        case "reject":
            return "q_R";
        default:
            return "q_" + label[label.length-1];
    }
}

function DefTMPanel({ turingMachine }: DefTMPanelProps) {
    const alphabet = "\\Sigma = \\{" + Array.from(turingMachine.alphabet).join(", ") + "\\}";
    const states = "Q = \\{" + turingMachine.states.map((_, i) => {
        return "q_" + i;
    }).join(", ") + ", q_A, q_R \\}";
    
    const transitions:TMChange[][] = [];
    for (let i = 0; i < turingMachine.states.length; i++) {
        const stateTransition:TMChange[] = [];
        const state = turingMachine.getState(turingMachine.states[i])!;
        for(const letter of Array.from(turingMachine.alphabet)) {
            stateTransition.push(state.transition(letter)!);
        }
        stateTransition.push(state.transition("")!);
        transitions.push(stateTransition);
    }

    return (
        <div>
            <Box textAlign='center'>
                <h3>Definition of the TM program</h3>
            </Box>
            <div className="def-panel">
                <p>The Turing Machine <MathComponent tex='(Q, \Sigma, q_0, \delta)' display={false}/> is given by:</p>
                <ul>
                    <li>alphabet <MathComponent display={false} tex={alphabet}/>;</li>
                    <li>states <MathComponent display={false} tex={states}/>;</li>
                    <li>the initial state <MathComponent display={false} tex='q_0'/></li>
                </ul>
                The transition function <MathComponent tex='\delta' display={false}/> is given in the table below:
                <div className='transition-table'>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    {Array.from(turingMachine.alphabet).map((letter, i) => {
                                        return (<TableCell align='center' key={i}>{letter}</TableCell>);
                                    })}
                                    <TableCell align='center'>#</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transitions.map((stateTransition, i) => {
                                    return (<TableRow key={i}>
                                        <TableCell align='center'>
                                            <MathComponent display={false} tex={'q_' + i}/>
                                        </TableCell>
                                        {stateTransition.map((change, j) => {
                                            return (<TableCell align='center' key={j}>
                                                <MathComponent 
                                                    tex={"(" + change.direction + ", " + (change.letter === "" ? "\\#" : change.letter) + ", " +
                                                    convertValue(change.nextState) + ")"} 
                                                display={false}/>
                                            </TableCell>);
                                        })}
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default DefTMPanel;