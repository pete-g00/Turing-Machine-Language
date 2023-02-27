import { CodeError } from "./CodeError";
import { ProgramContext, ModuleContext, BasicBlockContext, CoreBasicBlockContext, SwitchBlockContext, IfCaseContext, WhileCaseContext, ChangeToContext, GoToContext, BlockContext } from "./Context";

/**
 * `CodeValidator` ensures that the parsed TM program is valid by performing multiple checks on it.
 * 
 */
export class CodeValidator {
    /**
     * The alphabet of the program
     */
    private _alphabet?:Set<string>;

    /**
     * The name of the modules present
     */
    private _moduleNames:Set<string>;

    private _program:ProgramContext;
    
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
    public constructor(program:ProgramContext) {
        this._program = program;
        this._moduleNames = new Set<string>();
    }

    public validate() {
        this._program.validate(this);
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
    
    public validateProgram(program: ProgramContext): void {
        this._alphabet = this._program.alphabet.values;
        this._addModuleNames(program);
        
        for (const module of program.modules) {
            module.validate(this);
        }
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

            if (blocks[i].validate(this)) {
                hasFlow = true;
            }
        }
        
        return hasFlow;
    }

    public validateModule(module: ModuleContext): void {
        this._validateBlocks(module.blocks, false);
    }

    public validateBasicBlock(block: BasicBlockContext): boolean {
        block.changeToCommand?.validate(this);
        block.flowCommand?.validate(this);
        
        return block.flowCommand !== undefined;
    }
    
    public validateCoreBlock(block: CoreBasicBlockContext): boolean {
        block.changeToCommand?.validate(this);

        return false;
    }

    public validateSwitchBlock(block: SwitchBlockContext): boolean {
        const caseSet = new Set<string>();
        const alphabetSet = new Set(this._alphabet);
        alphabetSet.add("");

        let hasFlow = false;

        for (const switchCase of block.cases) {
            switchCase.values.forEach((letter) => {
                if (caseSet.has(letter)) {
                    throw new CodeError(block.position, `Multiple cases present for letter "${letter}".`);
                } else if (!alphabetSet.delete(letter)) {
                    throw new CodeError(switchCase.position, `The letter "${letter}" is not part of the alphabet.`);
                }
                caseSet.add(letter);
            });
            
            if (switchCase.validate(this)) {
                hasFlow = true;
            }
        }

        if (alphabetSet.size !== 0) {
            const missingLetters = Array.from(alphabetSet).map(val => val.length === 0 ? "blank" : `"${val}"`);
            const letter = missingLetters.length === 1 ? "letter" : "letters";
            throw new CodeError(block.position, `The switch block doesn't have a case for the ${letter}: ${missingLetters.join(", ")}.`);
        }
        
        return hasFlow;
    }

    public validateIf(block: IfCaseContext): boolean {
        return this._validateBlocks(block.blocks, true);
    }
    
    public validateWhile(block: WhileCaseContext): boolean {
        block.block.validate(this);

        return false;
    }

    public validateChangeTo(command: ChangeToContext)  {
        if (command.value !== "" && !this._alphabet!.has(command.value)) {
            throw new CodeError(command.position, `The letter "${command.value}" is not part of the alphabet.`);
        }
    }

    public validateGoTo(command: GoToContext) {
        if (!this._moduleNames.has(command.identifier)) {
            throw new CodeError(command.position, `Undefined module "${command.identifier}".`);
        }
    }
}