import { expect } from 'chai';
import 'mocha';
import { Token } from './token';
import { Tag } from './tag';

describe('Token.ts', () => {

    it('criar um token', () => expect(new Token(Tag.NUMERICO, "4")).is.instanceof(Token));
    it('retornar um token', () => expect(new Token(Tag.ID, "teste").toString()).is.string);

});