import { Ts } from './ts';
import { Token } from './token';
import { Tag } from './tag';

/**
 * classe que faz a validação léxica
 * @param {string} filepath
 */
export class Lexem {

    private _eof: number = -1;
    private _lookahead: number = 0;
    private _row: number = 1;
    private _col: number = 1;
    private _words: string[] = null;
    private _ts: Ts;
    private _errors: Error[] = [];

    constructor(file: string) {
        try {
            this._words = file.split('');
            this._ts = new Ts();
        } catch (e) {
            throw e;
        }
    }

    /**
     * cria os erros e armazena em um banco de dados
     * @param word 
     * @param expect 
     * @param row 
     * @param col 
     */
    private catchError(word: string, expect: string, row: number, col: number) {

        // cria o erro
        let error = new Error(
            `[Erro léxico ${this._errors.length + 1}: ` +
            `Símbolo encontrado: "${word}" na linha ${row} e coluna ${col}. ` +
            `Símbolo esperado: "${expect}"`
        );

        // armazena na lista de erros
        this._errors.push(error)

        // imprime a mensagem do erro sem parar o código
        console.error(error.message);

        // corrije as linhas caso o erro seja enviado em uma quebra de linha
        this.checkLinebreak(word);

    }

    /**
     * verifica se o caracter passado é uma quebra de linha e, 
     * caso seja, corrije a linha e a coluna
     * @param word 
     */
    private checkLinebreak(word: string): boolean {

        if (['\n', '\r'].indexOf(word) > -1) {

            this._row++;
            this._col = 1;

            return true;

        }

        return false;

    }

    /**
     * retorna o próximo token encontrado
     */
    public next(): Token {

        let word: string = '';
        let state: number = 0;
        let c: string = null;

        while (true) {

            c = null;

            try {

                this._lookahead = !!this._words[this._lookahead] ? this._lookahead++ : -1;

                if (this._lookahead !== this._eof) {
                    c = this._words[this._lookahead];
                    this._col++;
                }

            } catch (e) {
                throw e;
            }

            switch (state) {
                case 0:
                    // caso seja fim de arquivo
                    if (this._lookahead === this._eof) {
                        return new Token(Tag.EOF, "EOF", this._row, this._col);
                    } else if ([' ', '\t', '\n', '\r'].indexOf(c) > -1) {
                        // se for uma tabulação, adiciona 3 colunas
                        if (!this.checkLinebreak(c))
                            this._col += 3;
                        // senão for tabulação, fica no estado 0
                    }
                    // q0
                    else if (c === '+') {
                        return new Token(Tag.OP_PLUS, '+', this._row, this._col);
                    }
                    // q1
                    else if (c === '-') {
                        return new Token(Tag.OP_MINUS, '+', this._row, this._col);
                    }
                    // q2
                    else if (c === '*') {
                        return new Token(Tag.OP_MULT, '*', this._row, this._col);
                    }
                    // q4
                    else if (c === '/') {
                        state = 4;
                    }
                    // q11
                    else if (/[a-zA-Z]/.test(c)) {
                        state = 11; word += c;
                    }
                    // q13
                    else if (/[0-9]/.test(c)) {
                        state = 13; word += c;
                    }
                    // q18
                    else if (c === '"') {
                        state = 18; word += c;
                    }
                    // q21
                    else if (c === ';') {
                        return new Token(Tag.SB_PVIRG, ';', this._row, this._col);
                    }
                    // q22
                    else if (c === ',') {
                        return new Token(Tag.SB_VIRG, ',', this._row, this._col);
                    }
                    // q23
                    else if (c === ')') {
                        return new Token(Tag.SB_FP, ')', this._row, this._col);
                    }
                    // q24
                    else if (c === '(') {
                        return new Token(Tag.SB_AP, '(', this._row, this._col);
                    }
                    // q25
                    else if (c === '=') {
                        return new Token(Tag.OP_EQ, '=', this._row, this._col);
                    }
                    // q26
                    else if (c === '>') {
                        state = 26;
                    }
                    // q29
                    else if (c === '<') {
                        state = 29;
                    } else {
                        this.catchError(c, '', +this._row, this._col);
                    }
                    break;
                case 4:
                    // q6
                    if (c === '*') {
                        state = 6;
                    }
                    // q9
                    else if (c === '/') {
                        state = 9;
                    }
                    // q4
                    else {
                        return new Token(Tag.OP_DIV, '/', this._row, this._col);
                    }
                    break;
                case 5:
                    if (c === '=') {
                        state = 0;
                        return new Token(Tag.OP_LE, '<=', +this._row, this._col);
                    }
                    break;
                case 6:
                    // q7
                    if (c === '*') {
                        state = 7;
                    } else if (this.checkLinebreak(c) || c != '*') {
                    } else {
                        this.catchError(c, '*', this._row, this._col);
                    }
                    break;
                case 7:
                    if (c === '/') {
                        this._col++;
                        state = 0;
                        this._errors = [];
                    } else if (c === '*' && this._errors.length === 0) {
                        this.catchError(c, '/', this._row, this._col);
                    } else {
                        if (c === '\n') {
                            this._col = 1;
                            this._row++;
                        }
                        if (this._errors.length === 0) {
                            this.catchError(c, '/', this._row, this._col);
                        } else if (this._lookahead === this._eof) {
                            return new Token(Tag.EOF, 'EOF', this._row, this._col);
                        }
                    }
                    break;
                case 8: break;
                case 9: break;
                case 10: break;
                case 11: break;
                case 12: break;
                case 13: break;
                case 14: break;
                case 15: break;
                case 16: break;
                case 17: break;
                case 18: break;
                case 19: break;
                case 20: break;
                case 21: break;
                case 22: break;
                case 23: break;
                case 24: break;
                case 25: break;
                case 26: break;
                case 27: break;
                case 28: break;
                case 29: break;
                case 30: break;
                case 31: break;
                case 32: break;
                case 33: break;
            }

        }

    }

    /**
     * retorna o index existente no lookahead quando for necessário
     */
    private lookABack(): void {
        try {
            if (this._lookahead != this._eof) {
                this._lookahead--;
                this._col--;
            }
        } catch (e) {
            throw e;
        }
    }

}