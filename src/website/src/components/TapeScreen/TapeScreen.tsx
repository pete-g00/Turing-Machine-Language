import React, { useEffect, useRef, useState } from 'react';
import TapeEntry from '../TapeEntry/TapeEntry';
import * as d3 from 'd3';
import { Button } from '@mui/material';
import { TuringMachine, TMExecutor, Direction, TerminationState } from 'parser-tml';
import './TapeScreen.css';

function getPreviousOffsetIndex(i:number) {
    return i === 0 ? 16 : i-1;
}

function getNextOffsetIndex(i:number) {
    return i === 16 ? 0 : i+1;
}

interface TapeScreenProps {
    turingMachine:TuringMachine;
    tapeValue:string;
    goToTapeInput:() => void;
}

function TapeScreen({ tapeValue, turingMachine, goToTapeInput }:TapeScreenProps) {
    const length = 17;
    const executor = new TMExecutor(tapeValue, turingMachine);

    const [tape, setTape] = useState(Array(17).fill("").map((_, i) => tapeValue[i-2]?.trim() ?? ""));
    const [tapeHeadIndex, setTapeHeadIndex] = useState(2);
    const [canGoBack, setCanGoBack] = useState(true);
    const [canStep, setCanStep] = useState(true);
    const [stepId, setStepId] = useState<NodeJS.Timeout|undefined>(undefined);

    const executorRef = useRef(executor);
    const gRefs:React.RefObject<SVGGElement>[] = [];
    
    for (let i=0; i<length; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        gRefs[i] = useRef<SVGGElement>(null);
    }

    // changes the two values during each step
    function changeValues(i1:number, val1:string, i2:number, val2:string) {
        const newTape = tape.map((original, j) => {
            if (j === i1) {
                return val1;
            } else if (j === i2) {
                return val2;
            } else {
                return original;
            }
        });
        setTape(newTape);
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
        const leftmostValue = executorRef.current.tape.get(15);
        changeValues(i, val, leftmostIndex, leftmostValue);
        
        // move most entries to the left but the leftmost entry becomes the rightmost entry
        for (let i = 0; i < length; i++) {
            i === leftmostIndex ? moveToEnd(leftmostIndex): moveEntry(gRefs[i], -1);
        }
        setTapeHeadIndex(nextOffset);
    }
    
    // transitions the tape entries to the left
    function transitionLeft(i:number, val:string) {
        const nextOffset = getPreviousOffsetIndex(tapeHeadIndex);

        const rightmostIndex = getPreviousOffsetIndex(getPreviousOffsetIndex(nextOffset));
        const rightMostValue = executorRef.current.tape.get(-3);
        changeValues(i, val, rightmostIndex, rightMostValue);

        // move most entries to the right but the rightmost entry becomes the leftmost entry
        for (let i = 0; i < length; i++) {
            i === rightmostIndex ? moveToStart(rightmostIndex) : moveEntry(gRefs[i], 1);
        }
        setTapeHeadIndex(nextOffset);
    }

    function terminationMessage() {
        if (executorRef.current.terminationStatus === TerminationState.ACCEPT) {
            return "Accepted";
        } else if (executorRef.current.terminationStatus === TerminationState.REJECT) {
            return "Rejected";
        } else {
            return "";
        }
    }

    function handleStep() {
        setCanStep(false);
        setCanGoBack(false);
        const currentState = executorRef.current.currentState;
        const tmState = turingMachine.getState(currentState)!;
        const transition = tmState.transition(tape[tapeHeadIndex])!;
    
        transition.direction === Direction.LEFT 
            ? transitionLeft(tapeHeadIndex, transition.letter) 
            : transitionRight(tapeHeadIndex, transition.letter);

        executorRef.current.execute();
        
        const stepId = setTimeout(() => {
            setCanStep(executorRef.current.terminationStatus === undefined);
            setCanGoBack(true);
        }, 1000);
        setStepId(stepId);
    }

    useEffect(() => {
      return () => {
        if (stepId) {
            clearTimeout(stepId);
        }
      };
    }, []);

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
                <span className='termination-message'>{terminationMessage()}</span>
                <Button onClick={handleStep} disabled={!canStep} variant='contained'>Step</Button>
            </div>
        </div>
    );
}

export default TapeScreen;