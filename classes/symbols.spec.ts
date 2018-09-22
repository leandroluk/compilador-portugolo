import { Symbols } from './symbols';

// cria uma instancia da classe
let s = new Symbols();

/**
 * teste de impressão dos símbolos da linguagem
 */
console.log(s.print());

/**
 * teste de recuperação de 
 */
console.log(s.lexem('MAIOR_QUE'))

/**
 * teste de acrescentar um novo símbolo
 */
s.put("TESTE_SIMBOLO", "????");
console.log(s.print());