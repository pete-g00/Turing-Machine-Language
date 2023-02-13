import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CodePosition, ProgramContext, TuringMachine } from 'parser-tml';
import TapeInput from '../TapeInput/TapeInput';
import TapeScreen from '../TapeScreen/TapeScreen';
import './TapePanel.css';

interface TapePanelProps {
    turingMachine: TuringMachine|undefined;
    program: ProgramContext | undefined;
    setExecutingPositions:(executingPositions:CodePosition[]) => void;
    setCurrentState: (state:string|undefined) => void;
    setCurrentEdge: (edge:string|undefined) => void;
    transitionTime:number;
    setIsTapeExecuting: (isTapeExecuting:boolean) => void;
}

function TapePanel({ turingMachine, program, setExecutingPositions, setCurrentEdge, setCurrentState, setIsTapeExecuting, transitionTime }:TapePanelProps) {
    const [tape, setTape] = useState("");
    const [currentTM, setCurrentTM] = useState<TuringMachine|undefined>(undefined);
    const [currentProgram, setCurrentProgram] = useState<ProgramContext|undefined>(undefined);

    function goToTapeScreen() {
        setCurrentTM(turingMachine);
        setCurrentProgram(program);
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
                <p>{currentTM ? String.fromCharCode(160) : "Execute the Turing Machine program on a valid tape."}</p>
            </Box>
            {currentTM === undefined
                ? <TapeInput alphabet={turingMachine?.alphabet} setTape={setTape} goToTapeScreen={goToTapeScreen} tape={tape}/> 
                : <TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} program={currentProgram!}
                        setExecutingPositions={setExecutingPositions} setCurrentEdge={setCurrentEdge} tapeValue={tape} 
                        turingMachine={currentTM} transitionTime={transitionTime}/>
            }
        </div>
    );
}

export default TapePanel;