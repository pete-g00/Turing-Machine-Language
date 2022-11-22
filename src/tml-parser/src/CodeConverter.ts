import { BaseVisitor } from "./BaseVisitor";
import { ProgramContext, AlphabetContext, ModuleContext, BasicBlockContext, CoreBasicBlockContext, SwitchBlockContext, IfCaseContext, WhileCaseContext, GoToContext, TerminationContext, TerminationState } from "./Context";
import { ConstantTMState, TuringMachine, VariableTMState, IncompleteTMChange } from "./TuringMachine";

/**
 * The class `CodeConverter` converts a valid TM program into a valid TM.
 */
export class CodeConverter extends BaseVisitor<TuringMachine> {
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

    /**
     * Creates a `CodeConverter`.
     * 
     * The class `CodeConverter` converts a valid TM program into a valid TM.
     * 
     */
    public constructor() {
        super();
        this._turingMachine = new TuringMachine();
    }

    public visitProgram(program: ProgramContext): TuringMachine {
        this.visit(program.alphabet);

        this._turingMachine.initialState = program.modules[0].identifier + "0";
        for (const module of program.modules) {
            this.visit(module);
        }
        return this._turingMachine;
    }

    public visitAlphabet(alphabet: AlphabetContext): TuringMachine {
        this._turingMachine.alphabet = alphabet.values;
        this._alphabet = alphabet.values;
        return this._turingMachine;
    }
    
    public visitModule(module: ModuleContext): TuringMachine {
        this._blockIndex = -1;
        for (let i = 0; i < module.blocks.length; i++) {
            this._moduleLabel = module.identifier;
            this._isLastBlock = i === module.blocks.length-1;
            this.visit(module.blocks[i]);
        }
        return this._turingMachine;
    }

    private _getNextLabel(block: BasicBlockContext): string {
        let nextLabel:string;
        if (block.flowCommand) {
            if (block.flowCommand instanceof GoToContext) {
                nextLabel = (block.flowCommand as GoToContext).identifier + "0";
            } else {
                switch ((block.flowCommand as TerminationContext).state) {
                    case TerminationState.ACCEPT:
                        nextLabel = "accept";
                        break;
                    case TerminationState.REJECT:
                        nextLabel = "reject";
                        break;
                }
            }            
        } else if (!this._isLastBlock!) {
            nextLabel = this._moduleLabel! + (this._blockIndex!+1).toString();
        } else {
            nextLabel = "reject";
        }
        return nextLabel;
    }

    private _getTMChange(currentLabel:string, block:BasicBlockContext | CoreBasicBlockContext) :IncompleteTMChange {
        const direction = block.moveCommand?.direction;

        let nextState:string;
        if (block instanceof CoreBasicBlockContext) {
            nextState = currentLabel;
        } else {
            nextState = this._getNextLabel(block);
        }

        let letter:string|undefined;
        if (block.changeToCommand) {
            letter = block.changeToCommand.value;
        }
        
        return {
            nextState, 
            letter,
            direction
        };
    }
    
    public visitBasicBlock(block: BasicBlockContext): TuringMachine {
        this._blockIndex! ++;        
        const currentLabel = this._moduleLabel! + this._blockIndex!;

        const changer = this._getTMChange(currentLabel, block);
        const state = new ConstantTMState(currentLabel, this._alphabet!, changer);
        this._turingMachine.addState(state);

        return this._turingMachine;
    }
    
    public visitCoreBlock(): TuringMachine {
        return this._turingMachine;
    }

    private _getFirstBlock(ifCase:IfCaseContext):BasicBlockContext {
        this._isLastBlock = ifCase.blocks.length == 1;
        return ifCase.blocks[0] as BasicBlockContext;
    }

    public visitSwitchBlock(block: SwitchBlockContext): TuringMachine {
        this._blockIndex! ++;
        const currentLabel = this._moduleLabel! + this._blockIndex!;
        const transitionMap = new Map<string, IncompleteTMChange>();
        
        const state = new VariableTMState(currentLabel, transitionMap);
        this._turingMachine.addState(state);
        
        let blockToConsider:BasicBlockContext | CoreBasicBlockContext;
        for (const switchCase of block.cases) {
            if (switchCase instanceof WhileCaseContext) {
                blockToConsider = switchCase.block;
            } else {
                blockToConsider = this._getFirstBlock(switchCase as IfCaseContext);
            }
            const change = this._getTMChange(currentLabel, blockToConsider);
            switchCase.values.forEach((value) => {
                transitionMap.set(value, change);
            });
            this.visit(switchCase);
        }

        return this._turingMachine;
    }
    
    public visitIf(block: IfCaseContext): TuringMachine {
        for (let i = 1; i < block.blocks.length; i++) {
            this._isLastBlock = i === block.blocks.length-1;
            this.visit(block.blocks[i]);
        }
        return this._turingMachine;
    }
    
    public visitWhile(): TuringMachine {
        return this._turingMachine;
    }
    
    public visitChangeTo(): TuringMachine {
        return this._turingMachine;
    }
    
    public visitMove(): TuringMachine {
        return this._turingMachine;
    }
    
    public visitGoTo(): TuringMachine {
        return this._turingMachine;
    }
    
    public visitTermination(): TuringMachine {
        return this._turingMachine;
    }
}