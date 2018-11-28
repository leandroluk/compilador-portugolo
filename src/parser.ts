import { Lexem } from "./lexem";
import { Token } from "./Token";
import { Tag } from "./Tag";

export class Parser {

    private readonly _lexem: Lexem;
    private _token: Token;
    private _errors: Error[];

    constructor(lexem: Lexem) {
        this._lexem = lexem;
        this._token = lexem.next();
    }

    /**
     * chama o próximo token
     */
    public next(): void {
        this._token = this._lexem.next();
    }

    /**
     * "come" o token e chama o próximo caso a tag passada seja
     * a mesma do token armazenado
     * @param tag 
     */
    public eat(tag: Tag) {
        if (this._token.tag === tag) {
            this.next();
            return true;
        }
        return false;
    }

    /**
     * constrói uma mensagem de erro com base no que é esperado 
     * e no Token enviado
     * @param expect 
     * @param token 
     */
    public buildErrorMessage(expect: string, token: Token): string {
        return `[Erro sintático] ` +
            `Esperado "${expect}", ` +
            `Encontrado "${token.lexem}".`;
    }

    /**
     * se existirem mais de 3 erros sintáticos, o compilador para
     * @param message 
     */
    public handleError(message: string): void {
        if (this._errors.length < 3) {
            console.warn(
                `[Erro sintático ${this._errors.length + 1}]\t` +
                `linha: ${this._token.row}, ` +
                `coluna: ${this._token.col}`
            )
            console.error(message)
        }
        else {
            throw new Error(
                `Existem muitos erros sintáticos. ` +
                `A compilação não pode ser concluída.`
            )
        }
    }

    /**
     * usado para gerar um erro sintático mas avança ao próximo token
     * @param message 
     */
    public skip(message: string): void {
        this.handleError(message);
        this.next();
    }

    /**
     * Compilador => Programa EOF
     */
    public Compilador(): void {
        if (this._token.tag != Tag.KW_ALGORITMO)
            this.skip(this.buildErrorMessage("algoritmo", this._token))
        this.Programa();
    }

    /**
     * Programa => "algoritmo" RegexDeclVar ListaCmd "fim" "algoritmo" ListaRotina
     */
    public Programa(): void {

        if (!this.eat(Tag.KW_ALGORITMO))
            this.skip(this.buildErrorMessage("algoritimo", this._token));

        this.RegexDeclVar();
        this.ListaCmd();

        if (!this.eat(Tag.KW_FIM))
            this.handleError(this.buildErrorMessage("fim", this._token));

        if (!this.eat(Tag.KW_ALGORITMO))
            this.handleError(this.buildErrorMessage("algoritmo", this._token));

        this.ListaRotina();

    }

    /**
     * RegexDeclVar => "declare" Tipo ListaID ";" DeclaraVar | ε
     */
    public RegexDeclVar(): void {
        if (this._token.tag == Tag.KW_DECLARE) {
            this.eat(Tag.KW_DECLARE);
            this.Tipo();
            ListaID();
            if (!eat(Tag.SMB_PontoVirgula))
                erroSintatico(MensagemDeErro(" ; ", token));
            DeclaraVar();
        } else if (token.getClasse() == Tag.KW_algoritmo || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_retorne || token.getClasse() == Tag.KW_se
            || token.getClasse() == Tag.KW_enquanto || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia) {

            return;
        }
        // skip()
        else {

            skip(MensagemDeErro(" declare, se, enquanto, para, repita, id, escreva, leia,\r\n" +
                "fim, retorne", token));
            if (token.getClasse() != Tag.EOF)
                RegexDeclVar();
        }
    }

