import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CodePosition, CodeParser, CodeConverter } from 'parser-tml';
import TapeScreen from './TapeScreen';
import * as examples from '../examples.json';
import { act } from 'react-dom/test-utils';

let showTapeScreen = true;
let currentState:string|undefined = '';
let currentEdge:string|undefined = '';
let executingPositions:CodePosition[] = [];

function goToTapeInput() {
    showTapeScreen = false;
}

function setCurrentState(state:string|undefined) {
    currentState = state;
}

function setCurrentEdge(state:string|undefined) {
    currentEdge = state;
}

function setExecutingPositions(positions:CodePosition[]) {
    executingPositions = positions;
}

const code = examples.isDiv2;
const parser = new CodeParser(code);
const program = parser.parse();
const converter = new CodeConverter(program);
const turingMachine = converter.convert();

test("Clicking the back button takes you to the TapeInput screen", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={0} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const backButton = screen.getByText("Back");
    expect(backButton).toBeEnabled();
    expect(showTapeScreen).toBe(true);
    fireEvent.click(backButton);
    expect(showTapeScreen).toBe(false);
});

test("Initially, the step button isn't disabled", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={0} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    expect(stepButton).toBeEnabled();
});

test("Initially, the current state is the initial state", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    expect(currentState).toBe("isDiv20");
});

test("Initially, the current edge isn't defined", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    expect(currentEdge).toBe("");
});

test("Initially, the code position is empty", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    expect(executingPositions).toHaveLength(0);
});

test("After stepping starts, the back button is initially disabled", () => {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    fireEvent.click(stepButton);
    const backButton = screen.getByText("Back");
    expect(backButton).toBeDisabled();
});

test("After stepping starts, the current edge gets updated", () =>  {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    fireEvent.click(stepButton);
    expect(currentEdge).toBe('isDiv20-isDiv21-_');
});

test("After stepping starts, the current state doesn't get updated", async () =>  {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    fireEvent.click(stepButton);
    expect(currentState).toBe('isDiv20');
});

test("After stepping starts, the position gets updated", async () =>  {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    fireEvent.click(stepButton);
    expect(executingPositions[0]).toStrictEqual(new CodePosition(7, 8, 8, 17));
});

test("After stepping ends, the back button is enabled", async () =>  {
    render(<TapeScreen goToTapeInput={goToTapeInput} setCurrentState={setCurrentState} setCurrentEdge={setCurrentEdge} 
        setExecutingPositions={setExecutingPositions} transitionTime={1000} program={program} tapeValue='' turingMachine={turingMachine}/>);
    const stepButton = screen.getByText("Step");
    fireEvent.click(stepButton);
    await act(async () => {
        await new Promise(res => setTimeout(res, 1200));
    });
    const backButton = screen.getByText("Back");
    expect(backButton).toBeEnabled();
});
