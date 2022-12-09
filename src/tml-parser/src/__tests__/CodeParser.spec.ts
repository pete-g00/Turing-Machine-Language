import { CodeParser } from "../CodeParser";
import { CodePosition } from "../CodePosition";
import { BasicBlockContext, Direction, GoToContext, IfCaseContext, SwitchBlockContext, TerminationContext, TerminationState, WhileCaseContext } from "../Context";

const simple = `alphabet = {a, b}
module block1 {
    move right
    changeto blank
    goto block2
} 
module block2 {
    while 0 {
        changeto b
        move left
    } if 1, blank {
        changeto a
        accept
    }
}`;

const isDiv2Iterative = `// checks whether a binary number is a multiple of 2 iteratively
alphabet = {0, 1} // only binary values allowed
module isDiv2 {
    // move to the end first
    while 0, 1 {
        move right
    } if blank {
        // check the last letter is 0
        move left
        if 0 {
            accept
        } if 1, blank {
            reject
        }
    }
}`;

const isDiv2Recursive = `alphabet = {0, 1}
module isDiv2 {
    if blank {
        move right
        reject
    } if 0 {
        move right
        if blank {
            accept
        } if 0, 1 {
            goto isDiv2
        }
    } if 1 {
        move right
        if blank {
            reject
        } if 0, 1 {
            goto isDiv2
        }
    }
}`;

const simpleParser = new CodeParser(simple);
const simpleProgram = simpleParser.parse();

const isDiv2IterativeParser = new CodeParser(isDiv2Iterative);
const isDiv2IterativeProgram = isDiv2IterativeParser.parse();   

const isDiv2RecursiveParser = new CodeParser(isDiv2Recursive);
const isDiv2RecursiveProgram = isDiv2RecursiveParser.parse();

test("CodeParser parses an alphabet correctly", () => {
    const alphabet = simpleProgram.alphabet;

    expect(alphabet.values).toEqual(new Set(["a", "b"]));
    expect(alphabet.position).toEqual(new CodePosition(0, 1, 0, 17));
});

test("CodeParser parses a module correctly", () => {
    const modules = simpleProgram.modules;
    
    expect(modules.length).toBe(2);
    expect(modules[0].identifier).toBe("block1");
    expect(modules[0].blocks.length).toBe(2);
    
    expect(modules[0].position).toEqual(new CodePosition(1, 6, 0, 1));
    expect(modules[1].position).toEqual(new CodePosition(6, 15, 0, 1));
});

test("CodeParser parses a basic block correctly", () => {
    const module = simpleProgram.modules[1];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const ifBlock = switchBlock.cases[1] as IfCaseContext;
    const basicBlock = ifBlock.blocks[0] as BasicBlockContext;

    expect(basicBlock.changeToCommand).toBeDefined();
    expect(basicBlock.moveCommand).toBeUndefined();
    expect(basicBlock.flowCommand).toBeDefined();
    
    expect(basicBlock.position).toEqual(new CodePosition(11, 13, 8, 14));
});

test("CodeParser parses a while command correctly", () => {
    const module = isDiv2IterativeProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const whileCase = switchBlock.cases[0] as WhileCaseContext;
    
    expect(whileCase.values).toEqual(new Set(["0", "1"]));
    
    expect(whileCase.block.changeToCommand).toBeUndefined();
    expect(whileCase.block.moveCommand).toBeDefined();

    expect(whileCase.position).toEqual(new CodePosition(4, 7, 4, 5));
});

test("CodeParser parses an if command correctly", () => {
    const module = isDiv2IterativeProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const ifCase = switchBlock.cases[1] as IfCaseContext;

    expect(ifCase.values).toEqual(new Set([""]));
    expect(ifCase.blocks.length).toBe(2);

    expect(ifCase.blocks[0]).toBeInstanceOf(BasicBlockContext);
    expect(ifCase.blocks[1]).toBeInstanceOf(SwitchBlockContext);

    expect(ifCase.position).toEqual(new CodePosition(6, 15, 6, 5));
});

test("CodeParser parses a switch block correctly", () => {
    const module = isDiv2RecursiveProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    expect(switchBlock.cases.length).toBe(3);

    expect(switchBlock.cases[0]).toBeInstanceOf(IfCaseContext);
    expect(switchBlock.cases[0].values).toEqual(new Set([""]));

    expect(switchBlock.cases[1]).toBeInstanceOf(IfCaseContext);
    expect(switchBlock.cases[1].values).toEqual(new Set(["0"]));

    expect(switchBlock.cases[2]).toBeInstanceOf(IfCaseContext);
    expect(switchBlock.cases[2].values).toEqual(new Set(["1"]));

    expect(switchBlock.position).toEqual(new CodePosition(2, 21, 4, 1));
});

test("CodeParser parses a move command correctly", () => {
    const module = isDiv2IterativeProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const whileCase = switchBlock.cases[0] as WhileCaseContext;
    const moveCommand = whileCase.block.moveCommand!;

    expect(moveCommand.direction).toBe(Direction.RIGHT);
    expect(moveCommand.position).toEqual(new CodePosition(5, 6, 8, 18));
});

test("CodeParser parses a changeto command correctly", () => {
    const module = simpleProgram.modules[1];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const whileBlock = switchBlock.cases[0] as WhileCaseContext;
    const changeToCommand = whileBlock.block.changeToCommand!;

    expect(changeToCommand.value).toBe("b");
    expect(changeToCommand.position).toEqual(new CodePosition(8, 9, 8, 18));
});

test("CodeParser parses an accept command correctly", () => {
    const module = simpleProgram.modules[1];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const ifBlock = switchBlock.cases[1] as IfCaseContext;
    const basicBlock = ifBlock.blocks[0] as BasicBlockContext;
    const terminationCommand = basicBlock.flowCommand! as TerminationContext;

    expect(terminationCommand.state).toBe(TerminationState.ACCEPT);
    expect(terminationCommand.position).toEqual(new CodePosition(12, 13, 8, 14));
});

test("CodeParser parses a reject command correctly", () => {
    const module = isDiv2RecursiveProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const ifCase = switchBlock.cases[0] as IfCaseContext;
    const basicBlock = ifCase.blocks[0] as BasicBlockContext;
    const terminationCommand = basicBlock.flowCommand! as TerminationContext;
    
    expect(terminationCommand.state).toBe(TerminationState.REJECT);
    expect(terminationCommand.position).toEqual(new CodePosition(4, 5, 8, 14));
});

test("CodeParser parses a goto command correctly", () => {
    const module = isDiv2RecursiveProgram.modules[0];
    const switchBlock = module.blocks[0] as SwitchBlockContext;
    const ifCase = switchBlock.cases[1] as IfCaseContext;
    const nestedSwitchBlock = ifCase.blocks[1] as SwitchBlockContext;
    const nestedIfCase = nestedSwitchBlock.cases[1] as IfCaseContext;
    const basicBlock = nestedIfCase.blocks[0] as BasicBlockContext;
    const goToCommand = basicBlock.flowCommand! as GoToContext;

    expect(goToCommand.identifier).toBe("isDiv2");
    expect(goToCommand.position).toEqual(new CodePosition(10, 11, 12, 23));
});