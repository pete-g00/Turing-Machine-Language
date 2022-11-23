import { TerminationState } from "./Context";
import { TMTape } from "./TMTape";

/**
 * The abstract class `TapeExecutor` allows a tape to be executed. 
 * 
 * This can either be using an actual Turing Machine (`TMExecutor`), or a Turing Machine program (`CodeExecutor`).
 * 
 * The function `execute` allows the executor to execute a machine/program on the tape, one state/block at a time.
 */
export abstract class TapeExecutor {
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
    public abstract get terminationStatus(): TerminationState | undefined;
 
    public constructor(value:string) {
        this.tape = new TMTape(value);
    }

    /**
     * Executes on the tape by one step.
     * 
     * Changes the tape as determined by the current configuration.
     * 
     * @returns false if the execution has terminated; true otherwise.
     */
    public abstract execute():boolean;
}