import React from 'react';

interface TapeEntryProps {
    value?:string;
    x1:number;
    y1:number;
    length?:number;
    lineRef:React.RefObject<SVGLineElement>;
    rectRef:React.RefObject<SVGRectElement>;
    textRef:React.RefObject<SVGTextElement>;
}

function TapeEntry({value, x1, y1, length, rectRef, lineRef, textRef }:TapeEntryProps) {
    length ??= 50;
    value ??= '';

    return (
        <g>
            <rect ref={rectRef} x={x1} y={y1} width={length} height={length} fill='transparent'></rect>
            <line ref={lineRef} x1={x1+5} y1={y1+40} x2={x1-5+length} y2={y1+40} stroke='black' strokeWidth={2}></line>
            <text ref={textRef} x={x1+25} y={y1+30} dominantBaseline="middle" textAnchor="middle">{value}</text>
        </g>
    );
}

export default TapeEntry;