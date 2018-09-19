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
const Lexem = function (filepath) {
  /**
   * verifica se foi passado um arquivo e se o mesmo existe
   */
  if (!filepath || !fs.existsSync(filepath))
    throw new Error("é necessário informar o nome do arquivo");

  /**
   * define o ponto de iteração do loop de leitura dos caracteres do arquivo
   */
  this.buffer = 0;
  this.col = 1;
  this.row = 1;

  /**
   * armazena o último caracter lido no arquivo
   */
  this.this.lookahead = 0;

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
        this.this.lookahead = this.file.indexOf(this.file[this.buffer]);
        this.buffer++;

        if (this.this.lookahead != END_OF_FILE) c = this.this.lookahead;
      } catch (e) {
        return "Erro ao ler arquivo!!!";
      }

      switch (state) {
        case 0:
          // fim de arquivo
          if (this.this.lookahead == END_OF_FILE) {
            return new Token(symbols.list.END_OF_FILE, row, col);
          }
          // caracteres que devem ser ignorados
          else if (c === " " || c === "\n" || c === "\r") {
            state = 0;
          }
          // 
          else if (c === "\t") {
            this.buffer--;
            return "\t\t\t";
          } else if (typeof c === "string") {
            state = 26;
          } else if (c === "*") {
            this.buffer--;
            //estado 1
            return new Token(symbols.list.MULTIPLICACAO, row, col);
          } else if (c === "+") {
            this.buffer--;
            //estado 2
            return new Token(symbols.list.SOMA, row, col);
          } else if (c === "-") {
            this.buffer--;
            //estado 3
            return new Token(symbols.list.SUBTRACAO, row, col);
          } else if (c === "=") {
            this.buffer--;
            //estado 4
            return new Token(symbols.list.IGUAL, row, col);
          } else if (c === "(") {
            this.buffer--;
            //estado 5
            return new Token(symbols.list.ABRE_PARENTESES, row, col);
          } else if (c === ")") {
            this.buffer--;
            //estado 6
            return new Token(symbols.list.FECHA_PARENTESES, row, col);
          } else if (c === '"') {
            state = 8;
          } else if (c === ",") {
            this.buffer--;
            //estado 10
            return new Token(symbols.list.VIRGULA, row, col);
          } else if (c === ";") {
            this.buffer--;
            //estado 11
            return new Token(symbols.list.PONTO_VIRGULA, row, col);
          } else if (c === ">") {
            state = 12;
          } else if (c === "<") {
            state = 16;
          } else if (typeof c === "number") {
            state = 21;
          } else if (c === "/") {
            state = 28;
          }
          break;
        case 8:
          ///
          break;
        case 12:
          ///
          if (c === "=") {
            this.buffer--;
            return new Token(symbols.list.MAIOR_IGUAL_QUE, row, col);
          } else {

          }
          break;
        case 16:
          ///
          break;
        case 21:
          ///
          break;
        case 26:
          ///
          break;
      }


    }
  }
};
};

module.exports = Lexem;