import { CodeParser } from "../CodeParser";
import { CodeValidator } from "../CodeValidator";

const goToValid = `alphabet = {a, b}
module a {
    move left
    goto b
}
module b {
    accept
}`;

const goToInvalid = `alphabet = {a, b}
module a {
    move left
    goto b
}`;

const goToRecursive = `alphabet = {a, b}
module a {
    move left
    goto a
}`;

const switchInvalid = `alphabet = {a, b}
module a {
    switch tapehead {
        if x {
            accept
        }
    }
}`;

const switchDuplicate = `alphabet = {a, b}
module a {
    switch tapehead {
        if a {
            accept
        } if a {
            reject
        }
    }
}`;

const switchIncomplete = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, blank {
            accept
        }
    }
}`;

const switchMissingBlank = `alphabet = {a, b}
module a {
    switch tapehead {
        if a {
            accept
        } if b {
            reject
        }
    }
}`;

const validSwitch = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, blank {
            accept
        } while b {
            changeto a
            move right
        }
    }
}`;

const nonFinalModuleFlow = `alphabet = {a, b}
module a {
    goto a
    move left
}`;

const finalModuleFlow = `alphabet = {a, b}
module a {
    move left
    move right
    reject
}`;

const noFlowModule = `alphabet = {a, b}
module a {
    move left
    move right
    changeto blank
}`;

const nonFinalIfFlow = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, b, blank {
            changeto b
            move left
            changeto a
            goto a
            move left
        }
    }
}`;

const finalIfFlow = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, b, blank {
            move left
            move right
            reject
        }
    }
}`;

const noFlowIf = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, b, blank {
            move left
            move right
            changeto blank
        }
    }
}`;

const changeToInvalid = `alphabet = {a, b}
module a {
    changeto x
}`;

const changeToBlank = `alphabet = {a, b}
module a {
    changeto blank
}`;

const changeToValid = `alphabet = {a, b}
module a {
    changeto b
}`;

const duplicateModules = `alphabet = {a, b}
module a {
    goto a
} 
module a {
    goto a
}`;

const nonFinalSwitchBlock = `alphabet = {a, b}
module a {
    switch tapehead {
        if a, b, blank {
            changeto blank
        }
    }
    accept
}`;

const moduleCalledAccept = `alphabet = {a, b}
module accept {
    move right
}`;

const moduleCalledReject = `alphabet = {a, b}
module reject {
    changeto blank
}`;

const firstIfBlockSwitch = `alphabet = {a, b}
module simple {
    switch tapehead {
        if a, b {
            switch tapehead {
                if a, b {
                    move right
                } if blank {
                    reject
                }
            }
        } if blank {
            reject
        }
    }
}`;

const validProgram = `alphabet = {0, 1}
module isDiv2 {
    switch tapehead {
        while 0, 1 {
            move right
        } if blank {
            move left
            switch tapehead {
                if 0 {
                    accept
                } if 1, blank {
                    reject
                }
            }
        }
    }
}`;

test("CodeValidator does not throw an error in a valid program with a goto command", () => {
    const goToValidParser = new CodeParser(goToValid);
    const goToValidProgram = goToValidParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(goToValidProgram);
    }).not.toThrow();
});

test("CodeValidator throws an error if there is an invalid goto reference", () => {
    const goToInvalidParser = new CodeParser(goToInvalid);
    const goToInvalidProgram = goToInvalidParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(goToInvalidProgram);
    }).toThrow(new Error(`Undefined module "b".`));
});

test("CodeValidator does not throw an error if there is a recursive goto reference", () => {
    const goToRecursiveParser = new CodeParser(goToRecursive);
    const goToRecursiveProgram = goToRecursiveParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(goToRecursiveProgram);
    }).not.toThrow();
});

test("CodeValidator throws an error if there is a switch case with a letter not present in the alphabet", () => {
    const switchInvalidParser = new CodeParser(switchInvalid);
    const switchInvalidProgram = switchInvalidParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(switchInvalidProgram);
    }).toThrow(new Error(`The letter "x" is not part of the alphabet.`));
});

test("CodeValidator throws an error if there are multiple switch cases applying to the same letter", () => {
    const switchDuplicateParser = new CodeParser(switchDuplicate);
    const switchDuplicateProgram = switchDuplicateParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(switchDuplicateProgram);
    }).toThrow(new Error(`Multiple cases present for letter "a".`));
});

test("CodeValidator throws an error if there is no switch case applying to a letter in the alphabet", () => {
    const switchIncompleteParser = new CodeParser(switchIncomplete);
    const switchIncompleteProgram = switchIncompleteParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(switchIncompleteProgram);
    }).toThrow(new Error(`The switch block doesn't have a case for each letter in the alphabet.`));
});

test("CodeValidator throws an error if there is no switch case applying to blank", () => {
    const switchMissingBlankParser = new CodeParser(switchMissingBlank);
    const switchMissingBlankProgram = switchMissingBlankParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(switchMissingBlankProgram);
    }).toThrow(new Error(`The switch block doesn't have a case for each letter in the alphabet.`));
});

