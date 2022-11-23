import { CodeError } from "./CodeError";
import { CodePosition } from "./CodePosition";
import { CodeWrapper } from "./CodeWrapper";
import { AlphabetContext, BasicBlockContext, BlockContext, CaseContext, ChangeToContext, CoreBasicBlockContext, Direction, FlowChangeContext, GoToContext, IfCaseContext, ModuleContext, MoveContext, NormalBlockContext, ProgramContext, SwitchBlockContext, TerminationContext, TerminationState, WhileCaseContext } from "./Context";

export class CodeParser {
    /**
     * The wrapper for the code present
     */
    private _wrapper:CodeWrapper;
    
    /**
     * Constructs a parser for the given code
     * 
     * @param code the code to parse
     */
    public constructor(code:string) {
        this._wrapper = new CodeWrapper(code);
    }

    /**
     * Moves to the next line (or end of file) given that this line is a comment line now
     * 
     * @returns whether we reached the end of code
     */
     private _ignoreComments():boolean {
        let couldMoved:boolean;
        const startLine = this._wrapper.currentPosition.startLineNumber;
        do {
            couldMoved = this._wrapper.moveNext();
        } while (couldMoved && startLine === this._wrapper.currentPosition.startLineNumber);
        return !couldMoved;
    }

    /**
     * Matches full-line comment(s) in the program
     * 
     * @returns whether we reached the end of code
     */
    private _matchComments():boolean {
        let finished = false;
        while (this._wrapper.currentValue === "//") {
            finished = this._ignoreComments();
        }
        return finished;
    }
    
