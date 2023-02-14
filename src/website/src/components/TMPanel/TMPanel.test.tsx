import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TMPanel from './TMPanel';
import examples from '../examples.json';
import { CodeConverter, CodeParser } from 'parser-tml';

const isDiv2Code = examples.isDiv2;
const parser = new CodeParser(isDiv2Code);
const isDiv2Program = parser.parse();
const codeConverter = new CodeConverter(isDiv2Program);
const isDiv2TM = codeConverter.convert();

const currentState = 'isDiv20';
const currentEdge: string|undefined = 'isDiv20-isDiv21-0-_';
const transitionTime = 1000;

test("TMPanel initially shows the dialog box", () => {
    render(<TMPanel isTapeExecuting={false} currentState={currentState} currentEdge={currentEdge} 
        transitionTime={transitionTime} turingMachine={isDiv2TM}/>);
    expect(() => {
        screen.getByText("Convert to FSM");
        screen.getByText("Show TM Definition");
    }).not.toThrow();
    expect(() => {
        screen.getByText("The transition function");
    }).toThrow();
    expect(() => {
        screen.getByText("FSM representation of the TM program");
    }).toThrow();
});

test("When the 'show FSM' button is clicked, the FSM screen is shown", () => {
    render(<TMPanel isTapeExecuting={false} currentState={currentState} currentEdge={currentEdge} 
        transitionTime={transitionTime} turingMachine={isDiv2TM}/>);
    const fsmButton = screen.getByText("Convert to FSM");
    fireEvent.click(fsmButton); 
    expect(() => {
        screen.getByText("FSM representation of the TM program");
    }).not.toThrow();
});

test("When the 'show def' button is clicked, the def screen is shown", () => {
    render(<TMPanel isTapeExecuting={false} currentState={currentState} currentEdge={currentEdge} 
        transitionTime={transitionTime} turingMachine={isDiv2TM}/>);
    const defButton = screen.getByText("Show TM Definition");
    fireEvent.click(defButton);
    expect(() => {
        screen.getByText("Definition of the TM program");
    }).not.toThrow();
});

test("If the TM program isn't valid, the buttons to convert TM are disabled", () => {
    render(<TMPanel isTapeExecuting={false} currentState={currentState} currentEdge={currentEdge} 
        transitionTime={transitionTime} turingMachine={undefined}/>);
    const fsmButton = screen.getByText("Convert to FSM");
    expect(fsmButton).toBeDisabled();
});