    // DeclaraVar → Tipo ListaID ";" DeclaraVar 5 | ε 6
    public void DeclaraVar() {
        // 5
        if (token.getClasse() == (Tag.Logico) || token.getClasse() == Tag.Numerico || token.getClasse() == (Tag.Literal)
            || token.getClasse() == Tag.Nulo) {
            Tipo();
            ListaID();

            if (!eat(Tag.SMB_PontoVirgula))
                erroSintatico(MensagemDeErro(" ; ", token));
            DeclaraVar();

        }
        // 6
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.ID || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia) {

            return;
        } else {

            skip(MensagemDeErro("  logico, numerico, literal, nulo ", token));
            if (token.getClasse() != Tag.EOF)
                DeclaraVar();
        }

    }

    // ListaRotina → ListaRotina’ 7
    public void ListaRotina() {
        if (token.getClasse() == Tag.KW_subrotina || token.getClasse() == Tag.EOF) {
            ListaRotinaLinha();
        }
        // skip Teste
        else {
            skip(MensagemDeErro(" subrotina ", token));
            if (token.getClasse() != Tag.EOF)
                ListaRotina();

        }

    }

    // ListaRotina’ → Rotina ListaRotina’ 8 | ε 9
    public void ListaRotinaLinha() {
        if (token.getClasse() == Tag.KW_subrotina) {
            Rotina();
            ListaRotinaLinha();
        } else if (token.getClasse() == Tag.EOF) {
            return;
        } else {
            skip(MensagemDeErro(" subrotina ", token));
            if (token.getClasse() != Tag.EOF)
                ListaRotinaLinha();
        }

    }

    // Rotina → "subrotina" ID "(" ListaParam ")" RegexDeclVar ListaCmd Retorno
    // "fim" "subrotina" 10
    public void Rotina() {

        if (token.getClasse() == Tag.KW_subrotina) {
            eat(Tag.KW_subrotina);

            if (!eat(Tag.ID))
                erroSintatico(MensagemDeErro(" ID ", token));
            if (!eat(Tag.SMB_OP))
                erroSintatico(MensagemDeErro(" ( ", token));
            ListaParam();

            if (!eat(Tag.SMB_CP))
                erroSintatico(MensagemDeErro(" ) ", token));

            RegexDeclVar();
            ListaCmd();
            Retorno();

            if (!eat(Tag.KW_fim))
                erroSintatico(MensagemDeErro(" fim ", token));
            if (!eat(Tag.KW_subrotina))
                erroSintatico(MensagemDeErro(" subrotina ", token));

        }
        // Synch()
        else if (token.getClasse() == Tag.EOF) {
            erroSintatico(MensagemDeErro("subrotina ", token));
            return;
        }
        // skip()
        else {
            skip(MensagemDeErro("subrotina ", token));
            if (token.getClasse() != Tag.EOF)
                Rotina();
        }

    }

    // ListaParam → Param ListaParam’ 11
    public void ListaParam() {

        if (token.getClasse() == Tag.ID) {
            Param();
            ListaParamLinha();

        }
        // sych
        else if (token.getClasse() == Tag.SMB_CP) {
            erroSintatico(MensagemDeErro("subrotina", token));
            return;
        }
        // skip
        else {
            skip(MensagemDeErro("subrotina", token));
            if (token.getClasse() != Tag.SMB_CP)
                ListaParam();
        }

    }// fim ListaParam
    // ListaParam’ → "," ListaParam 12 | ε 13

    public void ListaParamLinha() {
        if (token.getClasse() == Tag.SMB_SEMICOLON) {
            eat(Tag.SMB_SEMICOLON);
            ListaParam();
        } else if (token.getClasse() == Tag.SMB_CP) {
            return;
        } else {
            skip(MensagemDeErro(";", token));
            if (token.getClasse() != Tag.EOF)
                ListaParamLinha();
        }

    } // fim ListaParamLinha
    // Param → ListaID Tipo 14

    public void Param() {
        if (token.getClasse() == Tag.ID) {
            ListaID();
            Tipo();
        } else if (token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.SMB_CP) {
            erroSintatico(MensagemDeErro(" ID ", token));
            return;
        } else {
            skip(MensagemDeErro(" ID ", token));
            if (token.getClasse() != Tag.EOF)
                Param();
        }
    }// Param

    // ListaID → ID ListaID’ 15
    public void ListaID() {
        if (token.getClasse() == Tag.ID) {
            eat(Tag.ID);

            ListaIDLinha();
        }
        // sych
        else if (token.getClasse() == Tag.SMB_PontoVirgula || token.getClasse() == Tag.Logico
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal
            || token.getClasse() == Tag.Nulo) {
            erroSintatico(MensagemDeErro(" ID ", token));
            return;
        } else {
            skip(MensagemDeErro(" ID ", token));
            if (token.getClasse() != Tag.EOF)
                ListaID();
        }

    }// fim ListaID

    // ListaID ’ → "," ListaID 16 | ε 17
    public void ListaIDLinha() {
        if (token.getClasse() == Tag.SMB_SEMICOLON) {
            eat(Tag.SMB_SEMICOLON);
            ListaID();
        } else if (token.getClasse() == Tag.SMB_PontoVirgula || token.getClasse() == Tag.Logico
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal
            || token.getClasse() == Tag.Nulo) {
            return;
        } else {
            skip(MensagemDeErro(" virgula, ponto e virgula , logico, numerico, literal, nulo\r\n" +
                "", token));
            if (token.getClasse() != Tag.EOF)
                ListaIDLinha();
        }
    } // fim ListaIDLinha

    // Retorno → "retorne" Expressao 18 | ε 19
    public void Retorno() {
        // 18
        if (token.getClasse() == Tag.KW_retorne) {
            eat(Tag.KW_retorne);
            Expressao();
        }
        // 19
        else if (token.getClasse() == Tag.KW_fim) {
            return;
        } else {
            skip(MensagemDeErro(" retorne , fim ", token));
            if (token.getClasse() != Tag.EOF)
                Retorno();
        }
    }// fim Retorno

    /**
     * Tipo => "logico" | "numerico" | "literal" | "nulo" 
     */
    public Tipo(): void {
        switch (this._token.tag) {
            case Tag.LOGICO:
                this.eat(Tag.LOGICO);
                break;
            case Tag.NUMERICO:
                this.eat(Tag.NUMERICO);
                break;
            case Tag.LITERAL:
                this.eat(Tag.LITERAL);
                break;
            case Tag.NULO:
                this.eat(Tag.NULO);
                break;
            case Tag.ID:
            case Tag.SB_VIRG:
            case Tag.SB_FP:
                this.handleError(this.buildErrorMessage("Tipo", this._token));
                break;
            default:
                this.skip(this.buildErrorMessage("Tipo", this._token));
                if (this._token.tag != Tag.EOF)
                    this.Tipo();
        }
    }

    // ListaCmd → ListaCmd’ 24
    public void ListaCmd() {
        // 24
        if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.ID || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_ate
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia) {
            ListaCmdLinha();
        } else {

            skip(MensagemDeErro(" se, enquanto, para, repita, id, escreva, leia, fim, retorne, ate", token));
            if (token.getClasse() == Tag.EOF)
                ListaCmd();
        }

    }// fim listaCmd

    // ListaCmd’ → Cmd ListaCmd’ 25 | ε 26
    public void ListaCmdLinha() {
        // 25
        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia) {
            Cmd();
            ListaCmdLinha();
        }
        // 26
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            return;

        } else {

            skip(MensagemDeErro(" se, enquanto, para, repita, id, escreva, leia, fim, retorne, ate", token));
            if (token.getClasse() != Tag.EOF)
                ListaCmdLinha();
        }

    }// fim ListaCmdLinha

	/*
	 * Cmd → CmdSe 27 | CmdEnquanto 28 | CmdPara 29 | CmdRepita 30 | ID Cmd’ 31 |
	 * CmdEscreva 32 | CmdLeia 33
	 */
    public void Cmd() {
        // 27
        if (token.getClasse() == Tag.KW_se) {
            CmdSe();
        }
        // 28
        else if (token.getClasse() == Tag.KW_enquanto) {
            CmdEnquanto();
        } // 29
        else if (token.getClasse() == Tag.KW_para) {
            CmdPara();
        } // 30
        else if (token.getClasse() == Tag.KW_repita) {
            CmdRepita();
        } // 31
        else if (token.getClasse() == Tag.ID) {
            if (!eat(Tag.ID)) {
                erroSintatico("Esperado \" ID \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            CmdLinha();
        } // 32
        else if (token.getClasse() == Tag.KW_escreva) {
            CmdEscreva();
        } // 33
        else if (token.getClasse() == Tag.KW_leia) {
            CmdLeia();
        }

        // fim, retorne, ate
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {

            erroSintatico(MensagemDeErro(" se, enquanto, para, repita, id, escreva, leia ", token));
            return;
        } else {
            skip(MensagemDeErro(" se, enquanto, para, repita, id, escreva, leia ", token));
            if (token.getClasse() != Tag.EOF)
                Cmd();
        }

    } // fim Cmd

    // Cmd’ → CmdAtrib 34 | CmdChamaRotina 35
    public void CmdLinha() {
        // 34
        if (token.getClasse() == Tag.RELOP_ARTIB) {
            CmdAtrib();
        }
        // 35
        else if (token.getClasse() == Tag.SMB_OP) {
            CmdChamaRotina();
        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            erroSintatico(MensagemDeErro("<--, (", token));
        } else {
            skip(MensagemDeErro(" <--, ( ", token));
            if (token.getClasse() != Tag.EOF)
                CmdLinha();

        }

    }// fim CmdLinha

    // CmdSe → "se" "(" Expressao ")" "inicio" ListaCmd "fim" CmdSe’ 36
    public void CmdSe() {

        if (token.getClasse() == Tag.KW_se) {
            eat(Tag.KW_se);

            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \"( \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            Expressao();

            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \") \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            if (!eat(Tag.KW_inicio)) {
                erroSintatico("Esperado \" INICIO \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            ListaCmd();

            if (!eat(Tag.KW_fim)) {
                erroSintatico("Esperado \" FIM \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            CmdSeLinha();

        } else if (token.getClasse() == Tag.KW_enquanto || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            erroSintatico(MensagemDeErro(" se ", token));
        } else {

            skip(MensagemDeErro(" se ", token));
            if (token.getClasse() != Tag.EOF)
                CmdSe();

        }

    }// fim CmdSe

    // CmdSe’ → "senao" "inicio" ListaCmd "fim" 37 | ε 38
    public void CmdSeLinha() {
        // 37
        if (token.getClasse() == Tag.KW_senao) {

            eat(Tag.KW_senao);

            if (!eat(Tag.KW_inicio)) {
                erroSintatico("Esperado \" INICIO \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            ListaCmd();

            if (!eat(Tag.KW_fim)) {
                erroSintatico("Esperado \" fim \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        }
        // 38
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.ID || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_ate
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia) {
            return;
        } else {
            skip(MensagemDeErro(" senao , se, enquanto, para, repita, id, escreva, leia,\r\n" +
                "fim, retorne, ate ", token));
            if (token.getClasse() != Tag.EOF)
                CmdSeLinha();
        }
    }// fim CmdSeLinha

    // CmdEnquanto → "enquanto" "(" Expressao ")" "faca" "inicio" ListaCmd "fim" 39
    public void CmdEnquanto() {
        if (token.getClasse() == Tag.KW_enquanto) {
            eat(Tag.KW_enquanto);
            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \" ( \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            Expressao();

            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.KW_faca)) {
                erroSintatico("Esperado \" Faça \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.KW_inicio)) {
                erroSintatico("Esperado \" INICIO \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            ListaCmd();

            if (!eat(Tag.KW_fim)) {
                erroSintatico("Esperado \" FIM \", encontrado " + "\"" + token.getLexema() + "\"");
            }

        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            erroSintatico(MensagemDeErro(" enquanto ", token));
        } else {
            skip(MensagemDeErro(" enquanto ", token));
            if (token.getClasse() != Tag.EOF)
                CmdEnquanto();

        }
    }

    // CmdPara → "para" ID CmdAtrib "ate" Expressao "faca" "inicio" ListaCmd "fim"
    // 40
    public void CmdPara() {

        if (token.getClasse() == Tag.KW_para) {
            eat(Tag.KW_para);

            if (!eat(Tag.ID)) {
                erroSintatico("Esperado \" ID \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            CmdAtrib();

            if (!eat(Tag.KW_ate)) {
                erroSintatico("Esperado \" ATE \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            Expressao();

            if (!eat(Tag.KW_faca)) {
                erroSintatico("Esperado \" FAÇA \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.KW_inicio)) {
                erroSintatico("Esperado \" Inicio \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            ListaCmd();
            if (!eat(Tag.KW_fim)) {
                erroSintatico("Esperado \" fim \", encontrado " + "\"" + token.getLexema() + "\"");
            }

        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            erroSintatico(MensagemDeErro(" para ", token));
        } else {
            skip(MensagemDeErro(" para ", token));
            if (token.getClasse() != Tag.EOF)
                CmdPara();

        }

    }// fim CmdPara

    // CmdRepita → "repita" ListaCmd "ate" Expressao 41
    public void CmdRepita() {
        if (token.getClasse() == Tag.KW_repita) {
            eat(Tag.KW_repita);

            ListaCmd();

            if (!eat(Tag.KW_ate)) {
                erroSintatico("Esperado \" ATE \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            Expressao();

        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate) {
            erroSintatico(MensagemDeErro(" repita ", token));
        } else {
            skip(MensagemDeErro(" repita ", token));
            if (token.getClasse() != Tag.EOF)
                CmdRepita();

        }

    }// fim CmdRepita

    // CmdAtrib → "<--" Expressao ";" 42
    public void CmdAtrib() {

        if (token.getClasse() == Tag.RELOP_ARTIB) {
            eat(Tag.RELOP_ARTIB);

            Expressao();

            if (!eat(Tag.SMB_PontoVirgula)) {
                erroSintatico("Esperado \" ; \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita) {
            erroSintatico(MensagemDeErro(" <--  ", token));
        } else {
            skip(MensagemDeErro(" <--  ", token));
            if (token.getClasse() != Tag.EOF)
                CmdAtrib();

        }
    }// fim CmdAtrib

    // CmdChamaRotina → "(" RegexExp ")" ";" 43
    public void CmdChamaRotina() {
        if (token.getClasse() == Tag.SMB_OP) {
            eat(Tag.SMB_OP);
            RegexExp();

            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            if (!eat(Tag.SMB_PontoVirgula)) {
                erroSintatico("Esperado \" ; \", encontrado " + "\"" + token.getLexema() + "\"");
            }

        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita) {
            erroSintatico(MensagemDeErro(" (  ", token));
        } else {
            skip(MensagemDeErro(" (  ", token));
            if (token.getClasse() != Tag.EOF)
                CmdChamaRotina();

        }
    }// fim CmdChamaRotina

    // RegexExp → Expressao RegexExp’ 44 | ε 45
    public void RegexExp() {

        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.KW_nao
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal) {
            Expressao();
            RegexExpLinha();
        }
        // 45
        else if (token.getClasse() == Tag.SMB_CP)
            return;
        else {
            skip(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (   ", token));
            if (token.getClasse() != Tag.EOF)
                RegexExp();

        }
    }

    // RegexExp’ → , Expressao RegexExp’ 46 | ε 47
    public void RegexExpLinha() {
        if (token.getClasse() == Tag.SMB_SEMICOLON) {
            eat(Tag.SMB_SEMICOLON);
            Expressao();
            RegexExpLinha();
        } else if (token.getClasse() == Tag.SMB_CP)
            return;
        else {
            skip(MensagemDeErro(" , ", token));
            if (token.getClasse() != Tag.EOF)
                RegexExpLinha();

        }
    }

    // CmdEscreva → "escreva" "(" Expressao ")" ";" 48
    public void CmdEscreva() {
        if (token.getClasse() == Tag.KW_escreva) {
            eat(Tag.KW_escreva);
            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \" ( \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            Expressao();

            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.SMB_PontoVirgula)) {
                erroSintatico("Esperado \" ; \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.ID || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita) {
            erroSintatico(MensagemDeErro(" escreva  ", token));
        } else {
            skip(MensagemDeErro(" escreva  ", token));
            if (token.getClasse() != Tag.EOF)
                CmdEscreva();

        }

    } // fIM cmdeSCREVA

    // CmdLeia → "leia" "(" ID ")" ";" 49
    public void CmdLeia() {
        if (token.getClasse() == Tag.KW_leia) {
            eat(Tag.KW_leia);
            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \" ( \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.ID)) {
                erroSintatico("Esperado \" ID \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }

            if (!eat(Tag.SMB_PontoVirgula)) {
                erroSintatico("Esperado \" ; \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        } else if (token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_fim
            || token.getClasse() == Tag.KW_retorne || token.getClasse() == Tag.KW_ate
            || token.getClasse() == Tag.KW_repita) {
            erroSintatico(MensagemDeErro(" leia  ", token));
        } else {
            skip(MensagemDeErro(" leia  ", token));
            if (token.getClasse() != Tag.EOF)
                CmdLeia();

        }

    }

    // Expressao → Exp1 Exp’ 50
    public void Expressao() {
        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.KW_nao
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal) {

            Exp1();
            ExpLinha();
        } else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_CP || token.getClasse() == Tag.KW_se
            || token.getClasse() == Tag.KW_enquanto || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.SMB_SEMICOLON) {
            erroSintatico(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            return;
        } else {
            skip(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            if (token.getClasse() != Tag.EOF)
                Expressao();
        }
    }// fim Expressao

	/*
	 * Exp’ → < Exp1 Exp’ 51 | <= Exp1 Exp’ 52 | > Exp1 Exp’ 53 | >= Exp1 Exp’ 54 |
	 * = Exp1 Exp’ 55 | <> Exp1 Exp’ 56 | ε 57
	 */
    public void ExpLinha() {
        // 51
        if (token.getClasse() == Tag.RELOP_LT) {
            eat(Tag.RELOP_LT);
            Exp1();
            ExpLinha();
        }
        // 52
        else if (token.getClasse() == Tag.RELOP_LE) {
            eat(Tag.RELOP_LE);
            Exp1();
            ExpLinha();
        }
        // 53
        else if (token.getClasse() == Tag.RELOP_GT) {
            eat(Tag.RELOP_GT);
            Exp1();
            ExpLinha();
        } // 54
        else if (token.getClasse() == Tag.RELOP_GE) {
            eat(Tag.RELOP_GE);
            Exp1();
            ExpLinha();
        } // 55
        else if (token.getClasse() == Tag.RELOP_EQ) {
            eat(Tag.RELOP_EQ);
            Exp1();
            ExpLinha();
        } // 56
        else if (token.getClasse() == Tag.RELOP_LT_GT) {
            eat(Tag.RELOP_LT_GT);
            Exp1();
            ExpLinha();
        } // 57
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia) {
            return;
        } else {
            skip(MensagemDeErro(" <, <=, >, >=, =, <> ", token));
            if (token.getClasse() != Tag.EOF)
                ExpLinha();
        }

    }

    // Exp1 → Exp2 Exp1’ 58
    public void Exp1() {
        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.KW_nao
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal) {
            Exp2();
            Exp1Linha();
        } else if (token.getClasse() == Tag.RELOP_LT || token.getClasse() == Tag.RELOP_LE
            || token.getClasse() == Tag.RELOP_GT || token.getClasse() == Tag.RELOP_GE
            || token.getClasse() == Tag.RELOP_LT_GT || token.getClasse() == Tag.KW_fim
            || token.getClasse() == Tag.SMB_CP || token.getClasse() == Tag.KW_se
            || token.getClasse() == Tag.KW_enquanto || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.SMB_SEMICOLON) {
            erroSintatico(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            return;
        } else {
            skip(MensagemDeErro("id, Numerico, Literal, verdadeiro, falso, Nao, (   ", token));
            if (token.getClasse() != Tag.EOF)
                Exp1();
        }
    }

    // Exp1’ → E Exp2 Exp1’ 59 | Ou Exp2 Exp1’ 60| ε 61
    public void Exp1Linha() {
        // 59
        if (token.getClasse() == Tag.KW_e) {
            eat(Tag.KW_e);
            Exp2();
            Exp1Linha();
        }
        // 60
        else if (token.getClasse() == Tag.KW_ou) {
            eat(Tag.KW_ou);
            Exp2();
            Exp1Linha();
        }
        // 61
        else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.RELOP_LT || token.getClasse() == Tag.RELOP_LE
            || token.getClasse() == Tag.RELOP_GT || token.getClasse() == Tag.RELOP_GE
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_LT_GT) {
            return;
        } else {
            skip(MensagemDeErro(" E, Ou ", token));
            if (token.getClasse() != Tag.EOF)
                Exp1Linha();
        }

    }// fim Exp1Linha

    // Exp2 → Exp3 Exp2’ 62
    public void Exp2() {
        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.KW_nao
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal) {

            Exp3();
            Exp2Linha();
        } else if (token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou || token.getClasse() == Tag.KW_fim
            || token.getClasse() == Tag.SMB_PontoVirgula || token.getClasse() == Tag.ID
            || token.getClasse() == Tag.SMB_CP || token.getClasse() == Tag.SMB_SEMICOLON
            || token.getClasse() == Tag.KW_retorne || token.getClasse() == Tag.KW_se
            || token.getClasse() == Tag.KW_enquanto || token.getClasse() == Tag.KW_faca
            || token.getClasse() == Tag.KW_para || token.getClasse() == Tag.KW_ate
            || token.getClasse() == Tag.KW_repita || token.getClasse() == Tag.KW_escreva
            || token.getClasse() == Tag.KW_leia || token.getClasse() == Tag.RELOP_LT
            || token.getClasse() == Tag.RELOP_LE || token.getClasse() == Tag.RELOP_GT
            || token.getClasse() == Tag.RELOP_GE || token.getClasse() == Tag.RELOP_EQ
            || token.getClasse() == Tag.RELOP_LT_GT) {

            erroSintatico(MensagemDeErro("id, Numerico, Literal, verdadeiro, falso, Nao, ( ", token));
            return;
        } else {
            skip(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            if (token.getClasse() != Tag.EOF)
                Exp2();
        }

    }// Exp2

    // Exp2’ → + Exp3 Exp2’ 63 | - Exp3 Exp2’ 64 | ε 65
    public void Exp2Linha() {

        if (token.getClasse() == Tag.RELOP_PLUS) {
            eat(Tag.RELOP_PLUS);
            Exp3();
            Exp2Linha();
        } else if (token.getClasse() == Tag.RELOP_MINUS) {
            eat(Tag.RELOP_MINUS);
            Exp3();
            Exp2Linha();
        } else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.RELOP_LT || token.getClasse() == Tag.RELOP_LE
            || token.getClasse() == Tag.RELOP_GT || token.getClasse() == Tag.RELOP_GE
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_LT_GT
            || token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou) {
            return;
        } else {
            skip(MensagemDeErro(" +, - ", token));
            if (token.getClasse() != Tag.EOF)
                Exp2Linha();
        }

    }// fim Exp2Linha

    // Exp3 → Exp4 Exp3’ 66
    public void Exp3() {
        if (token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_OP || token.getClasse() == Tag.KW_nao
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal) {
            Exp4();
            Exp3Linha();
        } else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.RELOP_LT || token.getClasse() == Tag.RELOP_LE
            || token.getClasse() == Tag.RELOP_GT || token.getClasse() == Tag.RELOP_GE
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_LT_GT
            || token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou) {
            erroSintatico(MensagemDeErro("id, Numerico, Literal, verdadeiro, falso, Nao, ( ", token));
            return;
        } else {
            skip(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            if (token.getClasse() != Tag.EOF)
                Exp3();
        }
    }// fim Exp3

    // Exp3’ →* Exp4 Exp3’ 67 | / Exp4 Exp3’ 68 | ε 69
    public void Exp3Linha() {
        // 67
        if (token.getClasse() == Tag.RELOP_MULT) {
            eat(Tag.RELOP_MULT);
            Exp4();
            Exp3Linha();
        } else if (token.getClasse() == Tag.RELOP_DIV) {
            eat(Tag.RELOP_DIV);
            Exp4();
            Exp3Linha();
        } else if (token.getClasse() == Tag.KW_fim || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.RELOP_LT || token.getClasse() == Tag.RELOP_LE
            || token.getClasse() == Tag.RELOP_GT || token.getClasse() == Tag.RELOP_GE
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_LT_GT
            || token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou
            || token.getClasse() == Tag.RELOP_PLUS || token.getClasse() == Tag.RELOP_MINUS) {
            return;
        } else {
            skip(MensagemDeErro(" * , / ", token));
            if (token.getClasse() != Tag.EOF)
                Exp3Linha();
        }

    }

    // Exp4 → id Exp4’ 70 | Numerico 71 | Litetal 72 | “verdadeiro” 73 | “falso” 74|
    // OpUnario Expressao 75| “(“ Expressao “)” 76
    public void Exp4() {
        // 70
        if (token.getClasse() == Tag.ID) {
            eat(Tag.ID);
            Exp4Linha();
        } // 71
        else if (token.getClasse() == Tag.Numerico) {
            eat(Tag.Numerico);
        } // 72
        else if (token.getClasse() == Tag.Literal) {
            eat(Tag.Literal);
        } // 73
        else if (token.getClasse() == Tag.KW_verdadeiro) {
            eat(Tag.KW_verdadeiro);
        } // 74
        else if (token.getClasse() == Tag.KW_falso) {
            eat(Tag.KW_falso);

        } // 75
        else if (token.getClasse() == Tag.KW_nao) {
            OpUnario();
            Expressao();
        } // 76
        else if (token.getClasse() == Tag.SMB_OP) {
            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \" ( \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            Expressao();
            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        } else if (token.getClasse() == Tag.KW_declare || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou || token.getClasse() == Tag.RELOP_LT
            || token.getClasse() == Tag.RELOP_LE || token.getClasse() == Tag.RELOP_GT
            || token.getClasse() == Tag.RELOP_GE || token.getClasse() == Tag.RELOP_LT_GT
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_PLUS
            || token.getClasse() == Tag.RELOP_MINUS || token.getClasse() == Tag.RELOP_DIV
            || token.getClasse() == Tag.RELOP_MULT) {
            erroSintatico(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            return;
        } else {
            skip(MensagemDeErro(" id, Numerico, Literal, verdadeiro, falso, Nao, (  ", token));
            if (token.getClasse() != Tag.EOF)
                Exp4();
        }

    }

    // Exp4’ → “(“ RegexExp ”)” 77 | ε 78
    public void Exp4Linha() {
        // 77
        if (token.getClasse() == Tag.SMB_OP) {
            if (!eat(Tag.SMB_OP)) {
                erroSintatico("Esperado \" ( \", encontrado " + "\"" + token.getLexema() + "\"");
            }
            RegexExp();
            if (!eat(Tag.SMB_CP)) {
                erroSintatico("Esperado \" ) \", encontrado " + "\"" + token.getLexema() + "\"");
            }
        }
        // 78
        else if (token.getClasse() == Tag.KW_declare || token.getClasse() == Tag.SMB_PontoVirgula
            || token.getClasse() == Tag.ID || token.getClasse() == Tag.SMB_CP
            || token.getClasse() == Tag.SMB_SEMICOLON || token.getClasse() == Tag.KW_retorne
            || token.getClasse() == Tag.KW_se || token.getClasse() == Tag.KW_enquanto
            || token.getClasse() == Tag.KW_faca || token.getClasse() == Tag.KW_para
            || token.getClasse() == Tag.KW_ate || token.getClasse() == Tag.KW_repita
            || token.getClasse() == Tag.KW_escreva || token.getClasse() == Tag.KW_leia
            || token.getClasse() == Tag.KW_e || token.getClasse() == Tag.KW_ou || token.getClasse() == Tag.RELOP_LT
            || token.getClasse() == Tag.RELOP_LE || token.getClasse() == Tag.RELOP_GT
            || token.getClasse() == Tag.RELOP_GE || token.getClasse() == Tag.RELOP_LT_GT
            || token.getClasse() == Tag.RELOP_EQ || token.getClasse() == Tag.RELOP_PLUS
            || token.getClasse() == Tag.RELOP_MINUS || token.getClasse() == Tag.RELOP_DIV
            || token.getClasse() == Tag.RELOP_MULT) {
            return;
        } else {
            skip(MensagemDeErro(" (  ", token));
            if (token.getClasse() != Tag.EOF)
                Exp4Linha();
        }

    }

    // OpUnario → "Nao" 79
    public void OpUnario() {
        if (token.getClasse() == Tag.KW_nao) {
            eat(Tag.KW_nao);
        } else if (token.getClasse() == Tag.ID || token.getClasse() == Tag.Numerico || token.getClasse() == Tag.Literal
            || token.getClasse() == Tag.KW_verdadeiro || token.getClasse() == Tag.KW_falso
            || token.getClasse() == Tag.SMB_OP) {

            erroSintatico(MensagemDeErro("nao", token));
            return;
        } else {
            skip(MensagemDeErro(" nao  ", token));
            if (token.getClasse() != Tag.EOF)
                OpUnario();
        }
    }


}