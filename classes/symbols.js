/**
 * classe que contém os símbolos da linguagem (tags e palavras reservadas são todos considerados)
 * símbolos
 */
const Symbols = function () {

    /**
     * tabela de palavras reservadas
     */
    this.list = {
        ALGORITMO: 'ALGORITMO',
        DECLARE: 'DECLARE',
        FIM: 'FIM',
        SUBROTINA: 'SUBROTINA',
        ABRE_PARENTESES: '(',
        FECHA_PARENTESES: ')',
        PONTO_VIRGULA: ';',
        VIRGULA: ',',
        RETORNE: 'RETORNE',
        LOGICO: 'LOGICO',
        NUMERICO: 'NUMERICO',
        LITERAL: 'LITERAL',
        NULO: 'NULO',
        SE: 'SE',
        INICIO: 'INICIO',
        ENQUANTO: 'ENQUANTO',
        PARA: 'PARA',
        ATE: 'ATE',
        FACA: 'FACA',
        REPITA: 'REPITA',
        ATRIBUI: '<--',
        ESCREVA: 'ESCREVA',
        LEIA: 'LEIA',
        TRUE: 'verdadeiro',
        FALSE: 'falso',
        OU: 'OU',
        E: 'E',
        MENOR_QUE: '<',
        MENOR_IGUAL_QUE: '<=',
        MAIOR_QUE: '>',
        MAIOR_IGUAL_QUE: '>=',
        IGUAL: '=',
        DIFERENTE: '<>',
        DIVISAO: '/',
        MULTIPLICACAO: '*',
        SUBTRACAO: '-',
        SOMA: '+',
        END_OF_FILE: 'EOF',
    };

    /**
     * método de adicionar um novo lexema
     * @param {string} lexem 
     * @param {string} word 
     */
    this.put = (lexem, word) => this.list[lexem] = word;

    /**
     * método de retornar um token com base no lexema que for procurado
     * @param {string} lexem 
     */
    this.getToken = (lexem) => this.list.hasOwnProperty(lexem) ? this.list[lexem] : null;

    /**
     * método de retornar um lexema com base no token que for procurado
     * @param {string} token 
     */
    this.getLexem = (token) => Object.keys(this.list).find(key => this.list[key] === token);

    /**
     * imprime a tabela de símbolos
     */
    this.print = () => Object.keys(this.list)
        .map((key, index) => `posição ${index}: \t ${key}: "${this.list[key]}" \n`)
        .join('');
};

/**
 * expõe a classe como pública
 */
module.exports = Symbols;