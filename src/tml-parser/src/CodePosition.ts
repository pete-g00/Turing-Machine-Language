/**
 * The class `CodePosition` is used to represent a portion of the code. It lists the following:
 * - the start line number of the code selection `startLineNumber` (inclusive the code position),
 * - the end line number of the code selection `endLineNumber` (excluding the code position),
 * - the start column of the code selection `startColNumber` (including the code position), and
 * - the end column of the code selection `endColNumber` (excluding the code position).
 *
 * All the indices use 0-based indexing, but the `toString` function uses 1-based indexing.
 *
 */
export class CodePosition {
  /**
   * The initial line number in the code. The given number is the start of the code selection
   *
   * Uses 0-based indexing.
   *
   */
  public readonly startLineNumber: number;

  /**
   * The final line number in the code. The given number is just after the end of the code selection.
   *
   * Uses 0-based indexing.
   *
   */
  public readonly endLineNumber: number;

  /**
   * The initial column number in the code. The given number is the start of the code selection
   *
   * Uses 0-based indexing.
   *
   */
  public readonly startColNumber: number;

  /**
   * The final column number in the code. The given number is just after the end of the code selection.
   *
   * Uses 0-based indexing.
   */
  public readonly endColNumber: number;

  /**
   * Constructs a `CodePosition` instance given the values
   *
   * @param startLineNumber the starting line number in code selection
   * @param endLineNumber the final line number in code selection
   * @param startColNumber the starting column number in code selection
   * @param endColNumber the final column number in code selection
   */
  constructor(
    startLineNumber: number,
    endLineNumber: number,
    startColNumber: number,
    endColNumber: number
  ) {
    this.startLineNumber = startLineNumber;
    this.endLineNumber = endLineNumber;
    this.startColNumber = startColNumber;
    this.endColNumber = endColNumber;
  }

  /**
   * Converts the `CodePosition` object into string format representing the current line and column
   *
   *
   * @returns a string representation of the line and column number of the code selection, using 1-based indexing.
   */
  public toString(): string {
    return `Ln ${this.startLineNumber + 1}:${this.endLineNumber + 1}, Col ${
      this.startColNumber + 1
    }:${this.endColNumber + 1}`;
  }

  /**
   * Combines two positions so that the final position starts at the start of the starting position and finishes at the end of the ending position.
   *
   * @param startPosition the initial code position
   * @param endPosition the final code position
   *
   * @returns the combined code position, from the start position to the end position
   */
  public static combine(
    startPosition: CodePosition,
    endPosition: CodePosition
  ): CodePosition {
    return new CodePosition(
      startPosition.startLineNumber,
      endPosition.endLineNumber,
      startPosition.startColNumber,
      endPosition.endColNumber
    );
  }
}
