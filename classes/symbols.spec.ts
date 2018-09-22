import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import 'mocha';

import { Symbols } from './symbols';

describe('Symbols.ts', () => {

    const symbols = new Symbols();

    it('imprimir os símbolos da linguagem', () => {
        expect(symbols.toString()).is.not.empty;
    });
    it('recuperar um lexema usando o token', () => {
        expect(symbols.lexem('<--')).is.not.empty;
    });
    it('recuperar um token usando o lexema', () => {
        expect(symbols.token('MAIOR_QUE')).is.not.empty;
    });
    it('acrescentar um novo símbolo', () => {
        expect(symbols.put("foo", "bar")).is.true;
    });
    it('fazer a impressão da estrutura da linguagem', () => {
        expect(symbols.toString()).is.string;
    })
});