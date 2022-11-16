import { Direction } from "../Context";
import { TMTape } from "../TMTape";

test("TMTape.get works for valid indices at the start", () => {
    const tape = new TMTape("abc");

    expect(tape.get(0)).toBe("a");
    expect(tape.get(1)).toBe("b");
    expect(tape.get(2)).toBe("c");
});

test("TMTape.get returns blank values for invalid indices", () => {
    const tape = new TMTape("abc");

    expect(tape.get(-2)).toBe("");
    expect(tape.get(-1)).toBe("");
    expect(tape.get(3)).toBe("");
    expect(tape.get(4)).toBe("");
});

test("TMTape.moveLeft moves left when the left entry is blank", () => {
    const tape = new TMTape("abc");
    tape.move(Direction.LEFT);
    
    expect(tape.get(0)).toBe("");
    expect(tape.get(1)).toBe("a");
    expect(tape.get(2)).toBe("b");
    expect(tape.get(3)).toBe("c");
});

test("TMTape.moveLeft moves left when the left entry is not blank", () => {
    const tape = new TMTape("abc");
    tape.move(Direction.RIGHT);
    tape.move(Direction.LEFT);
    
    expect(tape.get(0)).toBe("a");
    expect(tape.get(1)).toBe("b");
    expect(tape.get(2)).toBe("c");
});

test("TMTape.moveRight moves right when the right entry is blank", () => {
    const tape = new TMTape("abc");
    tape.move(Direction.RIGHT);
    tape.move(Direction.RIGHT);
    tape.move(Direction.RIGHT);

    expect(tape.get(-3)).toBe("a");
    expect(tape.get(-2)).toBe("b");
    expect(tape.get(-1)).toBe("c");
    expect(tape.get(0)).toBe("");
});

test("TMTape.moveRight moves right when the right entry is not blank", () => {
    const tape = new TMTape("abc");
    tape.move(Direction.RIGHT);
    
    expect(tape.get(-1)).toBe("a");
    expect(tape.get(0)).toBe("b");
    expect(tape.get(1)).toBe("c");
    expect(tape.get(2)).toBe("");
});

test("TMTape.change changes the tapehead value to a non-blank value", () => {
    const tape = new TMTape("abc");
    tape.move(Direction.LEFT);
    tape.change("x");
    
    expect(tape.get(0)).toBe("x");
    expect(tape.get(1)).toBe("a");
    expect(tape.get(2)).toBe("b");
    expect(tape.get(3)).toBe("c");
});

test("TMTape.change changes the tapehead value to blank", () => {
    const tape = new TMTape("abc");
    tape.change("");
    tape.move(Direction.RIGHT);
    
    expect(tape.get(0)).toBe("b");
    expect(tape.get(1)).toBe("c");
});