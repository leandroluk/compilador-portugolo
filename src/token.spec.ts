import { expect } from 'chai';
import 'mocha';
import { Token } from './token';

describe('Token.ts', () => {

    it('criar um token', () => expect(new Token(1, 1, "ERR", "")).is.instanceof(Token));
    it('retornar um token', () => expect(new Token(1, 1, "ERR", "").toString()).is.string);

});