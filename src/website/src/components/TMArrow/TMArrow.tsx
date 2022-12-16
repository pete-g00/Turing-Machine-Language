import React from 'react';

interface LineProps {
    x1:number;
    x2:number;
    y1:number;
    y2:number;
    lineRef:React.RefObject<SVGLineElement>|React.RefObject<SVGPathElement>;
    textRef:React.RefObject<SVGTextElement>;
    text:string;
}

export function generatePath(x:number, y:number) {
    const startX = x - 25/2;
    const endX = x + 25/2;
    const genY = y - 25/2*Math.sqrt(3);
    return `M ${startX} ${genY} C ${startX+5} ${genY-45}, ${endX-5} ${genY-45}, ${endX} ${genY-10}`;
}

function TMArrow({x1, x2, y1, y2, lineRef, textRef, text }:LineProps) {
    if (x1 === x2 && y1 === y2) {
        return (
            <g>
                <path ref={lineRef as React.RefObject<SVGPathElement>} d={generatePath(x1, y1)} stroke="black" fill="transparent" markerEnd="url(#arrow)" />
                <text ref={textRef} x={x1} y={y1-70} dominantBaseline="middle" textAnchor="middle">{text}</text>
            </g>
        );
    } else {
        const x = (x1 + x2)/2;
        const y = (y1 + y2)/2;
        return (
            <g>
                <line ref={lineRef as React.RefObject<SVGLineElement>} x1={x1+25} x2={x2-35} y1={y1} y2={y2} stroke='black' strokeWidth={1} markerEnd="url(#arrow)"/>
                <text ref={textRef} x={x} y={y-10} dominantBaseline="middle" textAnchor="middle">{text}</text>
            </g>
        );
    }
}

export default TMArrow;