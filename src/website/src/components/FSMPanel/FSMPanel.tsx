import React, { useEffect, useState } from 'react';
import TMCircle from '../TMCircle/TMCircle';
import TMArrow from '../TMArrow/TMArrow';
import { TransitionData, TuringMachine } from 'parser-tml';

function generateStateAndCoords(turingMachine:TuringMachine|undefined) {
    let states:string[] = [];
    const coords:{x:number, y:number}[] = [];

    if (turingMachine) {
        states = [...turingMachine.states, "accept", "reject"];
        for (let i = 0; i < turingMachine.states.length+2; i++) {
            coords[i] = {
                x: 50+150*i, 
                y: 100
            };
        }
    }

    return {states, coords};
}

interface FSMPanelProps {
    turingMachine:TuringMachine;
}

function FSMPanel({ turingMachine }:FSMPanelProps) {
      
    // the states within the TM
    const [states, setStates] = useState<string[]>([]);

    // the coords within the TM
    const [coords, setCoords] = useState<{x:number, y:number}[]>([]);

    // the transitions within the TM
    const [transitions, setTransitions] = useState<TransitionData[]>([]);

    // the indices of the states within the TM
    const [statesIndex, setStatesIndex] = useState<{[key:string]: number}>({});


    function updateDragCoord(i:number, x:number, y:number) {
        const newCoords = coords.map((value, j) => i === j ? {x, y} : {x: value.x, y: value.y});
        setCoords(newCoords);
    }
    
    useEffect(() => {
        const { coords, states } = generateStateAndCoords(turingMachine);
        const statesIndex:{[key:string]: number} = {};
        const transitions = [];
        if (turingMachine) {
            for (let i = 0; i < states.length; i++) {
                statesIndex[states[i]] = i;
            }
            
            for (let i = 0; i < states.length-2; i++) {
                const tmState = turingMachine.getState(states[i])!;
                for (let j = 0; j < tmState.transitions.length; j++) {
                    transitions.push(tmState.transitions[j]);
                }
            }
        }
        setStates(states);
        setCoords(coords);
        setTransitions(transitions);
        setStatesIndex(statesIndex);
    }, [turingMachine]);

    return (
        <svg viewBox='0 0 1000 300'>
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
                return <TMCircle label={state} updateDragCoord={updateDragCoord} r={25} coords={coords} i={i} key={i} text={circleLabel}/>;
            })}
            {transitions.map((transition, i) => {
                const fromStateIndex = statesIndex[transition.currentState];
                const toStateIndex = statesIndex[transition.nextState];
                return <TMArrow key={i} text={transition.label} 
                    x1={coords[fromStateIndex].x} 
                    x2={coords[toStateIndex].x} 
                    y1={coords[fromStateIndex].y} 
                    y2={coords[toStateIndex].y} 
                />;
            })}
        </svg>
    );
}

export default FSMPanel;