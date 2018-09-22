import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import 'mocha';

import { Lexem } from './lexem';


describe('Lexem.ts', () => {

    it('fazer a leitura de um arquivo', () => {
        const file = fs.readFileSync(path.join(__dirname, '..', 'teste.txt')).toString();
        const result = new Lexem(file);
        expect(result.file).is.not.empty;
    });

});