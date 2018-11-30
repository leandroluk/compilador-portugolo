import { Parser } from './parser';
import { Lexem } from './lexem';

const file = 
`AlGoritmo 

	DECLARE
	LITERAL op , a;
	NUMERICO s;

	s <-- 5.5;
	escreva("s + a");

	leia(op);

	se(op=os) inicio
		escreva("Oi, eu sou o Goku! );
	fim 
	senao inicio 
		escreva("Seu inseto, achei que iria preferir o Kakaroto");
	fim

	fim algoritmo

	subrotina fazNada(v1 nulo)
	escreva("Se a rotina faz nada, por que tem um comando de impressao?");
	fim subrotina`;

const lexem = new Lexem(file);
const parser = new Parser(lexem);

parser.Compilador();
