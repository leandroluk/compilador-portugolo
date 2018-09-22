import path from 'path';
import { Lexem } from '../classes/Lexem';

let filepath = path.join(__dirname, '..', 'teste.txt');
let l = new Lexem(filepath);

console.log(l.file);