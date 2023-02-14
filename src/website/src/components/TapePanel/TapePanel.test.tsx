import React from 'react';
import { render, screen } from '@testing-library/react';
import TapePanel from './TapePanel';
import examples from '../examples.json';
import { CodeParser, CodeConverter } from 'parser-tml';

const isDiv2Code = examples.isDiv2;
const isDiv2Parser = new CodeParser(isDiv2Code);
const isDiv2Program = isDiv2Parser.parse();
const converter = new CodeConverter(isDiv2Program);
const isDiv2TM = converter.convert();

function emptyFn() {
    return {};
}

const transitionTime = 1000;

test("TapePanel initially shows the input screen", () => {
    render(<TapePanel turingMachine={isDiv2TM} program={isDiv2Program} setCurrentState={emptyFn} transitionTime={transitionTime}
        setExecutingPositions={emptyFn} setIsTapeExecuting={emptyFn} setCurrentEdge={emptyFn} />);
    const btnElement = screen.getByText("Execute");
    expect(btnElement).toBeInTheDocument();
});