    /**
     * Moves to the next value, ignoring comments.
     * If `shouldThrow` is given and `false`, then returns the result. Otherwise, throws an error if encounters the end of file.
     *  
     * @throws syntax error if there is no next value
     * 
     * @returns whether we should move
     * 
     * @param shouldThrow whether an error should be thrown
     */
     private _moveNext(shouldThrow?:boolean):boolean {
        shouldThrow = shouldThrow ?? true;
        if ((!this._wrapper.moveNext() || this._matchComments())) {
            if (shouldThrow) {
                throw new CodeError(this._wrapper.currentPosition, `Unexpected end of file.`);
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Parses the given code.
     * 
     * @throws SyntaxError if there is a syntax error
     * 
     * @returns the parsed version of the program
     */
    public parse(): ProgramContext {
        if (!this._wrapper.moveNext()) {
            throw new CodeError(this._wrapper.currentPosition, `Empty file.`);
        }
        this._matchComments();

        return this._parseProgram();
    }

    /**
     * Matches the given value to the current value
     * 
     * @param value the expected value to be present
     * 
     * @throws syntax error if there is a mismatch
     */
    private _matchValue(value:string) {
        if (this._wrapper.currentValue !== value) {
            throw new CodeError(this._wrapper.currentPosition, `Expected value "${this._wrapper.currentValue}" to be "${value}".`);
        }
    }

    /**
     * Keeps executing the callback until the current value is the given value.
     *  
     */
    private _doUntil(value:string, callback: () => void, needToMove:boolean) {
        while (this._wrapper.currentValue !== value) {
            callback(); 
            if (needToMove) {
                this._moveNext();
            }
        }
    }

    /**
     * The parser for program
     * 
     */
    private _parseProgram(): ProgramContext {
        const startPosition = this._wrapper.currentPosition;
        const alphabet = this._parseAlphabet();
        const modules:ModuleContext[] = [];

        while (this._moveNext(false)) {
            modules.push(this._parseModule());
        }
        
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);
        
        if (modules.length === 0) {
            throw new CodeError(position, `A program should have at least one module.`);
        }
        
        return new ProgramContext(position, alphabet, modules);
    }

    /**
     * Parse letters in the alphabet/case. 
     * 
     * @param finishedValue the value that marks the parsing is complete (e.g. "}")
     * @param includesBlank whether the blank value can be included
     * 
     * @returns the values in the alphabet/case
     * 
     */
    private _parseValues(finishedValue:string, includesBlank:boolean): Set<string> {
        const values:Set<string> = new Set();
        let noComma = false;

        while (this._wrapper.currentValue != finishedValue) {
            // if next character isn't comma => must have been past the last entry
            if (noComma) {
                throw new CodeError(this._wrapper.currentPosition, `Expected value "${this._wrapper.currentValue}" to be "${finishedValue}".`);
            }
            if (includesBlank && this._wrapper.currentValue == "blank") {
                values.add("");
            } else {
                if (this._wrapper.currentValue.length != 1) {
                    throw new CodeError(this._wrapper.currentPosition, `The value "${this._wrapper.currentValue}" must have length 1.`);
                }
                if (!this._wrapper.currentValue.match(/[a-z|0-9]/)) {
                    throw new CodeError(this._wrapper.currentPosition, `The value "${this._wrapper.currentValue}" must be a lowercase character or a number.`);
                }
                
                values.add(this._wrapper.currentValue);    
            }
            
            this._moveNext();
            if (this._wrapper.currentValue == ",") {
                this._moveNext();
            } else {
                noComma = true;
            }
        }
        return values;
    }

    /**
     * The parser of the alphabet
     * 
     * @returns the set of alphabet
     */
    private _parseAlphabet(): AlphabetContext {
        const startPosition = this._wrapper.currentPosition;
        this._matchValue("alphabet");
        this._moveNext();
        
        this._matchValue("=");
        this._moveNext();
        
        this._matchValue("{");
        this._moveNext();

        const alphabet =  this._parseValues("}", false);
        
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        if (alphabet.size === 0) {
            throw new CodeError(position, `The alphabet must have at least one letter.`);
        }

        return new AlphabetContext(position, alphabet);
    }

    /**
     * The parser of the module
     *  
     */
    private _parseModule(): ModuleContext {
        const startPosition = this._wrapper.currentPosition;
        this._matchValue("module");
        this._moveNext();

        const label = this._wrapper.currentValue;
        this._moveNext();
        
        this._matchValue("{");
        this._moveNext();

        const blocks:NormalBlockContext[] = [];
        this._doUntil("}", () => {
            blocks.push(this._parseBlock());
        }, false);

        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        if (blocks.length === 0) {
            throw new CodeError(position, `A module must have at least one block/command.`);
        }

        return new ModuleContext(position, label, blocks);
    }

    private _parseBlock(): NormalBlockContext {
        if (this._wrapper.currentValue == "switch") {
            return this._parseSwitchBlock();
        } else {
            return this._parseBasicBlock();
        }
    }

    private _parseSwitchBlock(): SwitchBlockContext {
        const startPosition = this._wrapper.currentPosition;
        
        this._matchValue("switch");
        this._moveNext();
        
        this._matchValue("tapehead");
        this._moveNext();
        
        this._matchValue("{");
        this._moveNext();

        const cases:CaseContext[] = [];

        this._doUntil("}", () => {
            if (this._wrapper.currentValue == "if") {
                cases.push(this._parseIf());
            } else if (this._wrapper.currentValue == "while") {
                cases.push(this._parseWhile());
            } else {
                throw new CodeError(this._wrapper.currentPosition, `Unexpected start of case: "${this._wrapper.currentValue}".`);
            }
        }, true);
        
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        if (cases.length == 0) {
            throw new CodeError(position, `A switch block must have at least one case.`);
        }
        
        this._moveNext();
        return new SwitchBlockContext(CodePosition.combine(position, endPosition), cases);
    }

    private _parseIf(): IfCaseContext {
        const startPosition = this._wrapper.currentPosition;
        
        this._matchValue("if");
        this._moveNext();

        const values = this._parseValues("{", true);
        if (values.size === 0) {
            throw new CodeError(startPosition, `An if case must apply to at least one letter.`);
        }
        this._moveNext();
        
        const blocks:BlockContext[] = [];
        this._doUntil("}", () => {
            blocks.push(this._parseBlock());
        }, false);

        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        if (blocks.length == 0) {
            throw new CodeError(position, `An if case must have at least one command.`);
        }

        return new IfCaseContext(position, values, blocks);
    }

    private _parseWhile(): WhileCaseContext {
        const startPosition = this._wrapper.currentPosition;
     
        this._matchValue("while");
        this._moveNext();

        const values = this._parseValues("{", true);
        if (values.size === 0) {
            throw new CodeError(startPosition, `A while case must apply to at least one letter.`);
        }
        this._moveNext();

        if (this._wrapper.currentValue == "}") {
            throw new CodeError(startPosition, `A while case must have at least one command.`);
        }
        
        const block = this._parseCoreBlock();
        
        if (["move", "changeto"].includes(this._wrapper.currentValue)) {
            throw new CodeError(this._wrapper.currentPosition, `A while case cannot have more than one core block.`);
        }
        
        this._matchValue("}");

        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        return new WhileCaseContext(position, values, block);
    }

    private _parseBasicBlock(): BasicBlockContext {
        const startPosition = this._wrapper.currentPosition;
        let endPosition = startPosition;
        
        let changeToCommand:ChangeToContext|undefined;
        let moveCommand:MoveContext|undefined;
        let flowCommand:FlowChangeContext|undefined;
        
        if (this._wrapper.currentValue == "changeto") {
            endPosition = this._wrapper.currentPosition;
            changeToCommand = this._parseChangeTo();
            this._moveNext();
        } 
        if (this._wrapper.currentValue == "move") {
            endPosition = this._wrapper.currentPosition;
            moveCommand = this._parseMove();
            this._moveNext();
        }
        if (["accept", "reject"].includes(this._wrapper.currentValue)) {
            endPosition = this._wrapper.currentPosition;
            flowCommand = this._parseTermination();
            this._moveNext();
        } else if (this._wrapper.currentValue == "goto") {
            endPosition = this._wrapper.currentPosition;
            flowCommand = this._parseGoTo();
            this._moveNext();
        }

        if (startPosition === endPosition) {
            throw new CodeError(startPosition, `Invalid basic command "${this._wrapper.currentValue}".`);
        }
        
        const position = CodePosition.combine(startPosition, endPosition);

        return new BasicBlockContext(position, changeToCommand, moveCommand, flowCommand);
    }
    private _parseCoreBlock(): CoreBasicBlockContext {
        const startPosition = this._wrapper.currentPosition;
        let endPosition = startPosition;

        let changeToCommand:ChangeToContext|undefined;
        let moveCommand:MoveContext|undefined;

        if (this._wrapper.currentValue == "changeto") {
            endPosition = this._wrapper.currentPosition;
            changeToCommand = this._parseChangeTo();
            this._moveNext();
        } 
        if (this._wrapper.currentValue == "move") {
            endPosition = this._wrapper.currentPosition;
            moveCommand = this._parseMove();
            this._moveNext();
        }
        
        if (startPosition === endPosition) {
            throw new CodeError(startPosition, `Invalid core command "${this._wrapper.currentValue}".`);
        }

        const position = CodePosition.combine(startPosition, endPosition);
        
        return new CoreBasicBlockContext(position, changeToCommand, moveCommand);
    }

    private _parseChangeTo(): ChangeToContext {
        const startPosition = this._wrapper.currentPosition;
        this._moveNext();

        const value = this._wrapper.currentValue === "blank" ? "" : this._wrapper.currentValue;
        
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        return new ChangeToContext(position, value);
    }

    private _parseMove(): MoveContext {
        const startPosition = this._wrapper.currentPosition;
        this._moveNext();
        
        let direction:Direction;
        switch (this._wrapper.currentValue) {
            case "left":
                direction = Direction.LEFT;
                break;
            case "right":
                direction = Direction.RIGHT;
                break;
            default:
                throw new CodeError(this._wrapper.currentPosition, `Invalid direction "${this._wrapper.currentValue}".`);
        }
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        return new MoveContext(position, direction);
    }

    private _parseGoTo(): GoToContext {
        const startPosition = this._wrapper.currentPosition;
        this._moveNext();        
        const endPosition = this._wrapper.currentPosition;
        const position = CodePosition.combine(startPosition, endPosition);

        return new GoToContext(position, this._wrapper.currentValue);
    }
    

    private _parseTermination(): TerminationContext {
        const position = this._wrapper.currentPosition;
        let state:TerminationState;
        switch (this._wrapper.currentValue) {
            case "reject":
                state = TerminationState.REJECT;
                break;
            case "accept":
                state = TerminationState.ACCEPT;
                break;
        }
        return new TerminationContext(position, state!);
    }
}