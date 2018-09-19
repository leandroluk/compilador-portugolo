const Token = function (name, lexem, row, col) {

    this.name = name || null;
    this.lexem = lexem || null;
    this.row = row || null;
    this.col = col || null;

    this.print = () => `<${this.name}, "${this.lexem}">`;

};

module.exports = Token;