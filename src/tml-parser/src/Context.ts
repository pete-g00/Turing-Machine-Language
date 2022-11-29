import { CodeConverter } from "./CodeConverter";
import { CodePosition } from "./CodePosition";
import { CodeValidator } from "./CodeValidator";

/**
 * The class `Context` is the base abstract class for all the other contexts.
 * 
 * Every context instance has a position to represent whether the code block is positioned in code (for error messages).
 * 
 * Many context subclasses have visitor methods to enable double dispatch.
 */
export abstract class Context {
    
    /**
     * The position in code of the context.
     * 
     * The position captures the line and the column numbers, from start until the end.
     */
    public readonly position:CodePosition;

    public constructor(position:CodePosition) {
        this.position = position;
    }
}

/**
 * The class `CommandContext` is the base abstract class for all the commands.
 * 
 * It is solely used for grouping and requires no additional functionality.
 */
export abstract class CommandContext extends Context { }

/**
 * The class `FlowChangeContext` is the base abstract class for all the flow change commands.
 * 
 * It is solely used for grouping and requires no additional functionality.
 */
export abstract class FlowChangeContext extends CommandContext { 
    public abstract validate(validator:CodeValidator): void;

    public abstract convert(converter:CodeConverter): string;
}

/**
 * The termination states for a program
 */
export enum TerminationState {
    /**
     * The termination state reject
     */
    REJECT = "reject",

    /**
     * The termination state accept
     */
    ACCEPT = "accept"
}

/**
 * The class `TerminationContext` is the class used to represent *termination* commands (*accept* or *reject*)
 * 
 */
export class TerminationContext extends FlowChangeContext {
    /**
     * The termination state in the command
     */
    public readonly state:TerminationState;

    public constructor(position:CodePosition, state:TerminationState) {
        super(position);
        this.state = state;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public validate(): void {}

    public convert(converter: CodeConverter): string {
        return converter.convertTermination(this);
    }
}

/**
 * The class `GoToContext` is the class used to represent *goto* commands.
 */
export class GoToContext extends FlowChangeContext {
    /**
     * The identifier for the module in the command
     */
    public readonly identifier:string;

    public constructor(position:CodePosition, identifier:string) {
        super(position);
        this.identifier = identifier;
    }

    public validate(validator:CodeValidator) {
        validator.validateGoTo(this);
    }

    public convert(converter: CodeConverter): string {
        return converter.convertGoTo(this);
    }
}

/**
 * The class `CoreCommandContext` is the base abstract class for all core commands.
 * 
 * It is solely used for grouping and requires no additional functionality.
 */
export abstract class CoreCommandContext extends CommandContext { }

/**
 * The move direction
 */
export enum Direction {
    /**
     * The move direction left
     */
    LEFT = "L",

    /**
     * The move direction right
     */
    RIGHT = "R"
}

/**
 * The class `MoveContext` is the class used to represent *move* commands.
 */
export class MoveContext extends CoreCommandContext {
    /**
     * The direction to move in the command
     */
    public readonly direction:Direction;

    public constructor(position:CodePosition, direction:Direction) {
        super(position);
        this.direction = direction;
    }
}

/**
 * The class `ChangeToContext` is the class used to represent *changeto* commands.
 */
export class ChangeToContext extends CoreCommandContext {
    /**
     * The value to change to in the command
     */
    public readonly value:string;

    public constructor(position:CodePosition, value:string) {
        super(position);
        this.value = value;
    }

    public validate(validator:CodeValidator):void {
        validator.validateChangeTo(this);
    }
}

/**
 * The class `BlockContext` is the base abstract class for all block types.
 * 
 * It is solely used for grouping and requires no additional functionality.
 */
export abstract class BlockContext extends Context {
    public abstract validate(validator:CodeValidator): boolean;
}

/**
 * The class `CoreBasicBlockContext` is the class used to represent core (basic) blocks.
 * 
 * A core block is composed of a *changeto* command and/or a *move* command.
 */
 export class CoreBasicBlockContext extends BlockContext {
    /**
     * The *changeto* command in the block.
     * 
     * A basic block need not have the command, i.e. so the context may be undefined.
     */
    public readonly changeToCommand:ChangeToContext|undefined;

    /**
     * The *move* command in the block.
     * 
     * A basic block need not have the command, i.e. so the context may be undefined.
     */
    public readonly moveCommand:MoveContext|undefined;
     
    public constructor(position:CodePosition, changeToCommand?:ChangeToContext, moveCommand?:MoveContext) {
        super(position);
        this.changeToCommand = changeToCommand;
        this.moveCommand = moveCommand;
    }

    public validate(validator: CodeValidator): boolean {
        return validator.validateCoreBlock(this);
    }

    public getNextLabel(label:string, converter:CodeConverter): string {
        return converter.getNextLabelFromCoreBasicBlock(label);
    }
}
/**
 * The class `NormalBlockContext` is the base abstract class for all block types valid in modules/if statements.
 * 
 * It is solely used for grouping and requires no additional functionality.
 */
 export abstract class NormalBlockContext extends BlockContext {
    public abstract convert(converter:CodeConverter): void;
 }

/**
 * The class `BasicBlockContext` is the class used to represent basic blocks.
 * 
 * A basic block is composed of a *changeto* command, a *move* command and a *flow* command, any of which (but not all) could be missing.
 */
export class BasicBlockContext extends NormalBlockContext {
    /**
     * The *changeto* command in the block.
     * 
     * A basic block need not have the command, i.e. so the context may be undefined.
     */
    public readonly changeToCommand:ChangeToContext|undefined;


