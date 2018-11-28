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
                    //q7
                    else {
                        state = 0;
                        this.lookABack();
                        return new Token(Tag.OP_LT, '<', this._row, this._col);
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
                case 8:
                    // q9
                    if (c === '=') {
                        state = 0;
                        return new Token(Tag.OP_LE, '>=', this._row, this._col);
                    }
                    // q10
                    else {
                        state = 0;
                        this.lookABack();
                        return new Token(Tag.OP_GT, '>', this._row, this._col);
                    }
                case 9:
                    if (this.checkLinebreak(c))
                        state = 0;
                    break;
                case 11:
                    if (/[a-zA-Z0-9]/.test(c)) {
                        word += c;
                    } else {
                        state = 0;
                        this.lookABack();

                        let token: Token = this._ts.get(word.toUpperCase());

                        if (!token) {
                            return new Token(Tag.ID, word, this._row, this._col);
                        } else {
                            token.col = this._col;
                            token.row = this._row;
                            return token;
                        }
                    }
                    break;
                case 13:
                    if (/[0-9]/.test(c)) {
                        word += c;
                    } else if (c == '.') {
                        state = 15;
                        word += c;
                    } else {
                        state = 0;
                        this.lookABack();
                        return new Token(Tag.NUMERICO, word, this._row, this._col);
                    }
                    break;
                case 15:
                    if (/^[0-9]/.test(c) && this._errors.length === 0) {
                        //q15 q16
                        this.catchError(c, 'Numerico', this._row, this._col);
                        this.checkLinebreak(c);

                    }
                    //q17
                    else {
                        word += c;
                        state = 0;
                        this._errors = [];
                        return new Token(Tag.NUMERICO, word, this._row, this._col);
                    }

                    break;
                case 18:
                    // q20    
                    if (c === '"') {
                        if (this._errors.length === 0) {
                            this.catchError(c, 'ASCII', this._row, this._col);
                        } else {
                            word += c;
                            state = 0;
                            this._errors = [];
                            return new Token(Tag.LITERAL, word, this._row, this._col);
                        }
                    } else if (this._lookahead === this._eof) {
                        this.catchError('$', ' ' + '"' + ' ', this._row, this._col);
                        return new Token(Tag.EOF, "EOF", this._row, this._col);
                    } else if (/^[\x00-\x7F]/.test(c)) {
                        this.checkLinebreak(c);
                        word += c;
                        this._errors.push(new Error('esse caracter não pe ASCII'));
                    }
                    break;
                case 26:
                    if (c === '=') {
                        return new Token(Tag.OP_GE, '>=', this._row, this._col);
                    } else {
                        state = 0;
                        this.lookABack();
                        return new Token(Tag.OP_GT, '>', this._row, this._col);
                    }
                case 29:
                    //q33
                    if (c === '-') {
                        state = 33;
                    }
                    //q31
                    else if (c === '=') {
                        return new Token(Tag.OP_LE, "<=", this._row, this._col);
                    }
                    //q30
                    else if (c === '>') {
                        return new Token(Tag.OP_LT_GT, "<>", this._row, this._col);
                    } else {
                        state = 0;
                        this.lookABack();
                        return new Token(Tag.OP_LT, "<", this._row, this._col);
                    }
                    break;
                case 33:
                    //q34
                    if (c === '-') {
                        this._errors = [];
                        return new Token(Tag.OP_ARTIB, "<--", this._row, this._col);
                    } else {
                        if (this._errors.length === 0) {
                            this.catchError(c, ' - ', this._row, this._col);
                        } else {
                            if (this._lookahead === this._eof) {
                                this.lookABack();
                                state = 0;
                            }
                        }
                        this.checkLinebreak(c);
                    }
                    break;
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