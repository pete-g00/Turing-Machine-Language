import React, { SVGProps, useEffect } from 'react';
import * as d3 from 'd3';
import './TMCircle.css';

interface CircleLine {
    line:React.RefObject<SVGLineElement>;
    offsetX:number;
    offsetY:number;
}

interface CircleProps extends SVGProps<SVGCircleElement> {
    text: string;
    edgesFrom:CircleLine[];
    edgesTo:CircleLine[];
    circleRef:React.RefObject<SVGCircleElement>;
    textRef:React.RefObject<SVGTextElement>;
}

function TMCircle({text, edgesFrom, edgesTo, circleRef, textRef, ...props}:CircleProps) {
    useEffect(() => {
        if (circleRef.current) {
            const handleDrag = d3.drag()
                .subject(function () {
                    const circle = d3.select(this);
                    return {
                        x: circle.attr("cx"), 
                        y: circle.attr("cy"),
                    };
                }).on("drag", function (this, event) {
                    // drag the circle
                    const circle = d3.select(circleRef.current);
                    circle.attr('cx', event.x);
                    circle.attr('cy', event.y);

                    // drag the text
                    const text = d3.select(textRef.current);
                    text.attr('x', event.x);
                    text.attr('y', event.y);

                    // drag the lines going from the circle
                    edgesFrom.forEach((el) => {
                        const line = d3.select(el.line.current);
                        line.attr("x1", event.x + el.offsetX);
                        line.attr("y1", event.y + el.offsetY);
                    });
                    
                    // drag the lines going into the circle
                    edgesTo.forEach((el) => {
                        const line = d3.select(el.line.current);
                        line.attr("x2", event.x + el.offsetX);
                        line.attr("y2", event.y + el.offsetY);
                    });
                });
                // @ts-ignore
                handleDrag(d3.select(circleRef.current));
                // @ts-ignore
                handleDrag(d3.select(textRef.current));
        }
    }, []);
    return (
        <g>
            <circle ref={circleRef} {...props}></circle>
            <text ref={textRef} x={props.cx} y={props.cy} dominantBaseline="middle" textAnchor="middle">{text}</text>
        </g>
    );
}

export default TMCircle;