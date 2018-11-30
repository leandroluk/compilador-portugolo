import { Token } from "./token";
import { Tag } from "./tag";

export class Ts {

    private _ts: { [key: string]: Token } = {}

    constructor() {
        this._ts[Tag.ALGORITMO] = new Token(Tag.ALGORITMO, 'ALGORITMO');
        this._ts[Tag.DECLARE] = new Token(Tag.DECLARE, 'DECLARE');
        this._ts[Tag.INICIO] = new Token(Tag.INICIO, 'INICIO');
        this._ts[Tag.FIM] = new Token(Tag.FIM, 'FIM');
        this._ts[Tag.SUBROTINA] = new Token(Tag.SUBROTINA, 'SUBROTINA');
        this._ts[Tag.RETORNE] = new Token(Tag.RETORNE, 'RETORNE');
        this._ts[Tag.LOGICO] = new Token(Tag.LOGICO, 'LOGICO');
        this._ts[Tag.NUMERICO] = new Token(Tag.NUMERICO, 'NUMERICO');
        this._ts[Tag.LITERAL] = new Token(Tag.LITERAL, 'LITERAL');
        this._ts[Tag.NULO] = new Token(Tag.NULO, 'NULO');
        this._ts[Tag.SE] = new Token(Tag.SE, 'SE');
        this._ts[Tag.SENAO] = new Token(Tag.SENAO, 'SENAO');
        this._ts[Tag.ENQUANTO] = new Token(Tag.ENQUANTO, 'ENQUANTO');
        this._ts[Tag.PARA] = new Token(Tag.PARA, 'PARA');
        this._ts[Tag.ATE] = new Token(Tag.ATE, 'ATE');
        this._ts[Tag.FACA] = new Token(Tag.FACA, 'FACA');
        this._ts[Tag.REPITA] = new Token(Tag.REPITA, 'REPITA');
        this._ts[Tag.ESCREVA] = new Token(Tag.ESCREVA, 'ESCREVA');
        this._ts[Tag.LEIA] = new Token(Tag.LEIA, 'LEIA');
        this._ts[Tag.VERDADEIRO] = new Token(Tag.VERDADEIRO, 'VERDADEIRO');
        this._ts[Tag.FALSO] = new Token(Tag.FALSO, 'FALSO');
        this._ts[Tag.OU] = new Token(Tag.OU, 'OU');
        this._ts[Tag.E] = new Token(Tag.E, 'E');
        this._ts[Tag.NAO] = new Token(Tag.NAO, 'NAO');
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