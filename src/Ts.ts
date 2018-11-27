import { Token } from "./Token";
import { Tag } from "./Tag";

export class Ts {

    private ts: { [key: string]: Token } = {}

    constructor(){
        this.ts[Tag.KW_ALGORITMO, 'ALGORITMO'];
        this.ts[Tag.KW_DECLARE, 'DECLARE'];
        this.ts[Tag.KW_INICIO, 'INICIO'];
        this.ts[Tag.KW_FIM, 'FIM'];
        this.ts[Tag.KW_SUBROTINA, 'SUBROTINA'];
        this.ts[Tag.KW_RETORNE, 'RETORNE'];
        this.ts[Tag.LOGICO, 'LOGICO'];
        this.ts[Tag.NUMERICO, 'NUMERICO'];
        this.ts[Tag.LITERAL, 'LITERAL'];
        this.ts[Tag.NULO, 'NULO'];
        this.ts[Tag.KW_SE, 'SE'];
        this.ts[Tag.KW_SENAO, 'SENAO'];
        this.ts[Tag.KW_ENQUANTO, 'ENQUANTO'];
        this.ts[Tag.KW_PARA, 'PARA'];
        this.ts[Tag.KW_ATE, 'ATE'];
        this.ts[Tag.KW_FACA, 'FACA'];
        this.ts[Tag.KW_REPITA, 'REPITA'];
        this.ts[Tag.KW_ESCREVA, 'ESCREVA'];
        this.ts[Tag.KW_LEIA, 'LEIA'];
        this.ts[Tag.KW_VERDADEIRO, 'VERDADEIRO'];
        this.ts[Tag.KW_FALSO, 'FALSO'];
        this.ts[Tag.KW_OU, 'OU'];
        this.ts[Tag.KW_E, 'E'];
        this.ts[Tag.KW_NAO, 'NAO'];
    }

    
    
}