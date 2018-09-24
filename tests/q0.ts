import * as fs from 'fs';
import * as path from 'path';
import { Lexem } from '../src/Lexem';
import { Token } from '../src/Token';

debugger;

let file = fs.readFileSync(path.join(__dirname, 'q0.ptgl')).toString();
let l = new Lexem(file);

let end = false;

while (!end) {

    let token: Token = l.next();
    console.log(token.toString());

    if (token.name == "END_OF_FILE") {
        end = true;
    }

}

