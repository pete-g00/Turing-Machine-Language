import React, { useRef } from 'react';
import './TMPanel.css';
import TMCircle from '../TMCircle/TMCircle';
import TMArrow from '../TMArrow/TMArrow';

function TMPanel() {
    const circle0 = useRef<SVGCircleElement>(null);
    const circle1 = useRef<SVGCircleElement>(null);
    const circle2 = useRef<SVGCircleElement>(null);
    const circle3 = useRef<SVGCircleElement>(null);

    const circleText0 = useRef<SVGTextElement>(null);
    const circleText1 = useRef<SVGTextElement>(null);
    const circleText2 = useRef<SVGTextElement>(null);
    const circleText3 = useRef<SVGTextElement>(null);

    const line0 = useRef<SVGPathElement>(null);
    const line1 = useRef<SVGLineElement>(null);
    const line2 = useRef<SVGLineElement>(null);
    const line3 = useRef<SVGLineElement>(null);


    const lineText0 = useRef<SVGTextElement>(null);
    const lineText1 = useRef<SVGTextElement>(null);
    const lineText2 = useRef<SVGTextElement>(null);
    const lineText3 = useRef<SVGTextElement>(null);

    const line0Data = {
        line: line0,
        fromCircle: circle0,
        toCircle: circle0,
        text: lineText0
    };
    const line1Data = {
        line: line1,
        fromCircle: circle0,
        toCircle: circle1,
        text: lineText1
    };
    const line2Data = {
        line: line2,
        fromCircle: circle1,
        toCircle: circle2,
        text: lineText2
    };
    const line3Data = {
        line: line3,
        fromCircle: circle1,
        toCircle: circle3,
        text: lineText3
    };

    const edgesFrom = {
        circle0: [line0Data, line1Data],
        circle1: [line2Data, line3Data],
        circle2: [],
        circle3: []
    };
    
    const edgesTo = {
        circle0: [line0Data],
        circle1: [line1Data],
        circle2: [line2Data],
        circle3: [line3Data]
    };
    
    return (
        <div className='tm-panel'>
            <svg viewBox='0 0 800 420'>
                <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" />
                </marker></defs>
                <TMCircle edgesFrom={edgesFrom.circle0} edgesTo={edgesTo.circle0} text='q0' textRef={circleText0} x={100} y={150} r={25} circleRef={circle0}></TMCircle>
                <TMCircle edgesFrom={edgesFrom.circle1} edgesTo={edgesTo.circle1} text='q1' textRef={circleText1} x={250} y={150} r={25} circleRef={circle1}></TMCircle>
                <TMCircle edgesFrom={edgesFrom.circle2} edgesTo={edgesTo.circle2} text='A' textRef={circleText2} x={400} y={150} r={25} circleRef={circle2} accept ></TMCircle>
                <TMCircle edgesFrom={edgesFrom.circle3} edgesTo={edgesTo.circle3} text='R' textRef={circleText3} x={550} y={150} r={25} circleRef={circle3} reject></TMCircle>
                <TMArrow lineRef={line0} x1={100} y1={150} x2={100} y2={150} text='1|2, R' textRef={lineText0}></TMArrow>
                <TMArrow lineRef={line1} x1={100} y1={150} x2={250} y2={150} text='#, L' textRef={lineText1}></TMArrow>
                <TMArrow lineRef={line2} x1={250} y1={150} x2={400} y2={150} text='0, L' textRef={lineText2}></TMArrow>
                <TMArrow lineRef={line3} x1={250} y1={150} x2={550} y2={150} text='1, L' textRef={lineText3}></TMArrow>
            </svg>
        </div>
    );
}

export default TMPanel;