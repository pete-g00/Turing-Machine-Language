import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import './TMPanel.css';
import { TuringMachine } from 'parser-tml';
import FSMPanel from '../FSMPanel/FSMPanel';

interface TMPanelProps {
    turingMachine: TuringMachine|undefined;
}

function TMPanel({ turingMachine }:TMPanelProps) {
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
                {currentTM && <FSMPanel turingMachine={currentTM}/>}
            </div>
            <div>
                <Box textAlign="center"><p>Convert the Code into the Turing Machine</p></Box>
                <Box textAlign="center"><Button variant="contained" onClick={() => setCurrentTM(turingMachine)} 
                    disabled={!isConvertEnabled}>Convert</Button></Box>
            </div>
        </div>
    );
}

export default TMPanel;