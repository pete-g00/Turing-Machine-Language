import { Direction } from "../Context";
import { ConstantTMState, TerminationTMState, IncompleteTMChange, TuringMachine, VariableTMState } from "../TuringMachine";

const alphabet = new Set(["a", "b"]);
const alphabetWithBlank = new Set(["a", "b", ""]);
const acceptState = TerminationTMState.ACCEPT(alphabet);

test("TerminationTMState accept returns the alphabet given", () => {
    expect(acceptState.alphabet).toEqual(alphabet);
});

test("TMState cannot transition for the terminating state accept", () => {
    expect(() => {
        acceptState.transition("a");
    }).toThrowError(new Error("Cannot transition from a termination state."));
});

test("TMState cannot get transitions for the terminating state accept", () => {
    expect(() => {
        acceptState.transitions;
    }).toThrowError(new Error("Cannot transition from a termination state."));
});

test("ConstantTMState returns the alphabet given", () => {
    const change:IncompleteTMChange = {
        nextState: "q1",
        direction: Direction.LEFT
    };
    const state = new ConstantTMState("q0", alphabet, change);
    expect(state.alphabet).toEqual(alphabet);
});

test("ConstantTMState returns the original letter in the TMChange when the change value isn't given", () => {
    const change:IncompleteTMChange = {
        nextState: "q1"
    };
    const state = new ConstantTMState("q0", alphabet, change);
    const transitionChange = state.transition("a");
    expect(transitionChange).toEqual({
        nextState: "q1",
        direction: Direction.LEFT,
        letter: "a"
    });
});

test("ConstantTMState returns undefined for a letter not present in the alphabet", () => {
    const change:IncompleteTMChange = {
        nextState: "q1"
    };
    const state = new ConstantTMState("q0", alphabet, change);
    expect(state.transition("x")).toBeUndefined();
});

test("ConstantTMState is defined for blank even though it is not present in the alphabet", () => {
    const change:IncompleteTMChange = {
        nextState: "q1"
    };
    const state = new ConstantTMState("q0", alphabet, change);
    expect(state.transition("")).toBeDefined();
});

test("ConstantTMState returns the provided letter in the TMChange when the change value is given", () => {    
    const change:IncompleteTMChange = {
        nextState: "q1",
        letter: "",
        direction: Direction.LEFT
    };
    const state = new ConstantTMState("q0", alphabet, change);
    expect(state.transition("a")).toEqual({
        nextState: "q1",
        direction: Direction.LEFT,
        letter: ""
    });
});

test("ConstantTMState returns the correct state transitions.", () => {
    const change:IncompleteTMChange = {
        nextState: "q1"
    };
    const state = new ConstantTMState("q0", alphabet, change);
    expect(state.transitions.length).toBe(1);
    const transition = state.transitions[0];
    
    expect(transition.currentState).toBe('q0');
    expect(transition.nextState).toBe('q1');
    expect(transition.letters).toEqual(['a', 'b', '']);
    expect(transition.label).toBe("a|b|#, L");
});

const variableState = new VariableTMState("q0");
variableState.addTransition("a", {nextState: "q1"});
variableState.addTransition("b", {
    nextState: "q1",
    direction: Direction.RIGHT
});
variableState.addTransition("", {
    nextState: "q2",
    letter: "b"
});

test("VariableTMState returns the expected transition value, for a letter in the alphabet", () => {
    expect(variableState.transition("a")).toEqual({
        nextState: "q1",
        direction: Direction.LEFT,
        letter: "a"
    });
    expect(variableState.transition("b")).toEqual({
        nextState: "q1",
        direction: Direction.RIGHT,
        letter: "b"
    });
    expect(variableState.transition("")).toEqual({
        nextState: "q2",
        direction: Direction.LEFT,
        letter: "b"
    });
});

test("VariableTMState returns the expected alphabet", () => {
    expect(variableState.alphabet).toEqual(alphabetWithBlank);
});

test("VariableTMState returns undefined as the transition value for a letter not present in the alphabet", () => {
    expect(variableState.transition("x")).toBeUndefined();
});

test("VariableTMState returns the correct state transitions.", () => {
    expect(variableState.transitions.length).toBe(3);
    const transition = variableState.transitions[2];

    expect(transition.currentState).toBe('q0');
    expect(transition.nextState).toBe('q2');
    expect(transition.letters).toEqual(['']);
    expect(transition.label).toBe("#→b, L");
});

const q0 = new ConstantTMState("q0", alphabet, {nextState: "q1"});
const q1 = new ConstantTMState("q1", alphabet, {nextState: "accept"});
const q2 = new ConstantTMState("q2", alphabet, {nextState: "q0"});

const turingMachine = new TuringMachine();
turingMachine.alphabet = alphabet;
turingMachine.addState(q0);
turingMachine.initialState = "q0";
turingMachine.addState(q1);
turingMachine.addState(q2);

test("TuringMachine.alphabet returns the given alphabet", () => {
    expect(turingMachine.alphabet).toEqual(alphabet);
});

test("TuringMachine can return a state that exists", () => {
    const state = turingMachine.getState("q0");
    expect(state).toBe(q0);
});

test("TuringMachine returns undefined for a state that doesn't exist", () => {
    const state = turingMachine.getState("q3");
    expect(state).toBeUndefined();
});

test("TuringMachine can return all the states present", () => {
    expect(turingMachine.states).toEqual(["q0", "q1", "q2"]);
});

test("TuringMachine returns the accept state as expected", () => {
    const state = turingMachine.getState("accept");
    const accept = TerminationTMState.ACCEPT(alphabet);
    expect(state).toEqual(accept);
});

test("TuringMachine returns the reject state as expected", () => {
    const state = turingMachine.getState("reject");
    const reject = TerminationTMState.REJECT(alphabet);
    expect(state).toEqual(reject);
});

test("TuringMachine returns the given initial state", () => {
    expect(turingMachine.initialState).toBe("q0");
});