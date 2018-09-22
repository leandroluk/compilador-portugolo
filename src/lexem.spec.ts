import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import 'mocha';

import { Lexem } from './lexem';

describe('Lexem.ts', () => {

    it('fazer a leitura de um arquivo', () => {
        const testeFilePath = path.join(__dirname, '..', 'teste.txt');
        const file = fs.readFileSync(testeFilePath).toString();
        const result = new Lexem(file);
        expect(result.file).is.not.empty;
    });

});