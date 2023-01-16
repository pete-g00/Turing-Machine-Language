import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './TMCircle.css';

interface CircleProps {
    text: string;
    label:string;
    coords:{x:number, y:number}[];
    updateDragCoord: (i:number, x:number, y:number) => void;
    r:number;
    i:number;
}

function TMCircle({ text, coords, updateDragCoord, r, label, i }:CircleProps) {
    const coord = coords[i];
    const circleRef = useRef<SVGCircleElement>(null);
    useEffect(() => {
        if (circleRef.current) {
            const handleDrag = d3.drag()
                // ensures drag is smooth
                .subject(function () {
                    const circle = d3.select(this);
                    return {
                        x: circle.attr("cx"),
                        y: circle.attr("cy")
                    };
                })
                // drags the elements
                .on("drag", function (this, event) {
                    updateDragCoord(i, event.x, event.y);
                });
                // @ts-ignore
                handleDrag(d3.select(circleRef.current));
        }
    });
    return (
        <g>
            <circle ref={circleRef} id={label} stroke='black' strokeWidth={1} cx={coord.x} cy={coord.y} r={r}></circle>
            <text x={coord.x} y={coord.y} dominantBaseline="middle" textAnchor="middle">{text}</text>
        </g>
    );
}

export default TMCircle;