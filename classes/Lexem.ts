import fs from 'fs';

import { Token } from './token';
import { Symbols } from './symbols';

/**
 * classe que faz a validação léxica
 * @param {string} filepath
 */
export class Lexem {

  private _buffer: number;
  private _state: number;
  private _col: number;
  private _row: number;
  private _filepath: string;
  private _file: string[];
  private _isValid: boolean;

  constructor(filepath: string) {

    this._buffer = 0;
    this._col = 1;
    this._row = 1;
    this._isValid = true;

    if (!fs.existsSync(filepath))
      this.throw('');

    this.file = fs.readFileSync(filepath).toString().split('');

  }

  // getters & setters

  public get buffer(): number { return this._buffer; }
  public set buffer(v: number) { this._buffer = v; }

  public get state(): number { return this._state; }
  public set state(v: number) { this._state = v; }

  public get filepath(): string { return this._filepath; }
  public set filepath(v: string) { this._filepath = v; }

  public get file(): string[] { return [].concat(this._file); }
  public set file(v: string[]) { this._file = [].concat(v); }

  public get row(): number { return this._row; }
  public set row(v: number) { this._row = v; }

  public get col(): number { return this._col; }
  public set col(v: number) { this._col = v; }

  public get isValid(): boolean { return this._isValid; }

  // method's

  /**
   * dispara um token que simboliza um erro léxico e define 
   * o status do lexema como inválido
   * @param message 
   */
  public throw(message): void {

    this._isValid = false;

    console.error(
      new Token(
        this.row, this.col,
        new Symbols().lexem('ERR'),
        `[Erro léxico]: ${message} \t linha: ${this.row}, coluna: ${this.col}\n`
      )
    );

  }

  /**
   * retorna o próximo token encontrado no arquivo
   */
  public next(): Token {

    let symbols = new Symbols();
    let c = null;
    let temp = '';

    while (!0) {

      /**
       * verifica se chegou no final do arquivo
       */
      if (this.file.length === this.buffer) {
        return new Token(this.row, this.col, 'END_OF_FILE');
      }
      /**
       * se não está no final do arquivo, 
       */
      else {
        c = this.file[this.buffer];
        this.buffer++;
      }

      switch (this.state) {

        case 0:

          temp = '';

          /**
           * q0
           * caracteres que devem ser ignorados
           */
          if (c === ' ' || c === '\r' || c === '\n' || c === '\t') {

            this.state = 0;

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
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'MULTIPLICACAO');
          }

          /**
           * q2
           * soma
           */
          else if (c === '+') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'SOMA');
          }

