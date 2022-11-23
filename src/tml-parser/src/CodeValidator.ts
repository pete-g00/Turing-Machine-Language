import { BaseVisitor } from "./BaseVisitor";
import { CodeError } from "./CodeError";
import { ProgramContext, AlphabetContext, ModuleContext, BasicBlockContext, CoreBasicBlockContext, SwitchBlockContext, IfCaseContext, WhileCaseContext, ChangeToContext, GoToContext, BlockContext } from "./Context";

/**
 * `CodeValidator` ensures that the parsed TM program is valid by performing multiple checks on it.
 * 
 */
export class CodeValidator extends BaseVisitor<boolean> {
    /**
     * The alphabet of the program
     */
    private _alphabet?:Set<string>;

    /**
     * The name of the modules present
     */
    private _moduleNames:Set<string>;
    
    /**
     * `CodeValidator` ensures that the parsed TM program is valid. In particular, it checks the following:
     * 
     * 1. Every module identifier used in *goto* statements must be defined somewhere in the program;
     * 2. In every switch block, there exists precisely once case corresponding to every letter in the alphabet, including blank;
     * 3. A non-final block must not have a *flow* command;
     * 4. A *changeto* command must change to a valid letter in the alphabet, including blank;
     * 5. There cannot be two modules with the same identifier;
     * 6. A switch block must be the final block present;
     * 7. A module cannot be called "accept" or "reject";
     * 8. The first block within an if block cannot be a switch block.
     * 
     * This is done using the visitor design pattern. 
     * 
     * We use boolean to record whether a block has a *flow* command, and returns false in every other case.
     */
    public constructor() {
        super();
        this._moduleNames = new Set<string>();
    }

    /**
     * Adds all the module names into the set `_moduleNames`
     * 
     * @throws if there is a duplicate definition of a module, or if there is a module called accept or reject
     * 
     * @param program the program
     */
    private _addModuleNames(program: ProgramContext): void {
        for (const module of program.modules) {
            if (module.identifier === "accept" || module.identifier === "reject") {
                throw new CodeError(module.position, `A module cannot be called "${module.identifier}".`);
            }
            if (this._moduleNames.has(module.identifier)) {
                throw new CodeError(module.position, `Duplicate module with name "${module.identifier}".`);
            }
            this._moduleNames.add(module.identifier);
        }
    }
    
    public visitProgram(program: ProgramContext): boolean {
        this.visit(program.alphabet);
        this._addModuleNames(program);
        
        for (const module of program.modules) {
            this.visit(module);
        }

        return false;
    }

    public visitAlphabet(alphabet: AlphabetContext): boolean {
        this._alphabet = alphabet.values;
        
        return false;
    }

    /**
     * Validates whether a sequence of blocks only has a terminating command at its final block and a switch block is a final block if present
     * 
     * @param blocks the blocks to validate
     * @returns  whether the last block is a flow block
     */
    private _validateBlocks(blocks:BlockContext[], isIfBlock:boolean): boolean {
        let hasFlow = false;
        let hasSwitch = false;
        for (let i = 0; i < blocks.length; i++) {
            if (hasSwitch) {
                throw new CodeError(blocks[i-1].position, `A non-final block in a sequence of blocks cannot be a switch block.`);
            }
            if (hasFlow) {
                throw new CodeError(blocks[i-1].position, `A non-final block in a sequence of blocks cannot have a flow command.`);
            } 

            if (blocks[i] instanceof SwitchBlockContext) {
                if (isIfBlock && i === 0) {
                    throw new CodeError(blocks[i].position, `The first block within an if case cannot be a switch block.`);
                }
                hasSwitch = true;
            }

            // visit returns whether the block has a flow command
            if (this.visit(blocks[i])) {
                hasFlow = true;
            }
        }
        
        return hasFlow;
    }

    public visitModule(module: ModuleContext): boolean {
        this._validateBlocks(module.blocks, false);
        return false;
    }

    public visitBasicBlock(block: BasicBlockContext): boolean {
        if (block.changeToCommand) {
            this.visit(block.changeToCommand);
        }
        
        if (block.flowCommand) {
            this.visit(block.flowCommand);
        }
        
        return block.flowCommand !== undefined;
    }
    
    public visitCoreBlock(block: CoreBasicBlockContext): boolean {
        if (block.changeToCommand) {
            this.visit(block.changeToCommand);
        }
        
        return false;
    }

    public visitSwitchBlock(block: SwitchBlockContext): boolean {
        const caseSet = new Set<string>();
        let hasFlow = false;

        for (const switchCase of block.cases) {
            switchCase.values.forEach((letter) => {
                if (caseSet.has(letter)) {
                    throw new CodeError(block.position, `Multiple cases present for letter "${letter}".`);
                } else if (letter !== "" && !this._alphabet!.has(letter)) {
                    throw new CodeError(switchCase.position, `The letter "${letter}" is not part of the alphabet.`);
                }
                caseSet.add(letter);
            });
            
            if (this.visit(switchCase)) {
                hasFlow = true;
            }
        }

        if (caseSet.size != this._alphabet!.size+1) {
            throw new CodeError(block.position, `The switch block doesn't have a case for each letter in the alphabet.`);
        }
        
        return hasFlow;
    }

    public visitIf(block: IfCaseContext): boolean {
        return this._validateBlocks(block.blocks, true);
    }
    
    public visitWhile(block: WhileCaseContext): boolean {
        this.visit(block.block);
        
        return false;
    }

    public visitChangeTo(command: ChangeToContext): boolean {
        if (command.value != "" && !this._alphabet!.has(command.value)) {
            throw new CodeError(command.position, `The letter "${command.value}" is not part of the alphabet.`);
        }
        
        return false;
    }
    
    public visitMove(): boolean {
        return false;
    }

    public visitGoTo(command: GoToContext): boolean {
        if (!this._moduleNames.has(command.identifier)) {
            throw new CodeError(command.position, `Undefined module "${command.identifier}".`);
        }
        
        return true;
    }

    public visitTermination(): boolean {
        return true;
    }
}