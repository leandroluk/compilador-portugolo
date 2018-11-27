import { Tag } from './tag';

export class Token {

    constructor(tag: Tag, lexem: string, row: number = 0, col: number = 0) {
        this.tag = tag;
        this.lexem = lexem;
        this.row = row;
        this.col = col;
    }

    // getters & setters

    private _tag: Tag;
    public get tag(): Tag { return this._tag }
    public set tag(v: Tag) { this._tag = v }

    private _lexem: string;
    public get lexem(): string { return this._lexem }
    public set lexem(v: string) { this._lexem = v }

    private _row: number;
    public get row(): number { return this._row }
    public set row(v: number) { this._row = v }

    private _col: number;
    public get col(): number { return this._col }
    public set col(v: number) { this._col = v }

    // method's

    /**
     * imprime o token
     */
    public toString(): string {
        return `<${this.tag}, "${this.lexem}">,\tlinha: ${this.row}, coluna: ${this.col}`;
    }

}
