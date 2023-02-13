import React, { useEffect, useRef } from 'react';
import { Graphviz } from "@hpcc-js/wasm";
import { TuringMachine } from 'parser-tml';
import { Box } from '@mui/material';
import * as d3 from 'd3';

interface FSMPanelProps {
    turingMachine: TuringMachine;
    currentState: string|undefined;
    currentEdge: string|undefined;
    transitionTime: number;
}

function convertToDot(tm:TuringMachine): string {
    const values:string[] = [];
    values.push(`digraph {
    size="7,3"
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
        values.push(`\tnode [id = "${_state}"]; ${label}\n`);
    });
    tm.states.forEach((_state) => {
        const state = tm.getState(_state)!;
        state.transitions.forEach((transition) => {
            const letters = transition.letters.map((val) => val.length === 0 ? "_" : val).join("-");
            const transitionLabel = `${transition.currentState}-${transition.nextState}-${letters}`;
            values.push(`\t${stateToLabel[transition.currentState]} -> ${stateToLabel[transition.nextState]} [label = "${transition.label}", id = "${transitionLabel}"];\n`);
        });
    });
    values.push("}");
    return values.join("");
}

function FSMPanel({ turingMachine, currentEdge, currentState, transitionTime }: FSMPanelProps) {
    const divElement = useRef<HTMLDivElement>(null);

    function changeCurrentState(currentState:string|undefined) {
        if (currentState) {
            const node = d3.select(`g#${currentState}`).selectAll("ellipse");
            node.attr("stroke", "blue");
            node.attr("stroke-width", "2");
        }
    }

    function changeCurrentEdge(currentEdge:string|undefined) {
        if (currentEdge) {
            const arrow = d3.select(`g#${currentEdge}`).select("path");
            console.log(arrow);
            arrow.transition()
                .duration(transitionTime*3/4)
                .attr("stroke", "blue")
                .attr("stroke-width", "3")
                .transition()
                .duration(transitionTime/4)
                .attr("stroke", "black")
                .attr("stroke-width", "1");
        }
    }

    useEffect(() => {
        changeCurrentState(currentState);

        return (() => {
            if (currentState) {
                const node = d3.select(`g#${currentState}`).selectAll("ellipse");
                node.attr("stroke", "black");
                node.attr("stroke-width", "1");
            }
        });
    }, [currentState]);

    useEffect(() => {
        changeCurrentEdge(currentEdge);
    }, [currentEdge]);

    useEffect(() => {
        Graphviz.load().then((graphviz) => {
            const dot = convertToDot(turingMachine);
            const svg = graphviz.dot(dot);
            if (divElement.current) {
                divElement.current.innerHTML = svg;
                changeCurrentState(currentState);
                changeCurrentEdge(currentEdge);
            }
        });
    }, [turingMachine]);

    return (
        <Box textAlign="center">
            <h3>FSM representation of the TM program</h3>
            <div className='tm-FSMPanel' ref={divElement}></div>
        </Box>
    );
}

export default FSMPanel;