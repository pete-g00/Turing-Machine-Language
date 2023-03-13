import { AlphabetContext, BasicBlockContext, ChangeToContext, Context, CoreBasicBlockContext, GoToContext, IfCaseContext, ModuleContext, MoveContext, ProgramContext, SwitchBlockContext, TerminationContext, WhileCaseContext } from "./Context";

export abstract class CodeVisitor<T> {
    public visit(context:Context):T {
        return context.visit(this);
    }
    
    public abstract visitTermination(context:TerminationContext):T;

    public abstract visitGoTo(context:GoToContext):T;

    public abstract visitMove(context:MoveContext):T;

    public abstract visitChangeTo(context:ChangeToContext):T;

    public abstract visitCoreBasicBlock(context:CoreBasicBlockContext):T;

    public abstract visitBasicBlock(context:BasicBlockContext):T;

    public abstract visitIf(context:IfCaseContext):T;

    public abstract visitWhile(context:WhileCaseContext):T;

    public abstract visitSwitchBlock(context:SwitchBlockContext):T;

    public abstract visitModule(context:ModuleContext):T;

    public abstract visitAlphabet(context:AlphabetContext):T;

    public abstract visitProgram(context:ProgramContext):T;
}