import { Parser } from './parser';
import { Lexem } from './lexem';

const file = `
    ALGORITMO 
        DECLARE a 
    FIM ALGORITMO
`;

const lexem = new Lexem(file);
const parser = new Parser(lexem);

parser.Compilador();

const a = 1;