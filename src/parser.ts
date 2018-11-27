import { Lexem } from "./lexem";
import { Token } from "./Token";
import { Tag } from "./Tag";

export class Parser {

    private readonly _lexem: Lexem;
    private _token: Token;
    private _errors: Error[];

    constructor(lexem: Lexem) {
        this._lexem = lexem;
        this._token = lexem.next();
    }

    public next(): void {
        this._token = this._lexem.next();
    }

    public eat(tag: Tag) {
        if (this._token.tag === tag) this.next();
        return this._token.tag === tag;
    }

    public buildErrorMessage(expect: string, token: Token) {
        return `[Erro sintático] ` +
            `Esperado "${expect}", ` +
            `Encontrado "${token.lexem}".`;
    }

    public handleError(message: string): void { 
    }

}