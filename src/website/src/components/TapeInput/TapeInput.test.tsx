import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TapeInput from './TapeInput';

let showingTapeInput = true;
let tape = "";

function goToTapeScreen() {
    showingTapeInput = false;
}

function setTape(newTape:string) {
    tape = newTape;
}

test("TapeInput is disabled if alphabet isn't given", () => {
    render(<MemoryRouter><TapeInput alphabet={undefined} goToTapeScreen={goToTapeScreen} setTape={setTape} tape={tape}/></MemoryRouter>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeDisabled();
});

test("TapeInput is enabled if alphabet is given", () => {
    const alphabet = new Set(["0", "1"]);
    render(<MemoryRouter><TapeInput goToTapeScreen={goToTapeScreen} setTape={setTape} tape={tape} alphabet={alphabet}/></MemoryRouter>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).not.toBeDisabled();
});

test("Filling the input box changes the current tape value", () => {
    const alphabet = new Set(["0", "1"]);
    render(<MemoryRouter><TapeInput goToTapeScreen={goToTapeScreen} setTape={setTape} tape='' alphabet={alphabet}/></MemoryRouter>);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, {
        target: {value: 'abc'}
    });
    expect(tape).toBe('abc');
});

test("TapeInput doesn't accept an invalid tape value", () => {
    const alphabet = new Set(["0", "1"]);
    render(<MemoryRouter><TapeInput goToTapeScreen={goToTapeScreen} setTape={setTape} tape='abc' alphabet={alphabet}/></MemoryRouter>);
    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);
    const errorElement = screen.getByText("Invalid Tape Value");
    expect(errorElement).toBeInTheDocument();
    expect(showingTapeInput).toBe(true);
});

test("TapeInput accepts a valid tape value", () => {
    const alphabet = new Set(["0", "1"]);
    render(<MemoryRouter><TapeInput goToTapeScreen={goToTapeScreen} setTape={setTape} tape='10' alphabet={alphabet}/></MemoryRouter>);
    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);
    expect(() => {
        screen.getByText("Invalid Tape Value");
    }).toThrow();
    expect(showingTapeInput).toBe(false);
});