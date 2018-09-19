/**
 * importação das dependências da classe
 */
const fs = require('fs');

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
    buffer = 0;

    /**
     * armazena o último caracter lido no arquivo
     */
    lookahead = 0;

    /**
     * leitura do arquivo após a criação da classe
     */
    this.file = fs.readFileSync(filepath).toString().split('');

    this.throw = (message) => {
        console.error(`[Erro léxico]: ${message} \n`);
        process.exit(1);
    }

    /**
     * retorna o próximo token
     */
    this.next = () => {

        let state = 0;
        let c = undefined;

        while (!0) {

            c = '';

            try {
                lookahead = this.file.indexOf(this.file[buffer]);
                buffer++;
            } catch (e) {
                this.throw("Erro na leitura do arquivo");
                process.exit(3);
            }

            switch (state) {
                case 1:
                    break;
            }

        }

    }

}

module.exports = Lexem;