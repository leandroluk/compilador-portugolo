const Symbols = require("./symbols");

const Token = function (lexem, row, col) {

    this.name = new Symbols().getLexem(lexem) || null;
    this.lexem = lexem || null;
    this.row = row || null;
    this.col = col || null;

    this.print = () => `<${this.name}, "${this.lexem}">`;

};

module.exports = Token;