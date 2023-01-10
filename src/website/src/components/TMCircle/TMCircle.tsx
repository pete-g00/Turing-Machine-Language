import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './TMCircle.css';
import { generatePath } from '../TMArrow/TMArrow';

export interface CircleLine {
    line:React.RefObject<SVGLineElement>|React.RefObject<SVGPathElement>;
    text:React.RefObject<SVGTextElement>;
    fromCircle:React.RefObject<SVGCircleElement>;
    toCircle:React.RefObject<SVGCircleElement>
}

interface CircleProps {
    text: string;
    edgesFrom:CircleLine[];
    edgesTo:CircleLine[];
    circleRef:React.RefObject<SVGCircleElement>;
    textRef:React.RefObject<SVGTextElement>;
    label:string;
    x:number;
    y:number;
    r:number;
}

function getArrowOffset(fromCircleEl:React.RefObject<SVGCircleElement>, toCircleEl:React.RefObject<SVGCircleElement>) {
    const fromCircle = d3.select(fromCircleEl.current);
    const toCircle = d3.select(toCircleEl.current);

    const dx = Number.parseFloat(fromCircle.attr("cx")) - Number.parseFloat(toCircle.attr("cx"));
    const dy = Number.parseFloat(fromCircle.attr("cy")) - Number.parseFloat(toCircle.attr("cy"));
    const theta = Math.atan2(dy, dx);

    return {
        x: Math.cos(theta),
        y: Math.sin(theta)
    };
}

function TMCircle({text, edgesFrom, edgesTo, circleRef, textRef, x, y, r, label}:CircleProps) {
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
                        // line between two circles
                        if (el.line.current instanceof SVGLineElement) {
                            const offset = getArrowOffset(el.fromCircle, el.toCircle);
                            const x1 = event.x - 25*offset.x;
                            const y1 = event.y - 25*offset.y;
                            line.attr("x1", x1);
                            line.attr("y1", y1);
                            
                            const otherCircle = d3.select(el.toCircle.current);
                            const x2 = Number.parseFloat(otherCircle.attr("cx")) + 35*offset.x;
                            const y2 = Number.parseFloat(otherCircle.attr("cy")) + 35*offset.y;
                            line.attr("x2", x2);
                            line.attr("y2", y2);

                            const text = d3.select(el.text.current);
                            const x = (x1 + x2)/2;
                            const y = (y1 + y2)/2;

                            text.attr("x", x);
                            text.attr("y", y - 10);
                        } else {
                            const path = generatePath(event.x, event.y);
                            line.attr("d", path);
                            
                            const text = d3.select(el.text.current);
                            text.attr("x", event.x);
                            text.attr("y", event.y - 70);
                        }
                    });
                    
                    // drag the lines going into the circle
                    edgesTo.forEach((el) => {
                        const line = d3.select(el.line.current);
                        if (el.line.current instanceof SVGLineElement) {
                            const offset = getArrowOffset(el.fromCircle, el.toCircle);
                            const x2 = event.x + 35*offset.x;
                            const y2 = event.y + 35*offset.y;
                            line.attr("x2", x2);
                            line.attr("y2", y2);
    
                            const otherCircle = d3.select(el.fromCircle.current);
                            const x1 = Number.parseFloat(otherCircle.attr("cx")) - 25*offset.x;
                            const y1 = Number.parseFloat(otherCircle.attr("cy")) - 25*offset.y;
                            line.attr("x1", x1);
                            line.attr("y1", y1);
                            
                            const text = d3.select(el.text.current);
                            const x = (x1 + x2)/2;
                            const y = (y1 + y2)/2;

                            text.attr("x", x);
                            text.attr("y", y - 10);
                        }
                    });
                });
                // @ts-ignore
                handleDrag(d3.select(circleRef.current));
        }
    }, []);
    return (
        <g>
            <circle ref={circleRef} id={label} stroke='black' strokeWidth={1} cx={x} cy={y} r={r}></circle>
            <text ref={textRef} x={x} y={y} dominantBaseline="middle" textAnchor="middle">{text}</text>
        </g>
    );
}

export default TMCircle;