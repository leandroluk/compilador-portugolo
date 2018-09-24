import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import 'mocha';

import { Lexem } from './lexem';
import { Symbols } from './Symbols';
import { Token } from './Token';

describe('Lexem.ts', () => {

    let lexem: Lexem;
    let symbols: Symbols = new Symbols();
    let tokens: Token[];

    var fn = (txt: string) => {
        lexem = new Lexem(txt);
        tokens = [];
        while (!0) {
            tokens.push(lexem.next());
            if (tokens[tokens.length - 1].name == 'END_OF_FILE')
                break;
        }
        return tokens;
    }

    it('fazer a leitura de um arquivo', () => {
        const testeFilePath = path.join(__dirname, '..', 'teste.txt');
        const file = fs.readFileSync(testeFilePath).toString();
        const result = new Lexem(file);
        expect(result.file).is.not.empty;
    });

    it('teste de q1', () => {
        expect(fn('*').map(x => x.name)).is.eql([symbols.token('*'), 'END_OF_FILE']);
    });

    it('teste de q2', () => {
        expect(fn('+').map(x => x.name)).is.eql([symbols.token('+'), 'END_OF_FILE']);
    });

    it('teste de q3', () => {
        expect(fn('-').map(x => x.name)).is.eql([symbols.token('-'), 'END_OF_FILE']);
    });

    it('teste de q4', () => {
        expect(fn('=').map(x => x.name)).is.eql([symbols.token('='), 'END_OF_FILE']);
    });

    it('teste de q5', () => {
        expect(fn('(').map(x => x.name)).is.eql([symbols.token('('), 'END_OF_FILE']);
    });

    it('teste de q6', () => {
        expect(fn(')').map(x => x.name)).is.eql([symbols.token(')'), 'END_OF_FILE']);
    });

    it('teste de q7 => q8 => q9', () => {
        expect(fn('""').map(x => x.name)).is.not.eql(['LITERAL', 'END_OF_FILE']);
        expect(fn('"0"').map(x => x.name)).is.eql(['LITERAL', 'END_OF_FILE']);
        expect(fn(` "\n" `).map(x => x.name)).is.not.eql(['LITERAL', 'END_OF_FILE']);
    });

    it('teste de q10', () => {
        expect(fn(', ').map(x => x.name)).is.eql([symbols.token(','), 'END_OF_FILE']);
    });

    it('teste de q11', () => {
        expect(fn('; ').map(x => x.name)).is.eql([symbols.token(';'), 'END_OF_FILE']);
    });

    it('teste de q12 => q13', () => {
        expect(fn('> ').map(x => x.name)).is.eql([symbols.token('>'), 'END_OF_FILE']);
    });

    it('teste de q12 => q14', () => {
        expect(fn('>= ').map(x => x.name)).is.eql([symbols.token('>='), 'END_OF_FILE']);
    });

    it('teste de q15 => q16', () => {
        expect(fn('<> ').map(x => x.name)).is.eql([symbols.token('<>'), 'END_OF_FILE']);
    });

    it('teste de q15 => q17', () => {
        expect(fn('< ').map(x => x.name)).is.eql([symbols.token('<'), 'END_OF_FILE']);
    });

    it('teste de q15 => q18', () => {
        expect(fn('<= ').map(x => x.name)).is.eql([symbols.token('<='), 'END_OF_FILE']);
    });

    it('teste de q15 => q19 => q20', () => {
        expect(fn('<-')).is.not.eql([symbols.token('<--'), 'END_OF_FILE']);
        expect(fn('<--').map(x => x.name)).is.eql([symbols.token('<--'), 'END_OF_FILE']);
    });

    it('teste de q21 => q22 => q23 => q24', () => {
        expect(fn('123.123123332 ').map(x => x.name)).is.eql(['NUMERICO', 'END_OF_FILE']);
        expect(fn('123. ').map(x => x.name)).is.not.eql(['NUMERICO', 'END_OF_FILE']);
    });

    it('teste de q21 => q25', () => {
        expect(fn('1 ').map(x => x.name)).is.eql(['NUMERICO', 'END_OF_FILE']);
        expect(fn('1123123213313 ').map(x => x.name)).is.eql(['NUMERICO', 'END_OF_FILE']);
    });

    it('teste de q26 => q27', () => {
        expect(fn('ALGORITMO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('DECLARE ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('FIM ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('SUBROTINA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('RETORNE ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('LOGICO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('NUMERICO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('LITERAL ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('NULO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('SE ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('INICIO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('ENQUANTO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('PARA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('ATE ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('FACA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('REPITA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('ESCREVA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('LEIA ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('VERDADEIRO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('FALSO ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('OU ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('E ').map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
        expect(fn('').map(x => x.name)).is.eql(['END_OF_FILE']);
    });

    it('teste de q28 => q29', () => {
        expect(fn('/ ').map(x => x.name)).is.eql([symbols.token('/'), 'END_OF_FILE']);
    });

    it('teste de q28 => q30', () => {
        expect(fn('//').map(x => x.name)).is.eql(['END_OF_FILE']);
        expect(fn('//a').map(x => x.name)).is.eql(['END_OF_FILE']);
        expect(fn(` //\n `).map(x => x.name)).is.eql(['END_OF_FILE']);
        expect(fn(` //\n a `).map(x => x.name)).is.eql(['ID', 'END_OF_FILE']);
        expect(fn(` //\n ALGORITMO `).map(x => x.name)).is.eql(['KW', 'END_OF_FILE']);
    });

    it('teste de q28 => q31 => q32', () => {
        expect(fn('/* */ ').map(x => x.name)).is.eql(['END_OF_FILE']);
        expect(fn('/* adasdsad\nasdasd */ ').map(x => x.name)).is.eql(['END_OF_FILE']);
        expect(fn('/* adasdsad\nasdasd ****asdada ****/ ').map(x => x.name)).is.eql(['END_OF_FILE']);
    });

});