test("CodeValidator doesn't throw an error for a valid switch block", () => {
    const validSwitchParser = new CodeParser(validSwitch);
    const validSwitchProgram = validSwitchParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(validSwitchProgram);
    }).not.toThrow();
});

// non-final module body block with flow command fails
test("CodeParser throws an error if the non-final block has a flow command", () => {
    const nonFinalModuleFlowParser = new CodeParser(nonFinalModuleFlow);
    const nonFinalModuleFlowProgram = nonFinalModuleFlowParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(nonFinalModuleFlowProgram);
    }).toThrow(new Error(`A non-final block in a sequence of blocks cannot have a flow command.`));
});

test("CodeParser doesn't throw an error if the final block has a flow command", () => {
    const finalModuleFlowParser = new CodeParser(finalModuleFlow);
    const finalModuleFlowProgram = finalModuleFlowParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(finalModuleFlowProgram);
    }).not.toThrow();
});

test("CodeParser doesn't throw an error if there are no flow commands present in a module", () => {
    const noFlowModuleParser = new CodeParser(noFlowModule);
    const noFlowModuleProgram = noFlowModuleParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(noFlowModuleProgram);
    }).not.toThrow();
});

test("CodeParser throws an error if a non-final if body block has a flow command", () => {
    const nonFinalIfFlowParser = new CodeParser(nonFinalIfFlow);
    const nonFinalIfFlowProgram = nonFinalIfFlowParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(nonFinalIfFlowProgram);
    }).toThrow(new Error(`A non-final block in a sequence of blocks cannot have a flow command.`));
});

test("CodeParser doesn't throw an error if the final if body block has a flow command", () => {
    const finalIfFlowParser = new CodeParser(finalIfFlow);
    const finalIfFlowProgram = finalIfFlowParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(finalIfFlowProgram);
    }).not.toThrow();
});

test("CodeParser doesn't throw an error if the if block has no flow command", () => {
    const noFlowIfParser = new CodeParser(noFlowIf);
    const noFlowIfProgram = noFlowIfParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(noFlowIfProgram);
    }).not.toThrow();
});

test("CodeParser throws an error for an invalid letter in a changeto command", () => {
    const changeToInvalidParser = new CodeParser(changeToInvalid);
    const changeToInvalidProgram = changeToInvalidParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(changeToInvalidProgram);
    }).toThrow(new Error(`The letter "x" is not part of the alphabet.`));
});

test("CodeParser doesn't throw an error for \"changeto blank\" command", () => {
    const changeToBlankParser = new CodeParser(changeToBlank);
    const changeToBlankProgram = changeToBlankParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(changeToBlankProgram);
    }).not.toThrow();
});

test("CodeParser doesn't throw an error for a changeto command with a valid letter from the alphabet", () => {
    const changeToValidParser = new CodeParser(changeToValid);
    const changeToValidProgram = changeToValidParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(changeToValidProgram);
    }).not.toThrow();
});

test("CodeValidator throws an error if there are two modules with the same name.", () => {
    const duplicateModulesParser = new CodeParser(duplicateModules);
    const duplicateModulesProgram = duplicateModulesParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(duplicateModulesProgram);
    }).toThrow(new Error(`Duplicate module with name "a".`));
});

test("CodeValidator throws an error if a switch block is not a final block", () => {
    const nonFinalSwitchBlockParser = new CodeParser(nonFinalSwitchBlock);
    const nonFinalSwitchBlockProgram = nonFinalSwitchBlockParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(nonFinalSwitchBlockProgram);
    }).toThrow(new Error(`A non-final block in a sequence of blocks cannot be a switch block.`));
});

test("CodeValidator throws an error if there is a module called accept", () => {
    const moduleCalledAcceptParser = new CodeParser(moduleCalledAccept);
    const moduleCalledAcceptProgram = moduleCalledAcceptParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(moduleCalledAcceptProgram);
    }).toThrow(new Error(`A module cannot be called "accept".`));
});

test("CodeValidator throws an error if there is a module called reject", () => {
    const moduleCalledRejectParser = new CodeParser(moduleCalledReject);
    const moduleCalledRejectProgram = moduleCalledRejectParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(moduleCalledRejectProgram);
    }).toThrow(new Error(`A module cannot be called "reject".`));
});

test("CodeValidator throws an error if the first block within an if block is a switch block", () => {
    const firstIfBlockSwitchParser = new CodeParser(firstIfBlockSwitch);
    const firstIfBlockSwitchProgram = firstIfBlockSwitchParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(firstIfBlockSwitchProgram);
    }).toThrow(new Error(`The first block within an if case cannot be a switch block.`));
});

test("CodeValidator doesn't throw an error in a valid program", () => {
    const validProgramParser = new CodeParser(validProgram);
    const validProgramProgram = validProgramParser.parse();
    const codeValidator = new CodeValidator();

    expect(() => {
        codeValidator.visit(validProgramProgram);
    }).not.toThrow();
});