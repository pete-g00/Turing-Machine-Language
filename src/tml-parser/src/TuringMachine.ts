import { Direction } from "./Context";

/**
 * The interface `IncompleteTMChange` represents a TM change for some fixed tapehead value and TM state.
 * 
 * It contains the letter to change the tapehead value to, the direction that the tape moves in, and the next TM state.
 * 
 * Only the next TM state needs to be provided; other values can be missing, in which case it will be filled in with default values:
 * 
 * - if letter to change is missing, then it stays the same as the tapehead value.
 * - if the direction is missing, then it moves to the left.
 */
export interface IncompleteTMChange {
    /**
     * The letter we change the current value into. 
     * 
     * If the letter is not given, then the current value remains the same
     */
    letter?:string;

    /**
     * The direction the tape should move
     */
    direction?:Direction;

    /**
     * The label of the next TM state
     */
    nextState:string;    
}

export interface TransitionData {
    /**
     * The letters involved in the transition.
     */
    letters:string[];
    
    /**
     * The label for this transition.
     */
    label:string;

    /**
     * The next state label for this transition.
     */
    nextState:string;
    
    /**
     * The current state label for this transition.
     */
    currentState:string;
}

/**
 * 
 * Completes an incomplete TM change to a complete TM change by filling in the defaults.
 * 
 * @param change the change to complete
 * @param letter the letter to transition through
 * @returns the completed version of the incomplete TM change
 */
function completeChange(change:IncompleteTMChange, letter:string):TMChange {
    return {
        letter: change.letter ?? letter,
        direction: change.direction ?? Direction.LEFT,
        nextState: change.nextState
    };
}

/**
 * The interface `TMChange` represents a (complete) TM change for some fixed tapehead value and TM state.
 * 
 * It contains the letter to change the tapehead value to, the direction that the tape moves in, and the next TM state.
 */
export interface TMChange extends IncompleteTMChange {
    letter:string;

    direction:Direction;
 
    nextState:string; 
}

function generateLabel(change:IncompleteTMChange, letters:string[]) {
    const source = letters.map((letter) => letter || "#").join("|");
    const dir = change.direction ?? Direction.LEFT;
    if (change.letter !== undefined) {
        return source + "→" + (change.letter || "#") + ", "+ dir;
    } else {
        return source + ", " + dir;
    }
}

/**
 * The class `TMState` represents a Turing machine state.
 * 
 */
export abstract class TMState {
    /**
     * The label given to the Turing machine state
     */
    public readonly label:string;

    /**
     * The alphabet associated with the Turing machine that the state belongs to
     * 
     * The returned set may or may not include the blank value.
     */
    public abstract get alphabet():Set<string>;

    public constructor(label:string) {
        this.label = label;
    }
    
    /**
     * Returns the Turing machine state corresponding to the given letter for this state
     * 
     * @param letter the letter for which to transition
     * @throws an error if the current state is a termination state
     * @returns the corresponding Turing machine state label for the letter, with respect to this state; 
     * undefined if the letter doesn't belong to the alphabet
     */
    public abstract transition(letter:string):TMChange|undefined;

    /**
     * Returns all the transitions present in the TM state.
     */
    public abstract get transitions():TransitionData[];
}

export class TerminationTMState extends TMState {
    private _alphabet:Set<string>;

    private constructor(label:string, alphabet:Set<string>) {
        super(label);
        this._alphabet = alphabet;
    }

    public transition(): TMChange | undefined {
        throw Error("Cannot transition from a termination state.");
    }

    public get transitions(): TransitionData[] {
        throw Error("Cannot transition from a termination state.");
    }

    public get alphabet(): Set<string> {
        return this._alphabet;
    }

    public static ACCEPT(alphabet:Set<string>):TMState {
        return new TerminationTMState("accept", alphabet);
    }

    public static REJECT(alphabet:Set<string>):TMState {
        return new TerminationTMState("reject", alphabet);
    }
}

