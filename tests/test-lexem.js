const path = require('path');

let filepath = path.join(__dirname, '..', 'teste.txt');

const Lexem = require('../classes/lexem');

let l = new Lexem(filepath);

console.log(l.file);