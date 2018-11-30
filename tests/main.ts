import * as fs from 'fs';
import * as path from 'path';

import { Lexem } from '../src/lexem';
import { Parser } from '../src/parser';
import { Ts } from '../src/ts';


let file = fs.readFileSync(path.join(__dirname, 'arquivo_de_teste.ptgl')).toString();

// cria o lexema usando o arquivo de teste
const lexem = new Lexem(file);

// faz o parse da análise léxica
const parser = new Parser(lexem);
parser.Compilador();

// imprime a tabela de símbolos
const ts = new Ts();
ts.toConsole();
