/**
 * classe que contém os símbolos da linguagem (tags e palavras reservadas são todos considerados)
 * símbolos
 */
export class Symbols {

    /**
     * tabela de palavras reservadas
     */
    private list = {
        ALGORITMO: 'ALGORITMO', DECLARE: 'DECLARE', FIM: 'FIM', SUBROTINA: 'SUBROTINA',
        ABRE_PARENTESES: '(', FECHA_PARENTESES: ')', PONTO_VIRGULA: ';', VIRGULA: ',',
        RETORNE: 'RETORNE', LOGICO: 'LOGICO', NUMERICO: 'NUMERICO', LITERAL: 'LITERAL',
        NULO: 'NULO', SE: 'SE', INICIO: 'INICIO', ENQUANTO: 'ENQUANTO', PARA: 'PARA',
        ATE: 'ATE', FACA: 'FACA', REPITA: 'REPITA', ATRIBUI: '<--', ESCREVA: 'ESCREVA',
        LEIA: 'LEIA', TRUE: 'VERDADEIRO', FALSE: 'FALSO', OU: 'OU', E: 'E', MENOR_QUE: '<',
        MENOR_IGUAL_QUE: '<=', MAIOR_QUE: '>', MAIOR_IGUAL_QUE: '>=', IGUAL: '=',
        DIFERENTE: '<>', DIVISAO: '/', MULTIPLICACAO: '*', SUBTRACAO: '-', SOMA: '+',
        END_OF_FILE: 'EOF', ERR: ''
    };

    // method's

    /**
     * método de adicionar um novo lexema
     * @param {string} lexem 
     * @param {string} word 
     */
    public put(lexem: string, word: string): void {
        this.list[lexem] = word;
    }

    /**
     * método de retornar um token com base no lexema que for procurado
     * @param {string} lexem 
     */
    public token(lexem: string): string {
        return this.list.hasOwnProperty(lexem) ? this.list[lexem] : null;
    }

    /**
     * método de retornar um lexema com base no token que for procurado
     * @param {string} token 
     */
    public lexem(token: string): string {
        for (let key in this.list)
            if (this.list[key].toLowerCase() === token.toLowerCase())
                return this.list[key];
        return null;
    }

    /**
     * imprime a tabela de símbolos
     */
    public print(): string {
        return Object.keys(this.list)
            .map((key, index) => `posição ${index}: \t ${key}: "${this.list[key]}" \n`)
            .join('');
    }

}
