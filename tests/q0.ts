import { Lexem } from '../src/Lexem';
import { Token } from '../src/token';

debugger;

let l = new Lexem("             ");

let end = false;

while (!end) {

    let token: Token = l.next();

    if (token.lexem === "END_OF_FILE") {
        end = true;
    }

}

