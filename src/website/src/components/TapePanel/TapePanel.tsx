import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ProgramContext, TuringMachine } from 'parser-tml';
import TapeInput from '../TapeInput/TapeInput';
import TapeScreen from '../TapeScreen/TapeScreen';

interface TapePanelProps {
    turingMachine: TuringMachine|undefined;
    program: ProgramContext | undefined;
    setCurrentState: (state:string|undefined) => void;
    setCurrentEdge: (edge:string|undefined) => void;
    setIsTapeExecuting: (isTapeExecuting:boolean) => void;
}

function TapePanel({ turingMachine, setCurrentEdge, setCurrentState, setIsTapeExecuting }:TapePanelProps) {
    const [tape, setTape] = useState("");
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
    // const [currentProgram, setCurrentProgram] = useState<ProgramContext|undefined>(undefined);

    function goToTapeScreen() {
        setCurrentTM(turingMachine);
        // setCurrentProgram(program);
        setIsTapeExecuting(true);
    }

    function goToTapeInput() {
        setCurrentTM(undefined);
        setCurrentState(undefined);
        setIsTapeExecuting(false);
    }

    return (
        <div className='tape-panel'>
            <Box textAlign="center">
                <h2>Run Program On Tape</h2>
                <p>Execute the Turing Machine program on a valid tape.</p>
            </Box>
            {currentTM === undefined
                ? <TapeInput alphabet={turingMachine?.alphabet} setTape={setTape} goToTapeScreen={goToTapeScreen} tape={tape}/> 
                : <TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} 
                        setCurrentEdge={setCurrentEdge} tapeValue={tape} turingMachine={currentTM}/>
            }
        </div>
    );
}

export default TapePanel;