import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import './TMPanel.css';
import { TuringMachine } from 'parser-tml';
import FSMPanel from '../FSMPanel/FSMPanel';
import ButtonGroup from '@mui/material/ButtonGroup';
import DefTMPanel from '../DefTMPanel/DefTMPanel';

enum Display {
    FSM, DEF, NEITHER
}

interface TMPanelProps {
    turingMachine: TuringMachine|undefined;
    currentState: string|undefined;
    currentEdge: string|undefined;
    isTapeExecuting: boolean;
    transitionTime: number;
}

function TMPanel({ turingMachine, currentEdge, currentState, isTapeExecuting, transitionTime }:TMPanelProps) {
    // whether the convert button is enabled
    const [isConvertEnabled, setIsConvertEnabled] = useState(true);
    
    // the TM actually being shown
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
    
    // what content is being displayed (neither = prompt, fsm = finite state machine or def = definition)
    const [displayScreen, setDisplayScreen] = useState(Display.NEITHER);

    useEffect(() => {
        setIsConvertEnabled(turingMachine !== undefined);
    }, [turingMachine]);

    useEffect(() => {
        if (isTapeExecuting && currentTM !== undefined) {
            setCurrentTM(turingMachine);
        }
    }, [isTapeExecuting]);

    function showScreen(screenValue:Display) {
        return () => {
            setCurrentTM(turingMachine);
            setDisplayScreen(screenValue);
        };
    }

    return (
        <div className='tm-panel'>
            <Box textAlign="center"><h2>Turing Machine</h2></Box>
            <div className='tm-screen'>
                {displayScreen === Display.FSM ?
                    (<FSMPanel transitionTime={transitionTime} currentEdge={currentEdge} currentState={currentState} turingMachine={currentTM!}/>)
                : displayScreen === Display.DEF ? 
                    (<DefTMPanel turingMachine={currentTM!}/>)
                    : (<></>)
                }
            </div>
            <div>
                <Box textAlign="center">
                    {currentTM ? <p>&nbsp;</p> : <p>Convert the Code into the Turing Machine</p>}
                </Box>
            <Box textAlign="center">
                <ButtonGroup variant="contained" aria-label="TM Conversion Options">
                    <Button onClick={showScreen(Display.FSM)} disabled={!isConvertEnabled}>Convert to FSM</Button>
                    <Button onClick={showScreen(Display.DEF)} disabled={!isConvertEnabled}>Show TM Definition</Button>
                </ButtonGroup>
            </Box>
            </div>
        </div>
    );
}

export default TMPanel;