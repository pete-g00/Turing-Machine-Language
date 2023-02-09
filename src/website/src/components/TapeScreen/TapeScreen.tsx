import React, { useEffect, useRef, useState } from 'react';
import TapeEntry from '../TapeEntry/TapeEntry';
import * as d3 from 'd3';
import { Button } from '@mui/material';
import { TuringMachine, TMExecutor, Direction, TerminationState, ProgramContext, CodePosition, CodeExecutor } from 'parser-tml';
import './TapeScreen.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function getPreviousOffsetIndex(i:number) {
    return i === 0 ? 16 : i-1;
}

function getNextOffsetIndex(i:number) {
    return i === 16 ? 0 : i+1;
}

interface TapeScreenProps {
    turingMachine:TuringMachine;
    program:ProgramContext;
    setExecutingPositions:(executingPositions:CodePosition[]) => void;
    tapeValue:string;
    goToTapeInput:() => void;
    setCurrentState: (state:string|undefined) => void;
    setCurrentEdge: (edge:string|undefined) => void;
}

function TapeScreen({ tapeValue, turingMachine, setExecutingPositions, program,  goToTapeInput, setCurrentEdge, setCurrentState }:TapeScreenProps) {
    const length = 17;
    const tmExecutor = new TMExecutor(tapeValue, turingMachine);
    const tmpExecutor = new CodeExecutor(tapeValue, program);

    const [tape, setTape] = useState(Array(17).fill("").map((_, i) => tapeValue[i-2]?.trim() ?? ""));
    const [tapeHeadIndex, setTapeHeadIndex] = useState(2);
    const [canGoBack, setCanGoBack] = useState(true);
    const [canStep, setCanStep] = useState(true);
    const [stepId, setStepId] = useState<NodeJS.Timeout|undefined>(undefined);
    const [msg, setMsg] = useState<string>("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const tmExecutorRef = useRef(tmExecutor);
    const tmpExecutorRef = useRef(tmpExecutor);

    const gRefs:React.RefObject<SVGGElement>[] = [];
    
    for (let i=0; i<length; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        gRefs[i] = useRef<SVGGElement>(null);
    }

    // changes the two values during each step
    function changeValues(i1:number, val1:string, i2:number, val2:string):boolean {
        let changed = true;
        const newTape = tape.map((original, j) => {
            if (j === i1) {
                changed = val1 !== original;
                return val1;
            } else if (j === i2) {
                return val2;
            } else {
                return original;
            }
        });
        setTape(newTape);
        return changed;
    }

    // moves the `g` element corresponding to the `gRef` by (50*`sign`, 0) 
    function moveEntry(gRef:React.RefObject<SVGGElement>, sign:number) {
        const nextTranslate = (d3.select(gRef.current).node()!.transform.baseVal[0]?.matrix.e ?? 0) + 50 * sign;
    
        d3.select(gRef.current)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${nextTranslate}, 0)`);
    }

    // moves the element at index `i` to the end
    function moveToEnd(i:number) {
        const newTranslate = (length - 1 - i)*50;
        d3.select(gRefs[i].current)
            .transition()
            .duration(0)
            .attr('transform', `translate(${newTranslate}, 0)`);
    }

    // moves the element at index `i` to the start
    function moveToStart(i:number) {
        const newTranslate = i*50;
        d3.select(gRefs[i].current)
            .transition()
            .duration(0)
            .attr('transform', `translate(-${newTranslate}, 0)`);
    }

    // transitions the tape entries to the right
    function transitionRight(i:number, val:string) {
        const nextOffset = getNextOffsetIndex(tapeHeadIndex);
        
        const leftmostIndex = getPreviousOffsetIndex(getPreviousOffsetIndex(tapeHeadIndex));
        const leftmostValue = tmExecutorRef.current.tape.get(15);
        const changed = changeValues(i, val, leftmostIndex, leftmostValue);
        let msg = "";

        if (changed) {
            msg += "Changing the tapehead value to " + (val || "blank") + ". ";
        }
        
        // move most entries to the left but the leftmost entry becomes the rightmost entry
        for (let i = 0; i < length; i++) {
            i === leftmostIndex ? moveToEnd(leftmostIndex): moveEntry(gRefs[i], -1);
        }
        setTapeHeadIndex(nextOffset);
        msg += "Moving to the right";
        setMsg(msg);
    }
    
    // transitions the tape entries to the left
    function transitionLeft(i:number, val:string) {
        const nextOffset = getPreviousOffsetIndex(tapeHeadIndex);

        const rightmostIndex = getPreviousOffsetIndex(getPreviousOffsetIndex(nextOffset));
        const rightMostValue = tmExecutorRef.current.tape.get(-3);
        const changed = changeValues(i, val, rightmostIndex, rightMostValue);
        let msg = "";

        if (changed) {
            msg += "Changing the tapehead value to " + (val || "blank") + ". ";
        }

        // move most entries to the right but the rightmost entry becomes the leftmost entry
        for (let i = 0; i < length; i++) {
            i === rightmostIndex ? moveToStart(rightmostIndex) : moveEntry(gRefs[i], 1);
        }
        setTapeHeadIndex(nextOffset);
        msg += "Moving to the left";
        setMsg(msg);
    }

    function setTerminationMessage() {
        if (tmExecutorRef.current.terminationStatus === TerminationState.ACCEPT) {
            setMsg("Tape Accepted");
        } else if (tmExecutorRef.current.terminationStatus === TerminationState.REJECT) {
            setMsg("Tape Rejected");
        }
    }

    function handleStep() {
        setCanStep(false);
        setCanGoBack(false);
        const currentState = tmExecutorRef.current.currentState;
        const tmState = turingMachine.getState(currentState)!;
        const transition = tmState.transition(tape[tapeHeadIndex])!;
        
        const currentEdgeIdx = tmState.transitions.findIndex((value) => value.letters.includes(tape[tapeHeadIndex]));
        const currentEdge = tmState.transitions[currentEdgeIdx];
        const letters = currentEdge.letters.map((val) => val.length === 0 ? "_" : val).join("-");
        const transitionLabel = `${currentEdge.currentState}-${currentEdge.nextState}-${letters}`;
    
        transition.direction === Direction.LEFT 
            ? transitionLeft(tapeHeadIndex, transition.letter) 
            : transitionRight(tapeHeadIndex, transition.letter);

        const executingPositions = tmpExecutorRef.current.currentBasicBlock?.positions;
        
        tmExecutorRef.current.execute();
        tmpExecutorRef.current.execute();

        setCurrentEdge(transitionLabel);
        setTerminationMessage();
        setShowSnackbar(true);
        setExecutingPositions(executingPositions ?? []);
        
        const stepId = setTimeout(() => {
            setCurrentState(tmExecutorRef.current.currentState);
            setCanStep(tmExecutorRef.current.terminationStatus === undefined);
            setCanGoBack(true);
            setExecutingPositions([]);
        }, 500);
        setStepId(stepId);
    }

    useEffect(() => {
        setCurrentState(tmExecutorRef.current.currentState);
        return () => {
            if (stepId) {
                clearTimeout(stepId);
            }
        };
    }, []);

    function handleSnackbarClose(event?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
          return;
        }
        setShowSnackbar(false);
    }

    return (
        <div>
            <div className='tape'>
                <svg viewBox='0 0 750 70'>
                    <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker></defs>
                    {gRefs.map((ref, i) => {
                        return <g ref={ref} key={i}><TapeEntry value={tape[i]} x1={-50 + 50*i} y1={0}/></g>;
                    })}
                    <line stroke='black' strokeWidth={1} markerEnd="url(#arrow)" x1={75} y1={70} x2={75} y2={55}></line>
                </svg>
            </div>
            <div className='buttons'>
                <Button color='secondary' onClick={goToTapeInput} disabled={!canGoBack} variant='contained'>Back</Button>
                <Button onClick={handleStep} disabled={!canStep} variant='contained'>Step</Button>
            </div>
            <Snackbar open={showSnackbar} onClick={() => setShowSnackbar(true)} onClose={handleSnackbarClose} 
                autoHideDuration={400} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <MuiAlert elevation={6} variant="filled" severity='info' onClose={handleSnackbarClose} sx={{ width: '100%' }}>{msg}</MuiAlert>
            </Snackbar>
        </div>
    );
}

export default TapeScreen;