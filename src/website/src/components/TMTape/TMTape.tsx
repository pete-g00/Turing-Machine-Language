import React, { useEffect, useRef } from 'react';
import TapeEntry from './../TapeEntry/TapeEntry';
import './TMTape.css';
import * as d3 from 'd3';

function moveLeft(rectRef:React.RefObject<SVGRectElement>, lineRef:React.RefObject<SVGLineElement>, textRef:React.RefObject<SVGTextElement>) {
    const currentOffset = d3.select(lineRef.current).attr('transform')?.split(/[(,]/)[1] ?? 0;
    const nextTranslate = 'translate(' + (Number.parseInt(currentOffset) + 50) +', 0)';
    d3.select(lineRef.current)
        .transition()
        .duration(1000)
        .attr('transform', nextTranslate);
    
    d3.select(textRef.current!)
        .transition()
        .duration(1000)
        .attr('transform', nextTranslate);

    d3.select(rectRef.current)
        .transition()
        .duration(1000)
        .attr('transform', nextTranslate);
}

function TMTape() {
    const gRef = useRef<SVGGElement>(null);

    const lineRefs:React.RefObject<SVGLineElement>[] = [];
    const textRefs:React.RefObject<SVGTextElement>[] = [];
    const rectRefs:React.RefObject<SVGRectElement>[] = [];

    for (let i=0; i<4; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const lineRef = useRef<SVGLineElement>(null);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const textRef = useRef<SVGTextElement>(null);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const rectRef = useRef<SVGRectElement>(null);
        
        lineRefs.push(lineRef);
        textRefs.push(textRef);
        rectRefs.push(rectRef);
    }
    
    useEffect(() => {
        d3.select(gRef.current).on("mousedown", () => {
            for (let i = 0; i < 4; i++) {
                moveLeft(rectRefs[i], lineRefs[i], textRefs[i]);                
            }
        });
    }, []);

    return (
        <div className="tm-tape">
            <svg viewBox='0 0 800 210'>
                <defs><marker id="straight-line" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" />
                </marker></defs>
                <g ref={gRef}>
                    <TapeEntry value='0' x1={25} y1={25} lineRef={lineRefs[0]} rectRef={rectRefs[0]} textRef={textRefs[0]}></TapeEntry>
                    <TapeEntry value='1' x1={75} y1={25} lineRef={lineRefs[1]} rectRef={rectRefs[1]} textRef={textRefs[1]}></TapeEntry>
                    <TapeEntry value='0' x1={125} y1={25} lineRef={lineRefs[2]} rectRef={rectRefs[2]} textRef={textRefs[2]}></TapeEntry>
                    <TapeEntry value='1' x1={175} y1={25} lineRef={lineRefs[3]} rectRef={rectRefs[3]} textRef={textRefs[3]}></TapeEntry>
                </g>
                <line stroke='black' strokeWidth={1} markerEnd="url(#straight-line)" x1={100} y1={100} x2={100} y2={80}></line>
            </svg>
        </div>
    );
}

export default TMTape;