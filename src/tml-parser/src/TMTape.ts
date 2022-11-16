import { Direction } from "./Context";

/**
 * The class `TMTape` is used to store an executing Turing machine tape.
 * 
 * The tape is infinite in both directions, and can be indexed using the method `TMTape.get(index)`. 
 * The value of the tapehead at a given point is given by `TMTape.get(0)`.
 * 
 * The Turing machine can perform 2 operations on the tape:
 * - change the value of the tapehead using the method `TMTape.change(letter)`
 * - move to the left (`TMTape.moveLeft()`) or to the right (`TMTape.moveRight()`)
 * 
 */
export class TMTape {
    // the map of all the present non-blank values
    private _valueMap:Map<number, string>;
    private _currentIndex:number;

    /**
     * Constructs a Turing machine tape for the given value
     * 
     * @param value the initial value of the tape
     */
    public constructor(value:string) {
        this._valueMap = new Map<number, string>();
        this._currentIndex = 0;

        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length != 0) {
                this._valueMap.set(i, value[i]);
            }
        }
    }

    /**
     * Changes the tapehead value into the given letter
     * 
     * @param letter the letter to change the tapehead value into
     */
    public change(letter:string):void {
        if (letter.trim().length == 0) {
            this._valueMap.delete(this._currentIndex);
        } else {
            this._valueMap.set(this._currentIndex, letter);
        }
    }

    /**
     * Moves the tapehead in the given direction.
     */
    public move(direction:Direction): void {
        switch (direction) {
            case Direction.LEFT:
                this._currentIndex --;
                break;
            default:
                this._currentIndex ++;
                break;
        }
    }
    
    /**
     * Gets the value on the tape at the given index.
     * 
     * @param i the index of the tape whose value is to be returned
     * @returns the value at the given index
     */
    public get(i:number): string {
        return this._valueMap.get(this._currentIndex+i) || "";
    }
}