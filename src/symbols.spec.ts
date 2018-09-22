import { expect } from 'chai';
import 'mocha';

import { Symbols } from './symbols';

describe('Symbols.ts', () => {

    let symbols = new Symbols();

    it('imprimir os símbolos da linguagem', () => expect(symbols.toString()).is.not.empty);
    it('recuperar um lexema usando o token', () => expect(symbols.lexem('<--')).is.not.empty);
    it('recuperar um token usando o lexema', () => expect(symbols.token('MAIOR_QUE')).is.not.empty);
    it('acrescentar um novo símbolo', () => expect(symbols.put("foo", "bar")).is.true);
    it('imprimir a estrutura da linguagem', () => expect(symbols.toString()).is.string);

});