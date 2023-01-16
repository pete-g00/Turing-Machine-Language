import React, { useRef, useState } from 'react';
import TapeEntry from '../TapeEntry/TapeEntry';
import * as d3 from 'd3';
import { Button, Grid } from '@mui/material';

function getPreviousOffsetIndex(i:number) {
    return i === 0 ? 16 : i-1;
}

function getNextOffsetIndex(i:number) {
    return i === 16 ? 0 : i+1;
}

function TMTape() {
    const gRefs:React.RefObject<SVGGElement>[] = [];
    const length = 17;

    const tapeValue = "100101";
    const [tape, setTape] = useState(Array(17).fill("").map((_, i) => tapeValue[i-1] ?? ""));
    const [tapeHeadIndex, setTapeHeadIndex] = useState(2);
    const [running, setRunning] = useState(true);
    const [playing, setPlaying] = useState(false);

    for (let i=0; i<length; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        gRefs[i] = useRef<SVGGElement>(null);
    }

    function changeValue(i:number, letter:string) {
        const newTape = tape.map((original, j) => i === j ? letter : original);
        setTape(newTape);
    }

    function moveEntry(gRef:React.RefObject<SVGGElement>, sign:number) {
        const nextTranslate = (d3.select(gRef.current).node()!.transform.baseVal[0]?.matrix.e ?? 0) + 50 * sign;
    
        d3.select(gRef.current)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${nextTranslate}, 0)`);
    }

    function moveToEnd(i:number) {
        const newTranslate = (length - 1 - i)*50;
        d3.select(gRefs[i].current)
            .transition()
            .duration(0)
            .attr('transform', `translate(${newTranslate}, 0)`);
    }

    function moveToStart(i:number) {
        const newTranslate = i*50;
        d3.select(gRefs[i].current)
            .transition()
            .duration(0)
            .attr('transform', `translate(-${newTranslate}, 0)`);
    }

    function transitionLeft() {
        const nextOffset = getNextOffsetIndex(tapeHeadIndex);
        // current leftmost entry
        const toMove = getPreviousOffsetIndex(getPreviousOffsetIndex(tapeHeadIndex));
        // move most entries to the left but the leftmost entry becomes the rightmost entry
        for (let i = 0; i < length; i++) {
            i === toMove ? moveToEnd(toMove): moveEntry(gRefs[i], -1);
        }
        setTapeHeadIndex(nextOffset);
    }
    
    function transitionRight() {
        const nextOffset = getPreviousOffsetIndex(tapeHeadIndex);
        // current rightmost entry
        const toMove = getPreviousOffsetIndex(getPreviousOffsetIndex(nextOffset));
        // move most entries to the right but the rightmost entry becomes the leftmost entry
        for (let i = 0; i < length; i++) {
            i === toMove ? moveToStart(toMove) : moveEntry(gRefs[i], 1);
        }
        setTapeHeadIndex(nextOffset);
    }

    function handleStep() {
        Math.random() > 0.5 ?  transitionLeft() : transitionRight();
    }

    // useInterval(() => {
    //     if (playing && running) {
    //         handleStep();
    //     }
    // }, 1000);

    // useEffect(() => {
    //     while (playing && running) {
    //         new Promise(resolve => useInterval(resolve, 1000)).then(handleStep);
    //     }
    // }, [playing]);

    return (
        <div className="tm-tape">
            {/* <Box textAlign="center">
                <h2>Run Program On Tape</h2>
                <p>Execute the Turing Machine program on a valid tape.</p>
            </Box>*/}
            <div style={{padding: "25px"}}>
                <svg style={{margin: "auto"}} viewBox='0 0 750 70'>
                    <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker></defs>
                    {gRefs.map((ref, i) => {
                        return <g ref={ref} key={i}><TapeEntry value={tape[i-1]} x1={-50 + 50*i} y1={0}/></g>;
                    })}
                    <line stroke='black' strokeWidth={1} markerEnd="url(#arrow)" x1={75} y1={70} x2={75} y2={55}></line>
                </svg>
            </div>
            <Grid container>
                <Grid item xs={1} />
                <Grid item xs={1}>
                    <Button onClick={handleStep} className='left' disabled={!running} variant='outlined'>Step</Button>
                </Grid>
                <Grid item xs={8} />
                <Grid item xs={1}>
                    <Button onClick={() => setPlaying(!playing)} disabled={!running} className='right' variant='outlined'>Play</Button>
                </Grid>
                <Grid item xs={1} />
            </Grid>
        </div>
    );
}

export default TMTape;