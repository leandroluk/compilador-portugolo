import * as fs from 'fs';
import * as path from 'path';
import { Lexem } from '../src/Lexem';
import { Token } from '../src/Token';


let file = fs.readFileSync(path.join(__dirname, 'arquivo_de_teste.ptgl')).toString();
let l = new Lexem(`// a #{\n} a`);

let end = false;

debugger;

while (!0) {

    let token: Token = l.next();
    console.log(token.toString());

    if (token.name == "END_OF_FILE") {
        break;
    }

}

