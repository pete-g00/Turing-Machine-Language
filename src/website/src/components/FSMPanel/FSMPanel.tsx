import React, { useEffect, useRef } from 'react';
import { Graphviz } from "@hpcc-js/wasm";
import { TuringMachine } from 'parser-tml';
import { Box } from '@mui/material';

interface FSMPanelProps {
    turingMachine: TuringMachine;
}

function convertToDot(tm:TuringMachine): string {
    const values:string[] = [];
    values.push(`digraph {
    size="7,1.8"
    ratio=compress
    bgcolor="#E6E6E6"
    fontname="Helvetica"
    node [fontname="Helvetica"]
    edge [fontname="Helvetica"]
    rankdir=LR;
    node [shape = doublecircle, id = "${tm.initialState}"]; q0;
    node [shape = circle, style = filled, fillcolor = green, id = accept]; A;
    node [fillcolor = red, id = reject]; R;
    node [style = "", shape = circle];
`);
    const stateToLabel:{[key:string]:string} = {
        "accept": "A",
        "reject": "R"
    };
    tm.states.forEach((_state, i) => {
        const label = "q" + i;
        stateToLabel[_state] = label;
    });
    tm.states.forEach((_state) => {
        const state = tm.getState(_state)!;
        state.transitions.forEach((transition) => {
            values.push(`\t${stateToLabel[transition.currentState]} -> ${stateToLabel[transition.nextState]} [label = "${transition.label}"];\n`);
        });
    });
    values.push("}");
    return values.join("");
}

function FSMPanel({ turingMachine }: FSMPanelProps) {
    const divElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Graphviz.load().then((graphviz) => {
            const dot = convertToDot(turingMachine);
            const svg = graphviz.dot(dot);
            if (divElement.current) {
                divElement.current.innerHTML = svg;
            }
        });
    }, [turingMachine]);
    return (
        <Box textAlign="center">
            <p>FSM representation of the TM program:</p>
            <div className='tm-FSMPanel' ref={divElement}></div>
        </Box>
    );
}

export default FSMPanel;