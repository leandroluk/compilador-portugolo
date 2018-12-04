import { Parser } from './parser';
import { Lexem } from './lexem';

const file = 
`AlGoritmo 
DECLARE
LITERAL time1 , time2;
NUMERICO gol1,gol2;

gol1 <-- 0;
gol2 <-- 0;

time1 <-- "Cruzeiro";
time2 <-- "Atlético";

se(gol1>gol2) inicio
	escreva("O Cruzeiro é o campeão do Mineiro");
fim 

senao inicio 
	escreva("O Atlético é o campeão do Mineiro");
fim
fim algoritmo

subrotina gol(g nulo)
DECLARE
NUMERICO gol;
gol <-- gol + 1;
escreva(gol);
fim subrotina`;

const lexem = new Lexem(file);
const parser = new Parser(lexem);

parser.Compilador();
