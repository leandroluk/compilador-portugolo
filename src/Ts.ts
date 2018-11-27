import { Token } from "./Token";
import { Tag } from "./Tag";

export class Ts {

    private ts: { [key: string]: Token } = {}

    constructor(){
        this.ts[Tag.KW_ALGORITMO] = new Token(Tag.KW_ALGORITMO, 'ALGORITMO');
        this.ts[Tag.KW_DECLARE] = new Token(Tag.KW_DECLARE, 'DECLARE');
        this.ts[Tag.KW_INICIO] = new Token(Tag.KW_INICIO, 'INICIO');
        this.ts[Tag.KW_FIM] = new Token(Tag.KW_FIM, 'FIM');
        this.ts[Tag.KW_SUBROTINA] = new Token(Tag.KW_SUBROTINA, 'SUBROTINA');
        this.ts[Tag.KW_RETORNE] = new Token(Tag.KW_RETORNE, 'RETORNE');
        this.ts[Tag.LOGICO] = new Token(Tag.LOGICO, 'LOGICO');
        this.ts[Tag.NUMERICO] = new Token(Tag.NUMERICO, 'NUMERICO');
        this.ts[Tag.LITERAL] = new Token(Tag.LITERAL, 'LITERAL');
        this.ts[Tag.NULO] = new Token(Tag.NULO, 'NULO');
        this.ts[Tag.KW_SE] = new Token(Tag.KW_SE, 'SE');
        this.ts[Tag.KW_SENAO] = new Token(Tag.KW_SENAO, 'SENAO');
        this.ts[Tag.KW_ENQUANTO] = new Token(Tag.KW_ENQUANTO, 'ENQUANTO');
        this.ts[Tag.KW_PARA] = new Token(Tag.KW_PARA, 'PARA');
        this.ts[Tag.KW_ATE] = new Token(Tag.KW_ATE, 'ATE');
        this.ts[Tag.KW_FACA] = new Token(Tag.KW_FACA, 'FACA');
        this.ts[Tag.KW_REPITA] = new Token(Tag.KW_REPITA, 'REPITA');
        this.ts[Tag.KW_ESCREVA] = new Token(Tag.KW_ESCREVA, 'ESCREVA');
        this.ts[Tag.KW_LEIA] = new Token(Tag.KW_LEIA, 'LEIA');
        this.ts[Tag.KW_VERDADEIRO] = new Token(Tag.KW_VERDADEIRO, 'VERDADEIRO');
        this.ts[Tag.KW_FALSO] = new Token(Tag.KW_FALSO, 'FALSO');
        this.ts[Tag.KW_OU] = new Token(Tag.KW_OU, 'OU');
        this.ts[Tag.KW_E] = new Token(Tag.KW_E, 'E');
        this.ts[Tag.KW_NAO] = new Token(Tag.KW_NAO, 'NAO');
    }

}