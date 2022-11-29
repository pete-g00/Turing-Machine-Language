import { CodePosition } from "./CodePosition";

/**
 * A class to represent wrapper for code.
 * 
 * Allows a word to be retrieved from code one by one, ignoring any whitespace.
 */
export class CodeWrapper {
    
    /**
     * The code provided.
     */
    public readonly code:string;
    
    /**
     * The current line number in code being read.
     * 
     * The current code selection starts at the given line.
     */
    private _lineNumber:number;

    /**
     * The index of the first column at the current line.
     */
    private _colOffset:number;

    /**
     * The starting column index of the current code selection. 
     * 
     * The current code selection starts at the start index.
     */
    private _startIndex:number;
    
    /**
     * The ending column index of the current code selection. 
     * 
     * The current code selection finishes one index before the end index.
     */
    private _endIndex:number;
    
    /**
     * Whether the code wrapper has been initialised.
     */
    private _notMoved:boolean;

    /**
     * Whether all the code has already been read.
     */
    private _isCodeRead:boolean;
    
    /**
     * The non-whitespace delimiters that are allowed in code.
     */
    private _delimiters = [",", "{", "}", "="];
    
    /**
     * Creates a CodeWrapper instance for the given code.
     * 
     * @param code The code to be wrapped
     */
    public constructor(code:string) {
        this.code = code;

        this._lineNumber = 0;
        this._colOffset = 0;
        this._startIndex = 0;
        this._endIndex = 0;
        this._notMoved = true;
        this._isCodeRead = false;
    }

    /**
     * 
     * @returns whether the character at `code[index]` is whitespace
     */
    private _isCharWhitespace(index:number):boolean {
        return this.code[index].trim().length === 0;
    }

    /**
     * 
     * @returns whether the character at `code[index]` is whitespace or delimiter
     */
    private _isCharDelimiter(index:number):boolean {
        return this._isCharWhitespace(index) || 
            this._delimiters.includes(this.code[index]);
    }

    /**
     * Computes the next col start position from the current position
     */
    private get _nextStartCol():number {
        let nextStart = this._endIndex;

        while (nextStart < this.code.length && this._isCharWhitespace(nextStart)) {
            // if newline, increment the line number and the column offset
            if (this.code[nextStart] === "\n") {
                this._lineNumber ++;
                this._colOffset = nextStart+1;
            }
            
            nextStart ++;
        }
        
        return nextStart;
    }

    /**
     * Computes the col end position from the current start position
     */
    private get _nextEndCol():number {
        // if the char is a delimiter then it finishes at the next index
        if (this._delimiters.includes(this.code[this._startIndex])) {
            return this._startIndex + 1;
        }
        
        // otherwise, find the next end index- the next delimiter (whitespace character OR "," OR "{" OR "}") OR EOF
        let nextEnd = this._startIndex + 1;
        while (nextEnd < this.code.length && !this._isCharDelimiter(nextEnd)) {
            nextEnd ++;
        }

        return nextEnd;
    }

    /**
     * Tries moving the code to the next non-blank value.
     * 
     * @returns true if could move to the next non-blank value; false if reached the end of code
     */
    public moveNext():boolean {
        if (this._isCodeRead) {
            return false;
        }

        if (this._notMoved) {
            this._notMoved = false;
        }
        
        const nextStart = this._nextStartCol;
        
        // if start index is beyond the length of the code, the code has been read
        if (nextStart >= this.code.length) {
            this._isCodeRead = true;
            return false;
        }
        this._startIndex = nextStart;

        this._endIndex = this._nextEndCol;

        return true;   
    }

    /**
     * @returns the current value of the code
     * 
     * @throws error if there is no value present, i.e. we have ended up at the end of the file.
     */
    public get currentValue():string {
        if (this._notMoved) {
            throw new Error("No current value.");
        }

        return this.code.substring(this._startIndex, this._endIndex);
    }

    /**
     * @returns the current position in code.
     * 
     * @throws error if the code has been read completely or not started yet.
     */
    public get currentPosition(): CodePosition {
        if (this._notMoved) {
            throw new Error("No current position.");
        }
        
        return new CodePosition(
            this._lineNumber, 
            this._lineNumber+1, 
            this._startIndex-this._colOffset, 
            this._endIndex-this._colOffset
        );
    }
}