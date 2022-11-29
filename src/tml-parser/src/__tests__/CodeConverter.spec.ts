import { CodeParser } from "../CodeParser";
import { CodeConverter } from "../CodeConverter";
import { TMChange } from "../TuringMachine";
import { Direction } from "../Context";

const singleModuleSingleBasicBlockNoGoto = `alphabet = {a, b}
module simple {
    changeto blank
    move right
}`;

const singleModuleMultipleBasicBlockWithGoto = `alphabet = {a, b}
module simple {
    move right
    changeto b
    move left
    goto simple
}`;

const singleModuleSingleIfCaseSingleIfBlock = `alphabet = {a, b}
module simple {
    switch tapehead {
        while a, b {
            move right
        } if blank {
            move left
            accept
        }
    }
}`;

const singleModuleMultipleIfCasesSingleIfBlock = `alphabet = {a, b}
module simple {
    switch tapehead {
        if blank {
            changeto b
            move left
            changeto blank
            move right
            changeto a
            move left
        } while a, b {
            changeto blank
            move right
        }
    }
}`;

const singleModuleMultipleIfCasesOneMultipleIfBlocks = `alphabet = {a, b}
module simple {
    switch tapehead {
        if a {
            move left
        } while b {
            move right
        } if blank {
            move right
            changeto b
            move left
            goto simple
        }
    }
}`;

const singleModuleMultipleIfCasesTwoMultipleIfBlocks = `alphabet = {a, b}
module simple {
    changeto blank
    switch tapehead {
        if a {
            move left
            changeto a
            move left
            reject
        } while b {
            move right
        } if blank {
            move right
            changeto b
            move right
            goto simple
        }
    }
}`;

const multipleModules = `alphabet = {a, b}
module simple {
    move right
    goto basic
} module basic {
    move left
    goto simple
}`;

test("CodeConverter can convert a single module with a single basic block and no goto", () => {
    const singleModuleSingleBasicBlockNoGotoParser = new CodeParser(singleModuleSingleBasicBlockNoGoto);
    const singleModuleSingleBasicBlockNoGotoProgram = singleModuleSingleBasicBlockNoGotoParser.parse();
    const codeConverter = new CodeConverter(singleModuleSingleBasicBlockNoGotoProgram);
    const singleModuleSingleBasicBlockNoGotoTM = codeConverter.convert();

    expect(singleModuleSingleBasicBlockNoGotoTM.initialState).toBe("simple0");
    expect(singleModuleSingleBasicBlockNoGotoTM.states.length).toBe(1);
    
    const state = singleModuleSingleBasicBlockNoGotoTM.getState("simple0")!;
    const change:TMChange = {
        nextState: "reject",
        direction: Direction.RIGHT,
        letter: ""
    };
    expect(state.transition("")).toEqual(change);
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
});

test("CodeConverter can convert a single module with multiple basic blocks and a goto statement", () => {
    const singleModuleMultipleBasicBlockWithGotoParser = new CodeParser(singleModuleMultipleBasicBlockWithGoto);
    const singleModuleMultipleBasicBlockWithGotoProgram = singleModuleMultipleBasicBlockWithGotoParser.parse();
    const codeConverter = new CodeConverter(singleModuleMultipleBasicBlockWithGotoProgram);
    const singleModuleMultipleBasicBlockWithGotoTM = codeConverter.convert();

    expect(singleModuleMultipleBasicBlockWithGotoTM.states.length).toBe(2);

    let state = singleModuleMultipleBasicBlockWithGotoTM.getState("simple0")!;
    let change:TMChange = {
        nextState: "simple1",
        direction: Direction.RIGHT,
        letter: ""
    };    
    expect(state.transition("")).toEqual(change);
    
    change.letter = "a";
    expect(state.transition("a")).toEqual(change);
    
    change.letter = "b";
    expect(state.transition("b")).toEqual(change);
    
    state = singleModuleMultipleBasicBlockWithGotoTM.getState("simple1")!;
    change = {
        nextState: "simple0",
        direction: Direction.LEFT,
        letter: "b"
    };
    expect(state.transition("")).toEqual(change);
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
});

