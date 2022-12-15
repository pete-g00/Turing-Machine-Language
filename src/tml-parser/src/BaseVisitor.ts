import { AlphabetContext, BasicBlockContext, ChangeToContext, CoreBasicBlockContext, GoToContext, IfCaseContext, ModuleContext, MoveContext, ProgramContext, SwitchBlockContext, TerminationContext, WhileCaseContext } from "./Context";

/**
 * The base visitor allows for a TM Program to be visited and a value shared/accumulated
 */
export abstract class BaseVisitor<T> {
    /**
     * The code run for the entire program
     * 
     * @param program the program to visit
     */
    public abstract visitProgram(program:ProgramContext): T;
    
    /**
     * The code run for the alphabet command present in the program
     * 
     * @param alphabet the alphabet to visit
     */
     public abstract visitAlphabet(alphabet:AlphabetContext): T;    
    
    /**
     * The code run for the every module present in the program
     * 
     * @param module the module to visit
     */
    public abstract visitModule(module:ModuleContext): T;
 
    /**
     * The code run for the every basic block present in the program
     * 
     * @param block the basic block to visit
     */
    public abstract visitBasicBlock(block:BasicBlockContext): T;

    /**
     * The code run for the every core block present in the program
     * 
     * @param block the core block to visit
     */
    public abstract visitCoreBlock(block:CoreBasicBlockContext) :T;

    /**
     * The code run for the every switch block present in the program
     * 
     * @param block the switch block to visit
     */
    public abstract visitSwitchBlock(block:SwitchBlockContext): T;

    /**
     * The code run for the every if case present in the program
     * 
     * @param block the module to visit
     */
    public abstract visitIf(block:IfCaseContext): T;

    /**
     * The code run for the every while case present in the program
     * 
     * @param block the while case to visit
     */
    public abstract visitWhile(block:WhileCaseContext): T;

    /**
     * The code run for the every changeto command present in the program
     * 
     * @param command the changeto command to visit
     */
    public abstract visitChangeTo(command:ChangeToContext): T;

    /**
     * The code run for the every move command present in the program
     * 
     * @param command the move command to visit
     */
    public abstract visitMove(command:MoveContext): T;

    /**
     * The code run for the every goto command present in the program
     * 
     * @param command the goto command to visit
     */
    public abstract visitGoTo(command:GoToContext): T;

    /**
     * The code run for the every termination command present in the program
     * 
     * @param command the termination command to visit
     */
    public abstract visitTermination(command:TerminationContext): T;
}