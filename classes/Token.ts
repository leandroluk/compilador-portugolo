import { Symbols } from './Symbols';

export class Token {

    constructor(row: number, col: number, name: string, lexem?: string) {
        this._row = row;
        this._col = col;
        this._name = name;
        this._lexem = !!lexem ? lexem : new Symbols().lexem(name);
    }

    // getters & setters

    private _name: string;
    public get name(): string { return this._name; }
    public set name(v: string) { this._name = v; }

    private _lexem: string;
    public get lexem(): string { return this._lexem; }
    public set lexem(v: string) { this._lexem = v; }

    private _row: number;
    public get row(): number { return this._row; }
    public set row(v: number) { this._row = v; }

    private _col: number;
    public get col(): number { return this._col; }
    public set col(v: number) { this._col = v; }

    // method's

    /**
     * imprime o token
     */
    public print(): string {
        return `<${this.name}, "${this.lexem}">`;
    }

}