test("CodeConverter can convert a single module with a switch block that has a single if case with a single basic block", () => {
    const singleModuleSingleIfCaseSingleIfBlockParser = new CodeParser(singleModuleSingleIfCaseSingleIfBlock);
    const singleModuleSingleIfCaseSingleIfBlockProgram = singleModuleSingleIfCaseSingleIfBlockParser.parse();
    const codeConverter = new CodeConverter(singleModuleSingleIfCaseSingleIfBlockProgram);
    const singleModuleSingleIfCaseSingleIfBlockTM = codeConverter.convert();

    expect(singleModuleSingleIfCaseSingleIfBlockTM.states.length).toBe(1);

    const state = singleModuleSingleIfCaseSingleIfBlockTM.getState("simple0")!;
    let change:TMChange = {
        nextState: "simple0",
        direction: Direction.RIGHT,
        letter: "a"
    };
    expect(state.transition("a")).toEqual(change);
    
    change.letter = "b";
    expect(state.transition("b")).toEqual(change);

    change = {
        nextState: "accept",
        direction: Direction.LEFT,
        letter: ""
    };
    expect(state.transition("")).toEqual(change);
});

test("CodeConverter can convert a single module with a switch block that has a single if case with a single basic block", () => {
    const singleModuleMultipleIfCasesSingleIfBlockParser = new CodeParser(singleModuleMultipleIfCasesSingleIfBlock);
    const singleModuleMultipleIfCasesSingleIfBlockProgram = singleModuleMultipleIfCasesSingleIfBlockParser.parse();
    const codeConverter = new CodeConverter(singleModuleMultipleIfCasesSingleIfBlockProgram);
    const singleModuleMultipleIfCasesSingleIfBlockTM = codeConverter.convert();

    expect(singleModuleMultipleIfCasesSingleIfBlockTM.states.length).toBe(3);

    let state = singleModuleMultipleIfCasesSingleIfBlockTM.getState("simple0")!;
    let change:TMChange = {
        nextState: "simple0",
        direction: Direction.RIGHT,
        letter: ""
    };
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);

    change = {
        nextState: "simple1",
        direction: Direction.LEFT,
        letter: "b"
    };
    expect(state.transition("")).toEqual(change);

    state = singleModuleMultipleIfCasesSingleIfBlockTM.getState("simple1")!;
    change = {
        nextState: "simple2",
        direction: Direction.RIGHT,
        letter: ""
    };
    expect(state.transition("")).toEqual(change);
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);

    state = singleModuleMultipleIfCasesSingleIfBlockTM.getState("simple2")!;
    change = {
        nextState: "reject",
        direction: Direction.LEFT,
        letter: "a"
    };
    expect(state.transition("")).toEqual(change);
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
});

test("CodeConverter can convert a single module with a switch block that has multiple if cases with one fo them having multiple basic blocks", () => {
    const singleModuleMultipleIfCasesOneMultipleIfBlocksParser = new CodeParser(singleModuleMultipleIfCasesOneMultipleIfBlocks);
    const singleModuleMultipleIfCasesOneMultipleIfBlocksProgram = singleModuleMultipleIfCasesOneMultipleIfBlocksParser.parse();
    const codeConverter = new CodeConverter(singleModuleMultipleIfCasesOneMultipleIfBlocksProgram);
    const singleModuleMultipleIfCasesOneMultipleIfBlocksTM = codeConverter.convert();

    expect(singleModuleMultipleIfCasesOneMultipleIfBlocksTM.states.length).toBe(2);

    let state = singleModuleMultipleIfCasesOneMultipleIfBlocksTM.getState("simple0")!;
    let change:TMChange = {
        nextState: "simple0",
        direction: Direction.RIGHT,
        letter: "b"
    };
    expect(state.transition("b")).toEqual(change);

    change = {
        nextState: "reject",
        direction: Direction.LEFT,
        letter: "a"
    };
    expect(state.transition("a")).toEqual(change); 
    
    change = {
        nextState: "simple1",
        direction: Direction.RIGHT,
        letter: ""
    };
    expect(state.transition("")).toEqual(change);

    state = singleModuleMultipleIfCasesOneMultipleIfBlocksTM.getState("simple1")!;
    change = {
        nextState: "simple0",
        direction: Direction.LEFT,
        letter: "b"
    };
    expect(state.transition("")).toEqual(change);
});

