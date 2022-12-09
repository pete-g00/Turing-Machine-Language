import { CodePosition } from "./CodePosition";

export class CodeError extends Error {
    public readonly position:CodePosition;

    public constructor(position:CodePosition, message:string) {
        super(message);
        this.position = position;
    }

    public toString() :string {
        return this.position.toString() + ": " + this.message;
    }
}