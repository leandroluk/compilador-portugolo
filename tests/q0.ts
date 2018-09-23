import { Lexem } from '../src/Lexem';
import { Token } from '../src/token';

let l = new Lexem("             ");

let end = false;

while (!end) {

    let token: Token = l.next();
    console.log(token.toString());

    if (token.name == "END_OF_FILE") {
        end = true;
    }

}

