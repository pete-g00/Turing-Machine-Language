import React, { useRef } from 'react';
import './TMPanel.css';
import TMCircle, { CircleLine } from '../TMCircle/TMCircle';
import TMArrow from '../TMArrow/TMArrow';
import { TransitionData, TuringMachine } from 'parser-tml';

interface TMPanelProps {
    turingMachine:TuringMachine|undefined;
}

function TMPanel({turingMachine}:TMPanelProps) {
    if (turingMachine) {
        const states = [...turingMachine.states, "accept", "reject"];
        const statesIndex:{[key:string]:number} = {};
        for (let i = 0; i < states.length; i++) {
            statesIndex[states[i]] = i;
        }

        const circleRefs:React.RefObject<SVGCircleElement>[] = [];
        const circleTextRefs:React.RefObject<SVGTextElement>[] = [];
        for (let i = 0; i < states.length; i++) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            circleRefs.push(useRef<SVGCircleElement>(null));
            // eslint-disable-next-line react-hooks/rules-of-hooks
            circleTextRefs.push(useRef<SVGTextElement>(null));
        }

        const transitions:TransitionData[] = [];
        const arrowTextRefs:React.RefObject<SVGTextElement>[] = [];
        const arrowRefs:React.RefObject<SVGPathElement | SVGLineElement>[] = [];
        const edgesFromMap:{[key:string]: CircleLine[]} = {};
        const edgesToMap:{[key:string]: CircleLine[]} = {};
        for (let i = 0; i < states.length-2; i++) {
            const tmState = turingMachine.getState(states[i])!;
            for (let j = 0; j < tmState.transitions.length; j++) {
                arrowRefs.push(
                    states[i] === tmState.transitions[j].nextState 
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        ? useRef<SVGPathElement>(null) 
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        : useRef<SVGLineElement>(null)
                );
                // eslint-disable-next-line react-hooks/rules-of-hooks
                arrowTextRefs.push(useRef<SVGTextElement>(null));
                transitions.push(tmState.transitions[j]);

                const fromIndex = statesIndex[tmState.transitions[j].currentState];
                const toIndex = statesIndex[tmState.transitions[j].nextState];
                const circleData = {
                    fromCircle: circleRefs[fromIndex],
                    line: arrowRefs[arrowRefs.length-1],
                    text: arrowTextRefs[arrowTextRefs.length-1],
                    toCircle: circleRefs[toIndex]
                };
                
                const edgesFrom = edgesFromMap[tmState.transitions[j].currentState] ?? [];
                edgesFrom.push(circleData);
                edgesFromMap[tmState.transitions[j].currentState] = edgesFrom;
                
                const edgesTo = edgesToMap[tmState.transitions[j].nextState] ?? [];
                edgesTo.push(circleData);
                edgesToMap[tmState.transitions[j].nextState] = edgesTo;
            }
        }
        
        return (
            <div className='tm-panel'>
                <svg viewBox='0 0 800 420'>
                    <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker></defs>
                    {states.map((state, i) => {
                        let circleLabel:string;
                        switch (state) {
                            case "accept":
                                circleLabel = "A";
                                break;
                            case "reject":
                                circleLabel = "R";
                                break;
                            default:
                                circleLabel = "q"+i;
                                break;
                        }
                        return <TMCircle label={state} circleRef={circleRefs[i]} edgesFrom={edgesFromMap[state] ?? []} edgesTo={edgesToMap[state]} 
                            r={25} text={circleLabel} textRef={circleTextRefs[i]} x={50+150*i} y={150} key={i}/>;
                    })}
                    {transitions.map((transition, i) => {
                        // get index of transition.currentState in states
                        const j = statesIndex[transition.currentState];
                        const x1 = 50 + 150*j;
                        const y1 = 150;

                        // get index of transition.nextState in states
                        const k = statesIndex[transition.nextState];
                        const x2 = 50 + 150*k;
                        const y2 = 150;
                        return <TMArrow key={i} textRef={arrowTextRefs[i]} lineRef={arrowRefs[i]} 
                            text={transition.label} x1={x1} x2={x2} y1={y1} y2={y2}/>;
                    })}
                </svg>
            </div>
        );
    } else {
        return (
            <p>No TM provided!</p>
        );
    }
}

export default TMPanel;