import { Token } from "./Token";
import { Tag } from "./Tag";

export class Ts {

    private _ts: { [key: string]: Token } = {}

    constructor() {
        this._ts[Tag.KW_ALGORITMO] = new Token(Tag.KW_ALGORITMO, 'ALGORITMO');
        this._ts[Tag.KW_DECLARE] = new Token(Tag.KW_DECLARE, 'DECLARE');
        this._ts[Tag.KW_INICIO] = new Token(Tag.KW_INICIO, 'INICIO');
        this._ts[Tag.KW_FIM] = new Token(Tag.KW_FIM, 'FIM');
        this._ts[Tag.KW_SUBROTINA] = new Token(Tag.KW_SUBROTINA, 'SUBROTINA');
        this._ts[Tag.KW_RETORNE] = new Token(Tag.KW_RETORNE, 'RETORNE');
        this._ts[Tag.LOGICO] = new Token(Tag.LOGICO, 'LOGICO');
        this._ts[Tag.NUMERICO] = new Token(Tag.NUMERICO, 'NUMERICO');
        this._ts[Tag.LITERAL] = new Token(Tag.LITERAL, 'LITERAL');
        this._ts[Tag.NULO] = new Token(Tag.NULO, 'NULO');
        this._ts[Tag.KW_SE] = new Token(Tag.KW_SE, 'SE');
        this._ts[Tag.KW_SENAO] = new Token(Tag.KW_SENAO, 'SENAO');
        this._ts[Tag.KW_ENQUANTO] = new Token(Tag.KW_ENQUANTO, 'ENQUANTO');
        this._ts[Tag.KW_PARA] = new Token(Tag.KW_PARA, 'PARA');
        this._ts[Tag.KW_ATE] = new Token(Tag.KW_ATE, 'ATE');
        this._ts[Tag.KW_FACA] = new Token(Tag.KW_FACA, 'FACA');
        this._ts[Tag.KW_REPITA] = new Token(Tag.KW_REPITA, 'REPITA');
        this._ts[Tag.KW_ESCREVA] = new Token(Tag.KW_ESCREVA, 'ESCREVA');
        this._ts[Tag.KW_LEIA] = new Token(Tag.KW_LEIA, 'LEIA');
        this._ts[Tag.KW_VERDADEIRO] = new Token(Tag.KW_VERDADEIRO, 'VERDADEIRO');
        this._ts[Tag.KW_FALSO] = new Token(Tag.KW_FALSO, 'FALSO');
        this._ts[Tag.KW_OU] = new Token(Tag.KW_OU, 'OU');
        this._ts[Tag.KW_E] = new Token(Tag.KW_E, 'E');
        this._ts[Tag.KW_NAO] = new Token(Tag.KW_NAO, 'NAO');
    }

    public put(tag: Tag, token: Token): void {
        this._ts[tag] = token;
    }

    public get(lexem: string): Token {

        let token: Token = null;

        for (let i in this._ts) {
            if (this._ts[i].lexem.toLowerCase() === lexem.toLowerCase()) {
                token = this._ts[i];
            }
        }

        return token;

    }

    public toString() {

        const tsKeys = Object.keys(this._ts);

        let result: string = '';

        for (let i: 0; i < tsKeys.length; i++) {
            result += `posição ${i + 1}:\t ${this._ts[tsKeys[i]].toString()}\n`;
        }

        return result;

    }

    public toConsole() {
        console.log("\nTabelas de Símbolos da linguagem Portugolo:\n===========================================\n");
        console.log(`${this.toString()}\n`)
    }

}