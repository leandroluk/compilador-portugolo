/**
 * importação das dependências da classe
 */
const fs = require("fs");

const Token = require("./token");
const Symbols = require("./symbols");

/**
 * classe que
 * @param {string} filepath
 */
const Lexem = function(filepath) {
  /**
   * verifica se foi passado um arquivo e se o mesmo existe
   */
  if (!filepath || !fs.existsSync(filepath))
    throw new Error("é necessário informar o nome do arquivo");

  /**
   * define o ponto de iteração do loop de leitura dos caracteres do arquivo
   */
  buffer = 0;

  /**
   * armazena o último caracter lido no arquivo
   */
  lookahead = 0;

  /**
   * leitura do arquivo após a criação da classe
   */
  this.file = fs
    .readFileSync(filepath)
    .toString()
    .split("");

  this.throw = message => {
    console.error(`[Erro léxico]: ${message} \n`);
    process.exit(1);
  };

  /**
   * retorna o próximo token
   */
  this.next = end => {
    let state = 0;
    let symbols = new Symbols();
    let c = undefined;

    while (!0) {
      if (!!end) process.exit(0);

      try {
        lookahead = this.file.indexOf(this.file[buffer]);
        buffer++;

        if (lookahead != END_OF_FILE) c = lookahead;
      } catch (e) {
        return "Erro ao ler arquivo!!!";
      }

      switch (state) {
        case 0:
          if (lookahead == END_OF_FILE) {
            return new Token(symbols.list.END_OF_FILE, row, col);
          } else if (c === " " ||c === "\n" || c === "\r") {
            state = 0;
          }else if (c === "\t") {
              buffer--;
              return "\t\t\t"
          } else if (c === "*") {
            buffer--;
            return new Token(symbols.list.MULTIPLICACAO, row, col);
          } else if (c === "+") {
            buffer--;
            return new Token(symbols.list.SOMA, row, col);
          } else if (c === "-") {
            buffer--;
            return new Token(symbols.list.SUBTRACAO, row, col);
          }else if (c === "=") {
              buffer--;
              return new Token(symbols.list.IGUAL, row, col);
          }else if (c === "(") {
              buffer--;
              return new Token(symbols.list.ABRE_PARENTESES, row, cow);
          }

          break;
      }
    }
  };
};

module.exports = Lexem;
