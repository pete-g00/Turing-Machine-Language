import { BasicBlockContext, BlockContext, CoreBasicBlockContext, Direction, GoToContext, IfCaseContext, ProgramContext, SwitchBlockContext, TerminationContext, TerminationState, WhileCaseContext } from "./Context";
import { TapeExecutor } from "./TapeExecutor";

export class CodeExecutor extends TapeExecutor {
    private _terminationStatus:TerminationState|undefined;
    private _program:ProgramContext;
    private _currentBlockIndex:number;
    private _currentBlocks:BlockContext[];

    private _changeBlocks(blocks:BlockContext[]):void {
        this._currentBlocks = blocks;
        this._currentBlockIndex = 0;
    }

    public get terminationStatus(): TerminationState | undefined {
        return this._terminationStatus;
    }

    private _validateTapeValue(value:string) {
        for (let i = 0; i < value.length; i++) {
            if (!this._program.alphabet.values.has(value[i])) {
                throw new Error("The tape is not valid for the given TM Program.");
            }
        }
    }

    public constructor(value:string, program:ProgramContext) {
        super(value);
        this._program = program;
        this._validateTapeValue(value);
        
        this._currentBlocks = program.modules[0].blocks;
        this._currentBlockIndex = 0;
    }

    /**
     * The current block being executed.
     * 
     * The value is undefined if the execution has terminated.
     */
    public get currentBlock(): BlockContext | undefined {
        if (this._terminationStatus === undefined) {
            return this._currentBlocks[this._currentBlockIndex];
        } 
        return undefined;
    }

    private _change(block:BasicBlockContext | CoreBasicBlockContext, letter: string): void {
        this.tape.change(block.changeToCommand?.value ?? letter);
        this.tape.move(block.moveCommand?.direction ?? Direction.LEFT);
    }

    public execute(): boolean {
        if (this.terminationStatus !== undefined) {
            return false;
        }
        
        const currentBlock = this.currentBlock;
        const tapehead = this.tape.get(0);
        
        // determine the executing block
        let executionBlock:BasicBlockContext | CoreBasicBlockContext;
        // basic block => it is this
        if (currentBlock instanceof BasicBlockContext) {
            executionBlock = currentBlock;
        }
        // switch block => identify the relevant case and extract the while block/first if block
        else if (currentBlock instanceof SwitchBlockContext) {
            const caseBlock = currentBlock.cases.find((caseBlock) => {
                return caseBlock.values.has(tapehead);
            })!;
            if (caseBlock instanceof WhileCaseContext) {
                executionBlock = caseBlock.block;
            } else if (caseBlock instanceof IfCaseContext) {
                executionBlock = caseBlock.blocks[0] as BasicBlockContext;
                this._changeBlocks(caseBlock.blocks);
            }
        }
        this._change(executionBlock!, tapehead);

        // while remains the same
        // not final block => increment the index
        if (this._currentBlockIndex < this._currentBlocks.length-1) {
            this._currentBlockIndex ++;
        } 
        // basic block => look at the flow command if exists
        else if (executionBlock! instanceof BasicBlockContext) {
            // no flow => reject
            if (!executionBlock.flowCommand) {
                this._terminationStatus = TerminationState.REJECT;
            } 
            const flowCommand = executionBlock.flowCommand;
            // goto statement => go to that module
            if (flowCommand instanceof GoToContext) {
                const nextModule = this._program.modules.find((module) => {
                    return module.identifier === flowCommand.identifier;
                });
                this._changeBlocks(nextModule!.blocks);
            }
            // flow command => terminate with that status
            else if (flowCommand instanceof TerminationContext) {
                this._terminationStatus = flowCommand.state;
            }
        }
        
        return true;
    }    
}