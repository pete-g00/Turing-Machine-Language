import React from 'react';

interface LineProps {
    x1:number;
    x2:number;
    y1:number;
    y2:number;
    text:string;
}

export function generatePath(x:number, y:number) {
    const startX = x - 25/2;
    const endX = x + 25/2;
    const genY = y - 25/2*Math.sqrt(3);
    return `M ${startX} ${genY} C ${startX+5} ${genY-45}, ${endX-5} ${genY-45}, ${endX} ${genY-10}`;
}

function getArrowOffset(x1:number, x2:number, y1:number, y2:number) {
    const dx = x2-x1;
    const dy = y2-y1;
    const theta = Math.atan2(dy, dx);
    const phi = Math.atan2(-dy, -dx);

    return {
        x1: Math.cos(theta),
        y1: Math.sin(theta),
        x2: Math.cos(phi),
        y2: Math.sin(phi),
    };
}

function TMArrow({ x1, x2, y1, y2, text }:LineProps) {    
    if (x1 === x2 && y1 === y2) {
        return (
            <g>
                <path d={generatePath(x1, y1)} stroke="black" fill="transparent" markerEnd="url(#arrow)" />
                <text x={x1} y={y1-70} dominantBaseline="middle" textAnchor="middle">{text}</text>
            </g>
        );
    } else {
        const offset = getArrowOffset(x1, x2, y1, y2);
        const x = (x1 + x2)/2;
        const y = (y1 + y2)/2;
        return (
            <g>
                <line 
                    x1={x1+25*offset.x1} y1={y1+25*offset.y1} x2={x2+35*offset.x2} y2={y2+35*offset.y2} 
                    stroke='black' strokeWidth={1} markerEnd="url(#arrow)"
                />
                <text x={x} y={y-10} dominantBaseline="middle" textAnchor="middle">{text}</text>
            </g>
        );
    }
}

export default TMArrow;