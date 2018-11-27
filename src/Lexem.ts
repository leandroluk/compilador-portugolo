import { Ts } from './Ts';
import { Token } from './Token';

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
            `Símbolo encontrado: ${word} na linha ${row} e coluna ${col}. ` +
            `Símbolo esperado: ${expect}`
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

    public nextToken(): Token {

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
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
            }

        }

    }
}