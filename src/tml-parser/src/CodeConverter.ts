import { CodeVisitor } from "./CodeVisitor";
import { ProgramContext,ModuleContext, BasicBlockContext, CoreBasicBlockContext, SwitchBlockContext, IfCaseContext, GoToContext, TerminationContext } from "./Context";
import { ConstantTMState, TuringMachine, VariableTMState, IncompleteTMChange } from "./TuringMachine";

/**
 * The class `CodeConverter` converts a valid TM program into a valid TM.
 */
export class CodeConverter extends CodeVisitor<string> {
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
        super();
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
        this.visit(this._program);

        return this._turingMachine;
    }

    /**
     * Converts the program into a Turing Machine.
     * 
     * @param program the program
     */
    public visitProgram(program: ProgramContext):string {
        this._turingMachine.initialState = program.modules[0].identifier + "0";
        for (const module of program.modules) {
            this.visit(module);
        }

        return "";
    }
    
    /**
     * Converts a module into states within the Turing Machine.
     * 
     * @param module the module
     */
    public visitModule(module: ModuleContext):string {
        this._blockIndex = -1;
        for (let i = 0; i < module.blocks.length; i++) {
            this._moduleLabel = module.identifier;
            this._isLastBlock = i === module.blocks.length-1;
            this.visit(module.blocks[i]);
        }
        
        return "";
    }

    /**
     * Retrieves the nextState from the goto command
     * 
     * @param command the command
     * @returns the label of the nextState
     */
    public visitGoTo(command: GoToContext): string {
        return command.identifier + "0";
    }

    /**
     * Retrieves the nextState from the termination command
     * 
     * @param command the termination command
     * @returns the label of the nextState
     */
    public visitTermination(command: TerminationContext): string {
        return command.state.toString();
    }

    // generates the change for a specific states
    private _getTMChange(currentLabel:string, block:BasicBlockContext | CoreBasicBlockContext) :IncompleteTMChange {
        const direction = block.moveCommand?.direction;
        let nextState:string;
        if (block instanceof CoreBasicBlockContext) {
            nextState = currentLabel;
        } else if (block.flowCommand) {
            nextState = this.visit(block.flowCommand);
        } else if (!this._isLastBlock!) {
            nextState = this._moduleLabel! + (this._blockIndex!+1).toString();
        } else {
            nextState = "reject";
        }
        const letter = block.changeToCommand?.value;

        return { nextState, letter, direction };
    }
    
    /**
     * Converts a basic block into a state.
     * 
     * @param block the basic block
     */
    public visitBasicBlock(block: BasicBlockContext):string {
        this._blockIndex! ++;
        const currentLabel = this._moduleLabel! + this._blockIndex!;

        const change = this._getTMChange(currentLabel, block);
        const state = new ConstantTMState(currentLabel, this._alphabet!, change);
        this._turingMachine.addState(state);

        return "";
    }

    /**
     * Converts a switch block into a state.
     * 
     * @param block the switch block
     */
    public visitSwitchBlock(block: SwitchBlockContext):string {
        this._blockIndex! ++;
        const currentLabel = this._moduleLabel! + this._blockIndex!;
        
        const state = new VariableTMState(currentLabel);
        this._turingMachine.addState(state);
        
        let blockToConsider:BasicBlockContext | CoreBasicBlockContext;
        for (const switchCase of block.cases) {
            blockToConsider = switchCase.firstBlock;
            if (switchCase instanceof IfCaseContext) {
                this._isLastBlock = switchCase.blocks.length === 1;
            }
            
            const change = this._getTMChange(currentLabel, blockToConsider);
            switchCase.values.forEach((value) => {
                state.addTransition(value, change);
            });
            this.visit(switchCase);
        }

        return "";
    }
    
    /**
     * Converts an if block into states.
     * 
     * @param block the if block
     */
    public visitIf(block: IfCaseContext): string {
        for (let i = 1; i < block.blocks.length; i++) {
            this._isLastBlock = i === block.blocks.length-1;
            this.visit(block.blocks[i]);
        }

        return "";
    }

    public visitMove(): string {
        return "";
    }

    public visitChangeTo(): string {
        return "";
    }
    
    public visitCoreBasicBlock(): string {
        return "";
    }
    
    public visitWhile(): string {
        return "";
    }
    
    public visitAlphabet(): string {
        return "";
    }
}