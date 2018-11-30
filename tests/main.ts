import * as fs from 'fs';
import * as path from 'path';

import { Lexem } from '../src/lexem';
import { Parser } from '../src/parser';
import { Ts } from '../src/ts';


let file = fs.readFileSync(path.join(__dirname, 'arquivo_de_teste.ptgl')).toString();

const lexem = new Lexem(file);
//const parser = new Parser(lexem);
//parser.Compilador();

const ts = new Ts();

ts.toConsole();

