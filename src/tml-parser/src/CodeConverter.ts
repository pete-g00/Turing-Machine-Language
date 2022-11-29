import { ProgramContext,ModuleContext, BasicBlockContext, CoreBasicBlockContext, SwitchBlockContext, IfCaseContext, WhileCaseContext, GoToContext, TerminationContext } from "./Context";
import { ConstantTMState, TuringMachine, VariableTMState, IncompleteTMChange } from "./TuringMachine";

/**
 * The class `CodeConverter` converts a valid TM program into a valid TM.
 */
export class CodeConverter {
    // the TM being created
    private _turingMachine: TuringMachine;

    // the current module being converted
    private _moduleLabel?:string;

    // the current block index
    private _blockIndex?:number;

    // whether the given block in the module/if block is the last block
    private _isLastBlock?:boolean;

    // the alphabet of the TM
    private _alphabet:Set<string>|undefined;

    // the program
    private _program:ProgramContext;

    /**
     * Creates a `CodeConverter`.
     * 
     * The class `CodeConverter` converts a valid TM program into a valid TM.
     * 
     */
    public constructor(program:ProgramContext) {
        this._program = program;
        this._turingMachine = new TuringMachine();

        this._turingMachine.alphabet = program.alphabet.values;
        this._alphabet = program.alphabet.values;
        
    }
    
    /**
     * 
     * Converts the program into a Turing Machine.
     * 
     * @returns the turing machine
     */
    public convert(): TuringMachine {
        this._program.convert(this);

        return this._turingMachine;
    }

    /**
     * Converts the program into a Turing Machine.
     * 
     * @param program the program
     */
    public convertProgram(program: ProgramContext) {
        this._turingMachine.initialState = program.modules[0].identifier + "0";
        for (const module of program.modules) {
            module.convert(this);
        }
    }
    
    /**
     * Converts a module into states within the Turing Machine.
     * 
     * @param module the module
     */
    public convertModule(module: ModuleContext) {
        this._blockIndex = -1;
        for (let i = 0; i < module.blocks.length; i++) {
            this._moduleLabel = module.identifier;
            this._isLastBlock = i === module.blocks.length-1;
            module.blocks[i].convert(this);
        }
    }

    /**
     * Retrieves the nextState from the goto command
     * 
     * @param command the command
     * @returns the label of the nextState
     */
    public convertGoTo(command: GoToContext): string {
        return command.identifier + "0";
    }

    /**
     * Retrieves the nextState from the termination command
     * 
     * @param command the termination command
     * @returns the label of the nextState
     */
    public convertTermination(command: TerminationContext): string {
        return command.state.toString();
    }

    /**
     * Gets the next label from a core basic block
     * 
     * @param currentLabel the current label 
     * @returns the next label
     */
    public getNextLabelFromCoreBasicBlock(currentLabel:string): string {
        return currentLabel;
    }
    
    /**
     * Gets the next label for a basic block
     * 
     * @param block the basic block
     * @returns the next label
     */
    public getNextLabelFromBasicBlock(_:string, block: BasicBlockContext): string {
        let nextLabel:string;
        if (block.flowCommand) {
            nextLabel = block.flowCommand.convert(this);
        } else if (!this._isLastBlock!) {
            nextLabel = this._moduleLabel! + (this._blockIndex!+1).toString();
        } else {
            nextLabel = "reject";
        }
        return nextLabel;
    }

    // generates the change for a specific states
    private _getTMChange(currentLabel:string, block:BasicBlockContext | CoreBasicBlockContext) :IncompleteTMChange {
        const direction = block.moveCommand?.direction;
        const nextState:string = block.getNextLabel(currentLabel, this);
        const letter = block.changeToCommand?.value;

        return { nextState, letter, direction };
    }
    
    /**
     * Converts a basic block into a state.
     * 
     * @param block the basic block
     */
    public convertBasicBlock(block: BasicBlockContext) {
        this._blockIndex! ++;
        const currentLabel = this._moduleLabel! + this._blockIndex!;

        const change = this._getTMChange(currentLabel, block);
        const state = new ConstantTMState(currentLabel, this._alphabet!, change);
        this._turingMachine.addState(state);
    }
    
    /**
     * Gets the first block from a while case.
     * 
     * @param whileCase the while case
     * @returns the first block
     */
    public getFirstBlockFromWhile(whileCase:WhileCaseContext): CoreBasicBlockContext {
        return whileCase.block;
    }
    
    /**
     * Gets the first block from an if case.
     * 
     * @param ifCase the if case
     * @returns the first block
     */
    public getFirstBlockFromIf(ifCase:IfCaseContext):BasicBlockContext {
        this._isLastBlock = ifCase.blocks.length === 1;
        return ifCase.blocks[0] as BasicBlockContext;
    }

    /**
     * Converts a switch block into a state.
     * 
     * @param block the switch block
     */
    public convertSwitchBlock(block: SwitchBlockContext) {
        this._blockIndex! ++;
        const currentLabel = this._moduleLabel! + this._blockIndex!;
        
        const state = new VariableTMState(currentLabel);
        this._turingMachine.addState(state);
        
        let blockToConsider:BasicBlockContext | CoreBasicBlockContext;
        for (const switchCase of block.cases) {
            blockToConsider = switchCase.getFirstBlock(this);
            const change = this._getTMChange(currentLabel, blockToConsider);
            switchCase.values.forEach((value) => {
                state.addTransition(value, change);
            });
            switchCase.convert(this);
        }
    }
    
    /**
     * Converts an if block into states.
     * 
     * @param block the if block
     */
    public convertIf(block: IfCaseContext) {
        for (let i = 1; i < block.blocks.length; i++) {
            this._isLastBlock = i === block.blocks.length-1;
            block.blocks[i].convert(this);
        }
    }
}