import { Ts } from './Ts'
/**
 * classe que faz a validação léxica
 * @param {string} filepath
 */
export class Lexem {

    private _eof: number = -1;
    private _lookahead: number = 0;
    private _row: number = 1;
    private _col: number = 1;
    private _file: string = null;
    private _ts: Ts = new Ts();
    private _errors: Error[] = [];

    constructor(file: string) {
        try {

        } catch (error) {

        }
    }

}