import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import './TMPanel.css';
import { TuringMachine } from 'parser-tml';
import FSMPanel from '../FSMPanel/FSMPanel';

interface TMPanelProps {
    turingMachine: TuringMachine|undefined;
    currentState: string|undefined;
    currentEdge: string|undefined;
}

function TMPanel({ turingMachine, currentEdge, currentState }:TMPanelProps) {
    // whether the convert button is enabled
    const [isConvertEnabled, setIsConvertEnabled] = useState(true);
    
    // the TM actually being shown
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
        
    useEffect(() => {
        setIsConvertEnabled(turingMachine !== undefined);
    }, [turingMachine]);

    return (
        <div className='tm-panel'>
            <Box textAlign="center"><h2>Turing Machine</h2></Box>
            <div className='tm-fsm'>
                {currentTM && <FSMPanel turingMachine={currentTM} currentEdge={currentEdge} currentState={currentState}/>}
            </div>
            <div>
                <Box textAlign="center">
                    {currentTM ? <p>&nbsp;</p> : <p>Convert the Code into the Turing Machine</p>}
                </Box>
                <Box textAlign="center"><Button variant="contained" onClick={() => setCurrentTM(turingMachine)} 
                    disabled={!isConvertEnabled}>Convert</Button></Box>
            </div>
        </div>
    );
}

export default TMPanel;