    /**
     * The *move* command in the block.
     * 
     * A basic block need not have the command, i.e. so the context may be undefined.
     */
    public readonly moveCommand:MoveContext|undefined;
    
    /**
     * The *flow* command in the block.
     * 
     * A basic block need not have the command, i.e. so the context may be undefined.
     */
    public readonly flowCommand:FlowChangeContext|undefined;

    public constructor(position:CodePosition, changeToCommand?:ChangeToContext, moveCommand?:MoveContext, flowCommand?:FlowChangeContext) {
        super(position);
        this.changeToCommand = changeToCommand;
        this.moveCommand = moveCommand;
        this.flowCommand = flowCommand;
    }

    public validate(validator:CodeValidator): boolean {
        return validator.validateBasicBlock(this);
    }

    public convert(converter: CodeConverter): void {
        converter.convertBasicBlock(this);
    }

    public getNextLabel(label:string, converter:CodeConverter): string {
        return converter.getNextLabelFromBasicBlock(label, this);
    }
}

/**
 * The class `CaseContext` is the base abstract class for all cases.
 * 
 * Every case instance applies to a set of values.
 */
export abstract class CaseContext extends NormalBlockContext {
    /**
     * The values that a case applies to
     */
    public readonly values:Set<string>;
    
    public constructor(position:CodePosition, values:Set<string>) {
        super(position);
        this.values = values;
    }

    public abstract getFirstBlock(converter:CodeConverter):BasicBlockContext | CoreBasicBlockContext;
}

/**
 * The class `IfCaseContext` is the class used to represent an if case.
 * 
 * An if case is composed of the values it applies to and the blocks within the body.
 */
export class IfCaseContext extends CaseContext {
    /**
     * The blocks in the body of the if case
     */
    public readonly blocks:NormalBlockContext[];

    public constructor(position:CodePosition, values:Set<string>, blocks:NormalBlockContext[]) {
        super(position, values);
        this.blocks = blocks;
    }
    
    public validate(validator:CodeValidator): boolean {
        return validator.validateIf(this);
    }

    public convert(converter: CodeConverter): void {
        converter.convertIf(this);
    }

    public getFirstBlock(converter: CodeConverter): BasicBlockContext {
        return converter.getFirstBlockFromIf(this);
    }
}

/**
 * The class `WhileCaseContext` is the class used to represent a while case.
 * 
 * A while case is composed of the values it applies to and the single core block within the body.
 */
export class WhileCaseContext extends CaseContext {
    /**
     * The block in the body of the while case
     */
    public readonly block:CoreBasicBlockContext;

    public constructor(position:CodePosition, values:Set<string>, block:CoreBasicBlockContext) {
        super(position, values);
        this.block = block;
    }
    
    public validate(validator:CodeValidator) {
        return validator.validateWhile(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public convert(): void {}

    public getFirstBlock(converter: CodeConverter): CoreBasicBlockContext {
        return converter.getFirstBlockFromWhile(this);
    }
}

/**
 * The class `SwitchBlockContext` is the class used to represent a switch block.
 * 
 * A switch block is composed of cases
 */
export class SwitchBlockContext extends BlockContext {
    /**
     * The cases in the switch block
     */
    public readonly cases:CaseContext[];

    public constructor(position:CodePosition, cases:CaseContext[]) {
        super(position);
        this.cases = cases;
    }   

    public validate(validator:CodeValidator): boolean {
        return validator.validateSwitchBlock(this);
    }

    public convert(converter:CodeConverter) {
        converter.convertSwitchBlock(this);
    }
}

/**
 * The class `ModuleContext` is the class used to represent a module.
 * 
 * A module is composed of basic or switch blocks and has a name
 */
export class ModuleContext extends Context {
    /**
     * The identifier used to reference the module
     */
    public readonly identifier:string;
    
    /**
     * The blocks present in the module
     */
    public readonly blocks:NormalBlockContext[];

    public constructor(position:CodePosition, identifier:string, blocks:NormalBlockContext[]) {
        super(position);
        this.identifier = identifier;
        this.blocks = blocks;
    }

    public validate(validator:CodeValidator) {
        validator.validateModule(this);
    }

    public convert(converter:CodeConverter) {
        converter.convertModule(this);
    }
}

export class AlphabetContext extends Context {
    /**
     * The letters in the alphabet
     */
     public readonly values:Set<string>;

     public constructor(position:CodePosition, alphabet:Set<string>) {
        super(position);
        this.values = alphabet;
     }
}

/**
 * The class `ProgramContext` is the class used to represent a program.
 * 
 * A program is composed of an alphabet and modules
 */
export class ProgramContext extends Context {
    /**
     * The alphabet of the program
     */
    public readonly alphabet:AlphabetContext;

    /**
     * The modules present in the program
     */
    public readonly modules:ModuleContext[];

    public constructor(position:CodePosition, alphabet:AlphabetContext, modules:ModuleContext[]) {
        super(position);
        this.alphabet = alphabet;
        this.modules = modules;
    }

    public validate(validator:CodeValidator) {
        validator.validateProgram(this);
    }

    public convert(converter:CodeConverter) {
        converter.convertProgram(this);
    }
}