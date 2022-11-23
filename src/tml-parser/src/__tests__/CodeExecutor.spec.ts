import { Direction, IfCaseContext, SwitchBlockContext, TerminationState } from "../Context";
import { TMTape } from "../TMTape";
import { CodeParser } from "../CodeParser";
import { CodeExecutor } from "../CodeExecutor";

const palindrome = `alphabet = {a, b}
module palindrome {
    switch tapehead {
        if blank {
            accept
        } if a {
            changeto blank
            move right
            switch tapehead {
                while a, b {
                    move right
                } if blank {
                    move left
                    switch tapehead {
                        if a, blank {
                            changeto blank
                            move left
                            goto goToStart
                        } if b {
                            changeto blank
                            move left
                            move right
                        }
                    }
                }
            }
        } if b {
            changeto blank
            move right
            switch tapehead {
                while a, b {
                    move right
                } if blank {
                    move left
                    switch tapehead {
                        if b, blank {
                            changeto blank
                            move left
                            goto goToStart
                        } if a {
                            changeto blank
                            move left
                            move right
                            reject
                        }
                    }
                }
            }
        }
    }
}
module goToStart {
    switch tapehead {
        while a, b {
            move left
        } if blank {
            move right
            goto palindrome
        }
    }
}`;

const palindromeParser = new CodeParser(palindrome);
const palindromeProgram = palindromeParser.parse();

test("CodeExecutor throws an error if the tape is not valid for the program", () => {
    expect(() => {
        new CodeExecutor("11", palindromeProgram);
    }).toThrow(new Error("The tape is not valid for the given TM Program."));
});

test("CodeExecutor initialises the tape as expected", () => {
    const executor = new CodeExecutor("ab", palindromeProgram);
    const tape = new TMTape("ab");

    const firstBlock = palindromeProgram.modules[0].blocks[0] as SwitchBlockContext;

    expect(executor.currentBlock).toBe(firstBlock);
    expect(executor.tape).toEqual(tape);
});

test("CodeExecutor executes the tape correctly", () => {
    const executor = new CodeExecutor("ab", palindromeProgram);
    const tape = new TMTape("ab");

    const firstBlock = palindromeProgram.modules[0].blocks[0] as SwitchBlockContext;
    const firstIfBlock = firstBlock.cases[1] as IfCaseContext;
    const secondBlock = firstIfBlock.blocks[1] as SwitchBlockContext;
    const secondIfBlock = secondBlock.cases[1] as IfCaseContext;
    const thirdBlock = secondIfBlock.blocks[1] as SwitchBlockContext;
    const thirdIfBlock = thirdBlock.cases[1] as IfCaseContext;
    const fourthBlock = thirdIfBlock.blocks[1];
    
    expect(executor.execute()).toBe(true);
    expect(executor.currentBlock).toBe(secondBlock);
    tape.change("");
    tape.move(Direction.RIGHT);
    expect(executor.tape).toEqual(tape);

    expect(executor.execute()).toBe(true);
    expect(executor.currentBlock).toBe(secondBlock);
    tape.move(Direction.RIGHT);
    expect(executor.tape).toEqual(tape);

    expect(executor.execute()).toBe(true);
    expect(executor.currentBlock).toBe(thirdBlock);
    tape.move(Direction.LEFT);
    expect(executor.tape).toEqual(tape);

    expect(executor.execute()).toBe(true);
    expect(executor.currentBlock).toBe(fourthBlock);
    tape.change("");
    tape.move(Direction.LEFT);
    expect(executor.tape).toEqual(tape);

    expect(executor.execute()).toBe(true);
    expect(executor.currentBlock).toBeUndefined();
    tape.move(Direction.RIGHT);
    expect(executor.tape).toEqual(tape);
});

test("CodeExecutor terminates with the correct reject status", () => {
    const executor = new CodeExecutor("ab", palindromeProgram);
    
    while (executor.execute()) {
        continue;
    }

    expect(executor.execute()).toBe(false);
    expect(executor.terminationStatus).toBe(TerminationState.REJECT);
});

test("CodeExecutor terminates with the correct accept status", () => {
    const executor = new CodeExecutor("aba", palindromeProgram);
    
    while (executor.execute()) {
        continue;
    }

    expect(executor.execute()).toBe(false);
    expect(executor.terminationStatus).toBe(TerminationState.ACCEPT);
});