test("CodeConverter can convert a single module with a switch block that has multiple if cases with all of them having multiple basic blocks", () => {
    const singleModuleMultipleIfCasesTwoMultipleIfBlocksParser = new CodeParser(singleModuleMultipleIfCasesTwoMultipleIfBlocks);
    const singleModuleMultipleIfCasesTwoMultipleIfBlocksProgram = singleModuleMultipleIfCasesTwoMultipleIfBlocksParser.parse();
    const codeConverter = new CodeConverter(singleModuleMultipleIfCasesTwoMultipleIfBlocksProgram);
    const singleModuleMultipleIfCasesTwoMultipleIfBlocksTM = codeConverter.convert();

    expect(singleModuleMultipleIfCasesTwoMultipleIfBlocksTM.states.length).toBe(4);

    let state = singleModuleMultipleIfCasesTwoMultipleIfBlocksTM.getState("simple0")!;
    let change:TMChange = {
        nextState: "simple1",
        direction: Direction.LEFT,
        letter: ""
    };
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
    expect(state.transition("")).toEqual(change);
    
    state = singleModuleMultipleIfCasesTwoMultipleIfBlocksTM.getState("simple1")!;
    change = {
        nextState: "simple1",
        direction: Direction.RIGHT,
        letter: "b"
    };
    expect(state.transition("b")).toEqual(change);

    change = {
        nextState: "simple2",
        direction: Direction.LEFT,
        letter: "a"
    };
    expect(state.transition("a")).toEqual(change); 
    
    change = {
        nextState: "simple3",
        direction: Direction.RIGHT,
        letter: ""
    };
    expect(state.transition("")).toEqual(change);

    state = singleModuleMultipleIfCasesTwoMultipleIfBlocksTM.getState("simple2")!;
    change = {
        nextState: "reject",
        direction: Direction.LEFT,
        letter: "a"
    };
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
    expect(state.transition("")).toEqual(change);

    state = singleModuleMultipleIfCasesTwoMultipleIfBlocksTM.getState("simple3")!;
    change = {
        nextState: "simple0",
        direction: Direction.RIGHT,
        letter: "b"
    };
    expect(state.transition("a")).toEqual(change);
    expect(state.transition("b")).toEqual(change);
    expect(state.transition("")).toEqual(change);
});

test("CodeConverter can convert multiple modules", () => {
    const multipleModulesParser = new CodeParser(multipleModules);
    const multipleModulesProgram = multipleModulesParser.parse();
    const codeConverter = new CodeConverter(multipleModulesProgram);
    const multipleModulesTM = codeConverter.convert();

    expect(multipleModulesTM.initialState).toBe("simple0");
    expect(multipleModulesTM.states).toEqual(["simple0", "basic0"]);

    let state = multipleModulesTM.getState("simple0")!;
    let change:TMChange = {
        letter: "a",
        direction: Direction.RIGHT,
        nextState: "basic0"
    };
    expect(state.transition("a")).toEqual(change);

    state = multipleModulesTM.getState("basic0")!;
    change = {
        letter: "a",
        direction: Direction.LEFT,
        nextState: "simple0"
    };
    expect(state.transition("a")).toEqual(change);
});