export class ConstantTMState extends TMState {
    private _change:IncompleteTMChange;
    private _alphabet:Set<string>;

    public constructor(label:string, alphabet:Set<string>, change:IncompleteTMChange) {
        super(label);
        this._change = change;
        this._alphabet = alphabet;
    }

    public get alphabet(): Set<string> {
        return this._alphabet;
    }

    public transition(letter: string): TMChange | undefined {
        return this.alphabet.has(letter) || letter === "" ? 
            completeChange(this._change, letter) :
            undefined;
    }

    public get transitions(): TransitionData[] {
        const letters = [...Array.from(this._alphabet), ""];
        return [{
            letters,
            label: generateLabel(this._change, letters),
            nextState: this._change.nextState,
            currentState: this.label,
        }];
    }
}

export class VariableTMState extends TMState {
    private _transitionIndexMap:Map<string, number>;
    private _changes:IncompleteTMChange[];

    /**
     * Constructs a `TMState` given the transition map corresponding to the state.
     * 
     * @param label the label for the state
     */
    public constructor(label:string) {
        super(label);
        this._transitionIndexMap = new Map<string, number>();
        this._changes = [];
    }

    public addTransition(letter:string, change:IncompleteTMChange) {
        const i = this._changes.indexOf(change);
        if (i === -1) {
            this._transitionIndexMap.set(letter, this._changes.length);
            this._changes.push(change);
        } else {
            this._transitionIndexMap.set(letter, i);
        }
    }

    public get alphabet(): Set<string> {
        return new Set(this._transitionIndexMap.keys());
    }

    public transition(letter:string) :TMChange|undefined {
        const i = this._transitionIndexMap.get(letter);
        if (i !== undefined) {
            const change = this._changes[i];
            return completeChange(change, letter);
        } else {
            return undefined;
        }
    }

    public get transitions(): TransitionData[] {
        const labels:TransitionData[] = [];
        for (let i = 0; i < this._changes.length; i++) {
            const letters:string[] = [];
            this._transitionIndexMap.forEach((value, key) => {
                if (value === i) {
                    letters.push(key);
                }
            });
            const label = generateLabel(this._changes[i], letters);
            labels.push({
                label,
                letters,
                nextState: this._changes[i].nextState,
                currentState: this.label
            });
        }

        return labels;
    }
}

/**
 * The class `TuringMachine` represents a Turing machine.
 * 
 * It stores the states within the TM, the initial state and the alphabet.
 */
export class TuringMachine {
    /**
     * The states within the Turing machine, including the initial state
     */
    private _states:Map<string, TMState>;

    private _initialState?:string;

    /**
     * The label of the initial state in the TM
     */
    public get initialState(): string {
        return this._initialState!;
    }
    
    /**
     * The label of the initial state in the TM
     */
    public set initialState(state:string) {
        this._initialState = state;
    }

    private _alphabet?:Set<string>;

    /**
     * The alphabet for the Turing machine
     */
    public get alphabet(): Set<string> {
        return this._alphabet!;
    }

    /**
     * The alphabet for the Turing machine
     */
    public set alphabet(alphabet:Set<string>) {
        this._alphabet = alphabet;
    }

    /**
     * Constructs an empty `TuringMachine`.
     */
    public constructor() {
        this._states = new Map<string, TMState>();
    }

    /**
     * Adds the given state to the TM
     * 
     * @param state the state to add to the TM
     */
    public addState(state:TMState) :void {
        this._states.set(state.label, state);
    }

    public getState(label:string) : TMState|undefined {
        switch (label) {
            case "accept":
                return TerminationTMState.ACCEPT(this.alphabet);
            case "reject":
                return TerminationTMState.REJECT(this.alphabet);
            default:
                return this._states.get(label);
        }
    }

    public get states(): string[] {
        return Array.from(this._states.keys());
    }
}