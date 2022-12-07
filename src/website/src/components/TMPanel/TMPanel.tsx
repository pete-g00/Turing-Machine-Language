import React, { useRef } from 'react';
import './TMPanel.css';
import TMCircle from '../TMCircle/TMCircle';
import TMLine from '../TMLine/TMLine';

function TMPanel() {
    const circle0 = useRef<SVGCircleElement>(null);
    const circle1 = useRef<SVGCircleElement>(null);
    const circle2 = useRef<SVGCircleElement>(null);
    const circle3 = useRef<SVGCircleElement>(null);

    const text0 = useRef<SVGTextElement>(null);
    const text1 = useRef<SVGTextElement>(null);
    const text2 = useRef<SVGTextElement>(null);
    const text3 = useRef<SVGTextElement>(null);
    
    const line1 = useRef<SVGLineElement>(null);
    const line2 = useRef<SVGLineElement>(null);
    const line3 = useRef<SVGLineElement>(null);
    
    const edgesFrom = {
        circle0: [{
            line: line1,
            offsetX: 25,
            offsetY: 0
        }],
        circle1: [{
            line: line2,
            offsetX: 25,
            offsetY: 0
        }, {
            line: line3,
            offsetX: 25,
            offsetY: 0
        }],
        circle2: [],
        circle3: []
    };
    
    const edgesTo = {
        circle0: [],
        circle1: [{
            line: line1,
            offsetX: -30,
            offsetY: 0
        }],
        circle2: [{
            line: line2,
            offsetX: -30,
            offsetY: 0
        }],
        circle3: [{
            line: line3,
            offsetX: -30,
            offsetY: 0
        }]
    };
    
    return (
        <div className='tm-panel'>
            <svg viewBox='0 0 800 420'>
                <defs><marker id="straight-line" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" />
                </marker></defs>
                <TMCircle 
                    circleRef={circle0} edgesFrom={edgesFrom.circle0} edgesTo={edgesTo.circle0} text='q0' 
                    textRef={text0} cx={50} cy={75} r={25} fill='white' stroke='black' strokeWidth={1}
                ></TMCircle>
                <TMCircle 
                    circleRef={circle1} edgesFrom={edgesFrom.circle1} edgesTo={edgesTo.circle1} text='q1' 
                    textRef={text1} cx={150} cy={75} r={25} fill='white' stroke='black' strokeWidth={1}
                ></TMCircle>
                <TMCircle 
                    circleRef={circle2} edgesFrom={edgesFrom.circle2} edgesTo={edgesTo.circle2} text='q2' 
                    textRef={text2} cx={250} cy={75} r={25} fill='white' stroke='black' strokeWidth={1}
                ></TMCircle>
                <TMCircle 
                    circleRef={circle3} edgesFrom={edgesFrom.circle3} edgesTo={edgesTo.circle3} text='q3' 
                    textRef={text3} cx={350} cy={75} r={25} fill='white' stroke='black' strokeWidth={1}
                ></TMCircle>
                <TMLine 
                    offsetX1={25} offsetY1={0} offsetX2={-30} offsetY2={0} lineRef={line1} stroke='black' strokeWidth={1}
                    markerEnd="url(#straight-line)" fromRef={circle0} toRef={circle1} x1={50} y1={75} x2={150} y2={75}
                ></TMLine>
                <TMLine 
                    offsetX1={25} offsetY1={0} offsetX2={-30} offsetY2={0} lineRef={line2}  stroke='black' strokeWidth={1}
                    markerEnd="url(#straight-line)" fromRef={circle1} toRef={circle2} x1={150} y1={75} x2={250} y2={75}
                ></TMLine>
                <TMLine 
                    offsetX1={25} offsetY1={0} offsetX2={-30} offsetY2={0} lineRef={line3} stroke='black' strokeWidth={1}
                    markerEnd="url(#straight-line)" fromRef={circle1} toRef={circle3} x1={150} y1={75} x2={350} y2={75}
                ></TMLine>
            </svg>
        </div>
    );
}

export default TMPanel;