          /**
           * q3
           * subtração
           */
          else if (c === '-') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'SUBTRACAO');
          }

          /**
           * q4
           * igualdade
           */
          else if (c === '=') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'IGUAL');
          }

          /**
           * q5
           * abre parenteses
           */
          else if (c === '(') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'ABRE_PARENTESES');
          }

          /**
           * q6
           * fecha parenteses
           */
          else if (c === ')') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'FECHA_PARENTESES');
          }

          /**
           * q7
           * aspas duplas
           */
          else if (c === '"') {
            this.state = 8;
          }

          /**
           * q10
           * vírgula
           */
          else if (c === ',') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'VIRGULA');
          }

          /**
           * q11
           * ponto e vírgula
           */
          else if (c === ';') {
            this.state = 0;
            this.col++;
            return new Token(this.row, this.col, 'PONTO_VIRGULA');
          }

          /**
           * q12
           * maior que | maior ou igual que
           */
          else if (c === '>') {
            this.state = 12;
          }

          /**
           * q15
           * menor que | menor ou igual que
           */
          else if (c === '<') {
            this.state = 15;
          }

          /**
           * q21
           * digito
           */
          else if (/[0-9]/.test(c)) {
            this.state = 21;
            temp += c;
          }

          /**
           * q26
           * é um carater
           */
          else if (/[a-zA-Z]/.test(c)) {
            this.state = 26;
            temp += c;
          }

          /**
           * q28
           * divisão | comentario simples | comentario de muitas linhas
           */
          else if (c === '/') {
            this.state = 28;
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
           * se for outra aspas retorna erro por não aceitar string vazia
           */
          if (c === '"') {
            this.col++;
            this.throw(`A ligagem não aceita strings vazias na linha ${this.row} e na coluna ${this.col}`);
          }
          /**
           * se não for um caracter ASCII tem que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('O caracter informado não é um caracter ASCII válido');
          }

          /**
           * volta pro loop
           */
          break;

        /**
         * q0 => q12
         * tratamento iniciando com 'maior que'
         */
        case 12:
          this.col++;
          this.state = 0;
          /**
           * q14
           * maior ou igual que
           */
          if (c === '=') {
            this.col++;
            return new Token(this.row, this.col, 'MAIOR_IGUAL_QUE');
          }
          /**
           * q13
           * outro
           */
          else {
            return new Token(this.row, this.col, 'MAIOR_QUE');
          }
        /**
         * q0 => q11
         * tratamento iniciando com 'menor que'
         */
        case 15:
          this.col++;
          /**
           * q19
           * inicio de verificacao para atribuicao
           */
          if (c === '-') {
            this.state = 19;
          } else {
            this.state = 0;
            /**
             * q16
             * diferente que
             */
            if (c === '>') {
              this.col++;
              return new Token(this.row, this.col, 'DIFERENTE');
            }
            /**
             * q18
             * maior ou igual que
             */
            else if (c === '=') {
              this.col++;
              return new Token(this.row, this.col, 'MAIOR_IGUAL_QUE');
            }
            /**
             * q17
             * menor que
             */
            else {
              return new Token(this.row, this.col, 'MENOR_QUE');
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
          this.state = 0;
          return new Token(this.row, this.col, 'ATRIBUI');

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
            this.state = 22;
          }

          /**
           * q25
           * caso seja  qualquer coisa diferente de numero
           */
          else if (!/[0-9]/.test(c)) {
            this.state = 0;
            let n = new Token(this.row, this.col, 'NUMERICO');
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

          if (!/[0-9]/.test(c)) {
            this.throw('O caracter encontrado não é do tipo NUMERICO')
          }

          /**
           * q23
           * segunda parte do ponto flutuante
           */
          this.state = 23;

          break;

        /**
         * q22 => q23
         * segunda parte do ponto
         */
        case 23:

          temp += c;

          /**
           * q24
           */
          if (!/[0-9]/.test(c)) {
            this.state = 0;
            let n = new Token(this.row, this.col, 'NUMERICO');
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
          if (!/[a-zA-Z0-9]/.test(c)) {
            this.state = 0;
            return new Token(this.row, this.col, !!symbols.lexem(temp) ? 'KW' : 'ID', temp);
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
            this.state = 30;
          }
          /**
           * q31
           * comentario de múltiplas linhas
           */
          else if (c === '*') {
            this.state = 31;
          }
          /**
           * q29
           * divisão
           */
          else {
            this.state = 0;
            return new Token(this.row, this.col, 'DIVISAO');
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
            this.row++;
            this.state = 0;
          }
          /**
           * caso use uma tabulação dentro dos comentarios deve-se respeitar a regra
           * da linguagem
           */
          else if (c === '\t') {
            this.col += 3;
          }
          /**
           * se não for ASCII te que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('O caracter não é um ASCII válido');
          }
          break;
        /**
         * {q28, q32} => q31
         */
        case 31:
          this.col++;
          /**
           * se for tabulação tem que respeitar a linguagem
           */
          if (c === '\t') {
            this.col += 3;
          }
          /**
           * q32
           * possivel finalizacao
           */
          else if (c === '*') {
            this.state = 32;
          }
          /**
           * se não for ASCII tem que dar pau
           */
          else if (!/[\x00-\x7F]/.test(c)) {
            this.throw('O caracter não é um ASCII válido');
          }
          break;
        /**
         * q31 => q32
         */
        case 32:
          this.col++;
          /**
           * caso finalize o comentario volte ao inicio
           */
          if (c === '/') {
            this.col++;
            this.state = 0;
          }
          /**
           * caso seja um ASCII valido veja se volta para 31
           */
          else if (/[\x00-\x7F]/.test(c)) {
            if (c !== '*') {
              this.state = 31;
            }
          }
          /**
           * caso não seja um ASCII valido tem que dar pau
           */
          else {
            this.throw('O caracter não é um ASCII válido');
          }
          break;
      }
    }

  }

}