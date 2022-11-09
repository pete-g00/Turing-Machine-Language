import { Direction } from "./Context";

export interface TMChange {
    /**
     * The letter we change the current value into. 
     * 
     * If the letter is not given, then the current value remains the same
     */
     letter:string;

     /**
      * The direction the tape should move
      */
     direction:Direction;
 
     /**
      * The label of the next TM state
      */
     nextState:string; 
}

export class TMChanger {
    /**
     * The letter we change the current value into. 
     * 
     * If the letter is not given, then the current value remains the same
     */
    private _letter?:string;

    /**
     * The direction the tape should move
     */
    private _direction?:Direction;

    /**
     * The label of the next TM state
     */
    private _nextState:string;

    public constructor(nextState:string, letter?:string, direction?:Direction) {
        this._nextState = nextState;
        this._letter = letter;
        this._direction = direction;
    }

    public apply(letter:string) : TMChange {
        return {
            letter: this._letter ?? letter,
            direction: this._direction ?? Direction.LEFT,
            nextState: this._nextState
        };
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
    private _changer:TMChanger;
    private _alphabet:Set<string>;

    public constructor(label:string, alphabet:Set<string>, changer:TMChanger) {
        super(label);
        this._changer = changer;
        this._alphabet = alphabet;
    }

    public get alphabet(): Set<string> {
        return this._alphabet;
    }

    public transition(letter: string): TMChange | undefined {
        return this.alphabet.has(letter) || letter === "" ? 
            this._changer.apply(letter) :
            undefined;
    }
}

export class VariableTMState extends TMState {
    private _transitionMap:Map<string, TMChanger>;

    /**
     * Constructs a `TMState` given the transition map corresponding to the state.
     * 
     * @param transitionMap the transition map for a state
     * @param label the label for the state
     */
    public constructor(label:string, transitionMap:Map<string, TMChanger>) {
        super(label);
        this._transitionMap = transitionMap;
    }

    public get alphabet(): Set<string> {
        return new Set(this._transitionMap.keys());
    }

    public transition(letter:string) :TMChange|undefined {
        const changer = this._transitionMap.get(letter);
        if (changer) {
            return changer.apply(letter);
        } else {
            return undefined;
        }
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