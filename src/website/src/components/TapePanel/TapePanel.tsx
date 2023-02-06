import { Box } from '@mui/material';
import React, { useState } from 'react';
import { TuringMachine } from 'parser-tml';
import TapeInput from '../TapeInput/TapeInput';
import TapeScreen from '../TapeScreen/TapeScreen';
import './TapePanel.css';

interface TapePanelProps {
    turingMachine:TuringMachine|undefined;
}

function TapePanel({ turingMachine }:TapePanelProps) {
    const [tape, setTape] = useState("");
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);

    function goToTapeScreen() {
        setCurrentTM(turingMachine);
    }

    function goToTapeInput() {
        setCurrentTM(undefined);
    }

    return (
        <div className='tape-panel'>
            <Box textAlign="center">
                <h2>Run Program On Tape</h2>
                <p>Execute the Turing Machine program on a valid tape.</p>
            </Box>
            {currentTM === undefined
                ? <TapeInput alphabet={turingMachine?.alphabet} setTape={setTape} goToTapeScreen={goToTapeScreen} tape={tape}/> 
                : <TapeScreen goToTapeInput={goToTapeInput} tapeValue={tape} turingMachine={currentTM}/>
            }
        </div>
    );
}

export default TapePanel;