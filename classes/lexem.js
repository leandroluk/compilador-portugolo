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
   * leitura do arquivo após a criação da classe
   */
  this.file = fs.readFileSync(filepath).toString().split('');

  this.throw = message =>
    console.error(`[Erro léxico]: ${message} \t linha: ${this.row}, coluna: ${this.col}\n`) &&
    process.exit(1);

  /**
   * retorna o próximo token
   */
  this.next = () => {
    let state = 0;
    let symbols = new Symbols();
    let c = null;
    let temp = '';

    while (!0) {

      /**
       * verifica se chegou no final do arquivo
       */
      if (this.file.length == this.buffer) {
        return new Token(symbols.list.END_OF_FILE, this.row, this.col);
      }
      /**
       * se não está no final do arquivo, 
       */
      else {
        c = this.file[this.buffer];
        this.buffer++;
      }

      switch (state) {
        case 0:

          temp = '';

          /**
           * q0
           * caracteres que devem ser ignorados
           */
          if (c === ' ' | c === '\r' | c === '\n' | c === '\t') {
            state = 0;
            /**
             * adiciona uma linha
             */
            if (c === '\n') {
              this.row++;
              this.col = 1;
            }
            /**
             * se tiver tabulação, aumente 3 nas colunas
             */
            else if (c === '\t') {
              this.col += 3;
            }
            /**
             * se for espaço ou \r
             */
            else {
              this.col++;
            }
          }

          /**
           * q1
           * multiplicação
           */
          else if (c === '*') {
            state = 0;
            this.col++;
            return new Token(symbols.list.MULTIPLICACAO, this.row, this.col);
          }

          /**
           * q2
           * soma
           */
          else if (c === '+') {
            state = 0;
            this.col++;
            return new Token(symbols.list.SOMA, this.row, this.col);
          }

          /**
           * q3
           * subtração
           */
          else if (c === '-') {
            state = 0;
            this.col++;
            return new Token(symbols.list.SUBTRACAO, this.row, this.col);
          }

          /**
           * q4
           * igualdade
           */
          else if (c === '=') {
            state = 0;
            this.col++;
            return new Token(symbols.list.IGUAL, this.row, this.col);
          }

          /**
           * q5
           * abre parenteses
           */
          else if (c === '(') {
            state = 0;
            this.col++;
            return new Token(symbols.list.ABRE_PARENTESES, this.row, this.col);
          }

          /**
           * q6
           * fecha parenteses
           */
          else if (c === ')') {
            state = 0;
            this.col++;
            return new Token(symbols.list.FECHA_PARENTESES, this.row, this.col);
          }

          /**
           * q7
           * aspas duplas
           */
          else if (c === '"') {
            state = 8;
            this.col++;
          }

          /**
           * q10
           * vírgula
           */
          else if (c === ',') {
            state = 0;
            this.col++;
            return new Token(symbols.list.VIRGULA, this.row, this.col);
          }

          /**
           * q11
           * ponto e vírgula
           */
          else if (c === ';') {
            state = 0;
            this.col++;
            return new Token(symbols.list.PONTO_VIRGULA, this.row, this.col);
          }

          /**
           * q12
           * maior que | maior ou igual que
           */
          else if (c === '>') {
            state = 12;
            this.col++;
          }

          /**
           * q15
           * menor que | menor ou igual que
           */
          else if (c === '<') {
            state = 15;
            this.col++;
          }

          /**
           * q21
           * digito
           */
          else if (/[0-9]/.test(c)) {
            state = 21;
            temp += c;
            this.col++;
          }

          /**
           * q26
           * é um carater
           */
          else if (/[a-zA-Z]/.test(c)) {
            state = 26;
            temp += c;
            this.col++;
          }

          /**
           * q28
           * divisão | comentario simples | comentario de muitas linhas
           */
          else if (c === '/') {
            state = 28;
            this.col++;
          }

          /**
           * volta pro loop
           */
          break;

          /**
           * q7 => q8
           * aspas simples => caracter ASCII
           */
        case 8:
          this.col++;

          /**
           * tratamento para quebra de linha após uma aspas duplas
           */
          if (c === '\n') {
            this.throw('Não é permitido quebra de linha após uma aspas duplas');
          }

          /**
           * q9
           * se for outra aspas finaliza
           */
          if (c === '"') {
            state = 0;
            return new Token(symbols.list.LITERAL, this.row, this.col);
          }
          /**
           * se não for um caracter ASCII tem que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('o caracter informado não é um caracter ASCII válido');
          }

          /**
           * volta pro loop
           */
          break;

          /**
           * q0 => q12
           * tratamento iniciando com "maior que"
           */
        case 12:
          this.col++;
          state = 0;
          /**
           * q14
           * maior ou igual que
           */
          if (c === '=') {
            return new Token(symbols.list.MAIOR_IGUAL_QUE, this.row, this.col);
          }
          /**
           * q13
           * outro
           */
          else {
            return new Token(symbols.list.MAIOR_QUE, this.row, this.col);
          }
          /**
           * q0 => q11
           * tratamento iniciando com "menor que"
           */
        case 15:
          this.col++;
          /**
           * q19
           * inicio de verificacao para atribuicao
           */
          if (c === '-') {
            state = 19;
          } else {
            state = 0;
            /**
             * q16
             * diferente que
             */
            if (c === '>') {
              return new Token(symbols.list.DIFERENTE, this.row, this.col);
            }
            /**
             * q18
             * maior ou igual que
             */
            else if (c === '=') {
              return new Token(symbols.list.MAIOR_IGUAL_QUE, this.row, this.col);
            }
            /**
             * q17
             * menor que
             */
            else {
              return new Token(symbols.list.MENOR_QUE, this.row, this.col);
            }
          }
          break;
          /**
           * q15 => q19
           * segunda verificacao para atribuição
           */
        case 19:
          this.col++;

          /**
           * caso nao seja uma atribuição
           */
          if (c !== '-') {
            this.throw('Era esperado um símbolo de menor que para criar uma atribuição de variável');
          }

          /**
           * q20
           * se não for uma atribuição mostre erro
           */
          state = 0;
          return new Token(symbols.list.ATRIBUI, this.row, this.col);

          /**
           * q0 => q21
           * verificao se é digito
           */
        case 21:
          this.col++;
          temp += c;
          /**
           * q22
           * caso seja ponto 
           */
          if (c === '.') {
            state = 22;
          }

          /**
           * q25
           * caso seja  qualquer coisa diferente de numero
           */
          else if (!/[0-9]/.test()) {
            state = 0;
            let n = new Token(symbols.list.NUMERICO, this.row, this.col);
            n.lexem = temp;
            return n;
          }
          break;

          /**
           * q21 => q22
           */
        case 22:
          this.col++;
          temp += c;

          if (!/[0-9]/.test()) {
            this.throw("O caracter encontrado não é do tipo NUMERICO")
          }

          /**
           * q23
           * segunda parte do ponto flutuante
           */
          state = 23;

          break;

          /**
           * q22 => q23
           * segunda parte do ponto
           */
        case 23:
          this.col++;
          temp += c;

          /**
           * q24
           */
          if (!/[0-9]/.test()) {
            state = 0;
            let n = new Token(symbols.list.NUMERICO, this.row, this.col);
            n.lexem = temp;
            return n;
          }

          break;

          /**
           * q0 => q26
           * literal
           */
        case 26:
          this.col++;
          temp += c;

          /**
           * q27
           * retorna ou uma palavra reservada KW ou um ID
           */
          if (!/[a-zA-Z0-9]/.test()) {
            state = 0;
            let n = new Token(null, this.row, this.col);
            n.name = !!symbols.getLexem(temp) ? "KW" : "ID";
            n.lexem = temp;
            return n;
          }

          break;
          /**
           * q0 => q28
           */
        case 28:
          this.col++;
          /**
           * q30
           * comentario de 1 linha
           */
          if (c === '/') {
            state = 30;
          }
          /**
           * q31
           * comentario de múltiplas linhas
           */
          else if (c === '*') {
            state = 31;
          }
          /**
           * q29
           * divisão
           */
          else {
            state = 0;
            return new Token(symbols.list.DIVISAO, this.row, this.col);
          }
          break;
          /**
           * q28 => q30
           * leitura de qualquer caracter no comentario de 1 linha
           */
        case 30:
          this.col++;
          /**
           * q0
           * acaba o comentario e volta pro inicio
           */
          if (c === '\n') {
            state = 0;
          }
          /**
           * caso use uma tabulação dentro dos comentarios deve-se respeitar a regra
           * da linguagem
           */
          else if (c === '\t') {
            this.col += 2;
          }
          /**
           * se não for ASCII te que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('O caracter não é um ASCII válido');
          }
          break;
        case 31:
          this.col++;
          /**
           * se for tabulação tem que respeitar a linguagem
           */
          if (c === '\t') {
            this.col += 2;
          }
          /**
           * q32
           * possivel finalizacao
           */
          else if (c === '*') {
            state = 32;
          }
          /**
           * se não for ASCII tem que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('O caracter não é um ASCII válido');
          }
          break;
      }
    }
  };
};
module.exports = Lexem;