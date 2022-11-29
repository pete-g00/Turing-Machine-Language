import { Direction, TerminationState } from "../Context";
import { TMTape } from "../TMTape";
import { TMExecutor } from "../TMExecutor";
import { CodeParser } from "../CodeParser";
import { CodeConverter } from "../CodeConverter";
import { ConstantTMState, TuringMachine } from "../TuringMachine";

const isDiv2 = `alphabet = {0, 1}
module q {
    switch tapehead {
        while 0, 1 {
            move right
        } if blank {
            move left
            switch tapehead {
                if 1, blank {
                    reject
                } if 0 {
                    accept
                }
            }
        }
    }
}`;

const isDiv2Parser = new CodeParser(isDiv2);
const isDiv2Program = isDiv2Parser.parse();
const codeConverter = new CodeConverter(isDiv2Program);
const isDiv2TM = codeConverter.convert();

test("TMExecutor initialises the tape as expected", () => {
    const executor = new TMExecutor("11", isDiv2TM);
    const tape = new TMTape("11");

    expect(executor.currentState).toBe("q0");
    expect(executor.tape).toEqual(tape);
});

test("TMExecutor executes the tape correctly", () => {
    const executor = new TMExecutor("11", isDiv2TM);
    const tape = new TMTape("11");

    for (let i = 0; i < 2; i++) {
        expect(executor.execute()).toBe(true);
    
        expect(executor.currentState).toBe("q0");
        tape.move(Direction.RIGHT);
        expect(executor.tape).toEqual(tape);
    }

    expect(executor.execute()).toBe(true);
    
    expect(executor.currentState).toBe("q1");
    tape.move(Direction.LEFT);
    expect(executor.tape).toEqual(tape);

    expect(executor.execute()).toBe(true);

    expect(executor.currentState).toBe("reject");
    tape.move(Direction.LEFT);
    expect(executor.tape).toEqual(tape);
});

test("TMExecutor terminates with the correct reject status", () => {
    const executor = new TMExecutor("11", isDiv2TM);

    while (executor.execute()) {
        continue;
    }

    expect(executor.execute()).toBe(false);
    expect(executor.currentState).toBe("reject");
    expect(executor.terminationStatus).toBe(TerminationState.REJECT);
});

test("TMExecutor terminates with the correct accept status", () => {
    const executor = new TMExecutor("10", isDiv2TM);

    while (executor.execute()) {
        continue;
    }

    expect(executor.execute()).toBe(false);
    expect(executor.currentState).toBe("accept");
    expect(executor.terminationStatus).toBe(TerminationState.ACCEPT);
});

const alphabet = new Set(["0", "1"]);
const tm = new TuringMachine();
tm.alphabet = alphabet;

const state = new ConstantTMState("q0", alphabet, {nextState: "q1"});
tm.addState(state);
tm.initialState = "q0";

test("TMExecutor throws an error when the state does not exist", () => {
    const executor = new TMExecutor("10", tm);
    executor.execute();

    expect(() => {
        executor.execute();
    }).toThrow(new Error(`Invalid Turing Machine: the state "q1" does not exist.`));
});

test("TMExecutor throws an error when the tapehead value is not part of the alphabet", () => {
    const executor = new TMExecutor("5", tm);

    expect(() => {
        executor.execute();
    }).toThrow(new Error(`Invalid Turing Machine: there is no transition for "5" in "q0".`));
});