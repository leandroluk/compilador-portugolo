/**
 * importação das dependências da classe
 */
const fs = require('fs');

const Token = require('./token');
const Symbols = require('./symbols');

/**
 * classe que
 * @param {string} filepath
 */
const Lexem = function (filepath) {

  /**
   * verifica se foi passado um arquivo e se o mesmo existe
   */
  if (!filepath || !fs.existsSync(filepath))
    throw new Error('é necessário informar o nome do arquivo');

  /**
   * define o ponto de iteração do loop de leitura dos caracteres do arquivo
   */
  this.buffer = 0;
  this.col = 1;
  this.row = 1;

  /**
   * armazena o último caracter lido no arquivo
   */
  this.this.lookahead = 0;

  /**
   * leitura do arquivo após a criação da classe
   */
  this.file = fs
    .readFileSync(filepath)
    .toString()
    .split('');

  this.throw = message => {
    console.error(`[Erro léxico]: ${message} \n`);
    process.exit(1);
  };

  /**
   * retorna o próximo token
   */
  this.next = () => {
    let state = 0;
    let symbols = new Symbols();
    let c = undefined;

    while (!0) {

      if (this.file.length == 0)
        return new Token(symbols.list.END_OF_FILE, this.row, this.col);
      else {
        this.buffer++;
        c = this.file.shift();
      }

      switch (state) {
        case 0:

          /**
           * caracteres que devem ser ignorados
           */
          if (c === ' ' || c === '\r') {
            state = 0;
            this.col++;
          }
          /**
           * adiciona uma linha
           */
          else if (c === '\n') {
            state = 0;
            this.row++;
            this.col = 1;
          }

          /**
           * se tiver tabulação, aumente 3 nas colunas
           */
          else if (c === '\t') {
            state = 0;
            this.col += 3;
          }
          /**
           * é um carater
           */
          else if (/[a-zA-Z]/.test(c)) {
            state = 26;
          }
          /**
           * multiplicação
           */
          else if (c === '*') {
            state = 0;
            this.col++;
            return new Token(symbols.list.MULTIPLICACAO, row, col);
          }
          /**
           * soma
           */
          else if (c === '+') {
            state = 0;
            this.col++;
            return new Token(symbols.list.SOMA, row, col);
          }
          /**
           * subtração
           */
          else if (c === '-') {
            state = 0;
            this.col++;
            return new Token(symbols.list.SUBTRACAO, row, col);
          }
          /**
           * igualdade
           */
          else if (c === '=') {
            state = 0;
            this.col++;
            return new Token(symbols.list.IGUAL, row, col);
          }
          /**
           * abre parenteses
           */
          else if (c === '(') {
            state = 0;
            this.col++;
            return new Token(symbols.list.ABRE_PARENTESES, row, col);
          }
          /**
           * fecha parenteses
           */
          else if (c === ')') {
            state = 0;
            this.col++;
            return new Token(symbols.list.FECHA_PARENTESES, row, col);
          } 
          /**
           * ve se é aspas duplas
           */
          else if (c === '"') {
            state = 8;
          } 
          /**
           * 
           */
          else if (c === ',') {
            //estado 10
            state = 0;
            this.col++;
            return new Token(symbols.list.VIRGULA, row, col);
          } else if (c === ';') {
            //estado 11
            state = 0;
            this.col++;
            return new Token(symbols.list.PONTO_VIRGULA, row, col);
          } else if (c === '>') {
            state = 12;
          } else if (c === '<') {
            state = 16;
          } else if (typeof c === 'number') {
            state = 21;
          } else if (c === '/') {
            state = 28;
          }
          break;
        case 8:
          ///
          break;
        case 12:
          if (c === '=') {
            state = 0;
            this.col++;
            return new Token(symbols.list.MAIOR_IGUAL_QUE, row, col);
          } else {
            state = 0;
            this.col++;
            return new Token(symbols.list.MAIOR_QUE, row, col);
          }
          break;
        case 16:
          ///
          break;
        case 21:
          ///
          break;
        case 26:
          ///
          break;
      }
    }
  };
};
module.exports = Lexem;