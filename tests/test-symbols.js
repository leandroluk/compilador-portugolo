// importa a classe Symbols
const Symbols = require('../classes/symbols'); 

// cria uma instancia da classe
let s = new Symbols();

/**
 * teste de impressão dos símbolos da linguagem
 */
console.log(s.print());

/**
 * teste de recuperação de 
 */
console.log(s.get('MAIOR_QUE'))

/**
 * teste de acrescentar um novo símbolo
 */
s.put("TESTE_SIMBOLO", "????");
console.log(s.print());