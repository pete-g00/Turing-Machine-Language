import { TerminationState } from "./Context";
import { TMTape } from "./TMTape";
import { TMChange, TuringMachine } from "./TuringMachine";

export class TMExecutor {
    private _currentState:string;
    private _turingMachine:TuringMachine;
    private _terminationStatus:TerminationState | undefined;

    /**
     * The tape being executed.
     * 
     */
    public readonly tape:TMTape;
    
     /**
      * The termination status of the execution.
      * 
      * @returns undefined if the execution has not finished; otherwise, the termination status (accept or reject).
      */
    public get terminationStatus(): TerminationState | undefined {
        return this._terminationStatus;
    }
 
    /**
     * The current state of the Turing machine under execution
     */
    public get currentState(): string {
        return this._currentState;
    }
    
    
    /**
     * Constructs an executor for the given Turing machine and the tape.
     * 
     * @param value the value of the tape
     * @param turingMachine the Turing machine
     */
    public constructor(value:string, turingMachine:TuringMachine) {
        this.tape = new TMTape(value);
        this._turingMachine = turingMachine;
        this._currentState = turingMachine.initialState;
    }

    private _change(change:TMChange): void {
        this.tape.change(change.letter);
        this.tape.move(change.direction);
    }
    
    /**
     * Executes on the tape by one step.
     * 
     * Changes the tape as determined by the current configuration.
     * 
     * @returns false if the execution has terminated; true otherwise.
     */
    public execute():boolean {
        if (this.terminationStatus !== undefined) {
            return false;
        }
        
        const currentState = this._turingMachine.getState(this._currentState);
        if (currentState === undefined) {
            throw new Error(`Invalid Turing Machine: the state "${this._currentState}" does not exist.`);
        } 
        
        const tapehead = this.tape.get(0);
        const change = currentState.transition(tapehead);
        if (change === undefined) {
            throw new Error(`Invalid Turing Machine: there is no transition for "${tapehead}" in "${this._currentState}".`);
        }

        this._change(change);
        this._currentState = change.nextState;
        if (change.nextState === "accept") {
            this._terminationStatus = TerminationState.ACCEPT;
        } else if (change.nextState === "reject") {
            this._terminationStatus = TerminationState.REJECT;
        }
        
        return true;
    }
}