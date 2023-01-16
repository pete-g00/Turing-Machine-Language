import React from 'react';

interface TapeEntryProps {
    value?:string;
    x1:number;
    y1:number;
}

function TapeEntry({value, x1, y1 }:TapeEntryProps) {
    const length = 50;
    value ??= '';

    return <>
        <rect x={x1} y={y1} width={length} height={length} fill='transparent'></rect>
        <line x1={x1+5} y1={y1+40} x2={x1-5+length} y2={y1+40} stroke='black' strokeWidth={2}></line>
        <text x={x1+25} y={y1+30} dominantBaseline="middle" textAnchor="middle">{value}</text>
    </>;
}

export default TapeEntry;