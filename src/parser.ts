import { Lexem } from './lexem';
import { Token } from './Token';
import { Tag } from './Tag';

export class Parser {

    private readonly _lexem: Lexem;
    private _token: Token;
    private _errors: Error[];

    constructor(lexem: Lexem) {
        this._lexem = lexem;
        this._token = this._lexem.next();
        this._errors = []
    }

    /**
     * chama o próximo this._token
     */
    public next(): void {
        this._token = this._lexem.next();
    }

    /**
     * "come" o this._token e chama o próximo caso a tag passada seja
     * a mesma do this._token armazenado
     * @param tag 
     */
    public eat(tag: Tag) {
        if (this.isTag(tag)) {
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
    public buildErrorMessage(expect: string): string {
        return `[Erro sintático] ` +
            `Esperado: '${expect}', ` +
            `Encontrado: '${this._token.lexem}".`;
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
     * verifica se a tag que está declarada no token existe na lista de
     * tag's enviadas para verificação
     * @param tags 
     */
    public isTag(...tags: Tag[]): boolean {
        return tags.indexOf(this._token.tag) > -1;
    }

    /**
     * Compilador => Programa EOF
     */
    public Compilador(): void {

        if (!this.isTag(Tag.ALGORITMO))
            this.skip(this.buildErrorMessage('ALGORITMO'));

        this.Programa();

    }

    /**
     * Programa => "algoritmo" RegexDeclVar ListaCmd "fim" "algoritmo" 
     *             ListaRotina
     */
    public Programa(): void {

        if (!this.eat(Tag.ALGORITMO))
            this.skip(this.buildErrorMessage('ALGORITMO'));

        this.RegexDeclVar();
        this.ListaCmd();

        if (!this.eat(Tag.FIM))
            this.handleError(this.buildErrorMessage('FIM'));

        if (!this.eat(Tag.ALGORITMO))
            this.handleError(this.buildErrorMessage('ALGORITMO'));

        this.ListaRotina();

    }

    /**
     * RegexDeclVar => "declare" Tipo ListaID ";" DeclaraVar | ε
     */
    public RegexDeclVar(): void {
        if (this.isTag(Tag.DECLARE)) {

            this.eat(Tag.DECLARE);
            this.Tipo();
            this.ListaID();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

            this.DeclaraVar();

        } else if (this.isTag(
            Tag.ALGORITMO, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO,
            Tag.PARA, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        )) {
        } else {
            this.skip(this.buildErrorMessage(
                'DECLARE, SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA'
            ));
            if (!this.isTag(Tag.EOF))
                this.RegexDeclVar();
        }
    }

    /**
     * DeclaraVar => Tipo ListaID ";" DeclaraVar | ε
     */
    public DeclaraVar(): void {

        if (this.isTag(
            Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL, Tag.NULO
        )) {
            this.Tipo();
            this.ListaID();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

            this.DeclaraVar();
        }
        else if (this.isTag(
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO,
            Tag.PARA, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        )) {
            return;
        }
        else {

            this.skip(this.buildErrorMessage(
                'LOGICO, NUMERICO, LITERAL, NULO'
            ));

            if (!this.isTag(Tag.EOF))
                this.DeclaraVar();

        }

    }

    /**
     * ListaRotina => ListaRotina
     */
    public ListaRotina(): void {
        if (this.isTag(Tag.SUBROTINA, Tag.EOF))
            this.ListaRotinaLinha();
        else {

            this.skip(this.buildErrorMessage('SUBROTINA'));

            if (!this.isTag(Tag.EOF))
                this.ListaRotina();

        }
    }

    /**
     * ListaRotina => Rotina ListaRotina | ε
     */
    public ListaRotinaLinha(): void {

        if (this.isTag(Tag.SUBROTINA)) {
            this.Rotina();
            this.ListaRotinaLinha();
        } else if (this.isTag(Tag.EOF)) {
            return;
        } else {
            this.skip(this.buildErrorMessage('SUBROTINA'));
            this.ListaRotinaLinha();
        }

    }

    /**
     * Rotina => "subrotina" ID "(" ListaParam ")" RegexDeclVar 
     *           ListaCmd Retorno "fim" "subrotina"
     */
    public Rotina(): void {
        if (this.isTag(Tag.SUBROTINA)) {

            this.eat(Tag.SUBROTINA);

            if (!this.eat(Tag.ID))
                this.handleError(this.buildErrorMessage('ID'));
            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.ListaParam();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            this.RegexDeclVar();
            this.ListaCmd();
            this.Retorno();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('FIM'));

            if (!this.eat(Tag.SUBROTINA))
                this.handleError(this.buildErrorMessage('SUBROTINA'));

        }
        else if (this.isTag(Tag.EOF)) {
            this.handleError(this.buildErrorMessage('SUBROTINA'));
        }
        else {
            this.skip(this.buildErrorMessage('SUBROTINA'));
            this.Rotina();
        }
    }

    /**
     * ListaParam => Param ListaParam
     */
    public ListaParam(): void {
        if (this.isTag(Tag.ID)) {
            this.Param();
            this.ListaParamLinha();
        }
        else if (this.isTag(Tag.SB_FP)) {
            this.handleError(this.buildErrorMessage('SUBROTINA'));
        }
        else {
            this.skip(this.buildErrorMessage('SUBROTINA'));
            this.ListaParam();
        }
    }

    /**
     * ListaParam => "," ListaParam | ε 
     */
    public ListaParamLinha(): void {
        if (this.isTag(Tag.SB_VIRG)) {
            this.eat(Tag.SB_VIRG);
            this.ListaParam();
        } else if (this.isTag(Tag.SB_FP)) {
        } else {

            this.skip(this.buildErrorMessage(';'));

            if (!this.isTag(Tag.EOF))
                this.ListaParamLinha();

        }
    }

    /**
     * Param => ListaID Tipo
     */
    public Param(): void {
        if (this.isTag(Tag.ID)) {
            this.ListaID();
            this.Tipo();
        } else if (this.isTag(
            Tag.SB_VIRG, Tag.SB_FP
        )) {
            this.handleError(this.buildErrorMessage('ID'));
        } else {

            this.skip(this.buildErrorMessage('ID'));

            if (!this.isTag(Tag.EOF))
                this.Param();

        }
    }

    /**
     * ListaID => ID ListaID
     */
    public ListaID(): void {
        if (this.isTag(Tag.ID)) {
            this.eat(Tag.ID);
            this.ListaIDLinha();
        }
        else if (this.isTag(
            Tag.SB_PVIRG, Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL,
            Tag.NULO
        )) {
            this.handleError(this.buildErrorMessage('ID'));
        } else {

            this.skip(this.buildErrorMessage('ID'));

            if (!this.isTag(Tag.EOF))
                this.ListaID();

        }
    }

    /**
     * ListaID  => "," ListaID | ε
     */
    public ListaIDLinha(): void {
        if (this.isTag(Tag.SB_VIRG)) {
            this.eat(Tag.SB_VIRG);
            this.ListaID();
        } else if (this.isTag(
            Tag.SB_PVIRG, Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL,
            Tag.NULO
        )) {
        } else {

            this.skip(this.buildErrorMessage(
                '",", ";", LOGICO, NUMERICO, LITERAL, NULO'
            ));

            if (!this.isTag(Tag.EOF))
                this.ListaIDLinha();

        }
    }

    /**
     * Retorno => "retorne" Expressao | ε
     */
    public Retorno(): void {
        if (this.isTag(Tag.RETORNE)) {
            this.eat(Tag.RETORNE);
            this.Expressao();
        }
        else if (this.isTag(Tag.FIM)) {
        } else {
            this.skip(this.buildErrorMessage('RETORNE, FIM'));
            if (!this.isTag(Tag.EOF))
                this.Retorno();
        }
    }

    /**
     * Tipo => "logico" | "NUMERICO" | "LITERAL" | "nulo"
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
                this.handleError(this.buildErrorMessage(
                    'LOGICO, NUMERICO, LITERAL, NULO'
                ));
                break;
            default:
                this.skip(this.buildErrorMessage(
                    'LOGICO, NUMERICO, LITERAL, NULO'
                ));
                if (!this.isTag(Tag.EOF))
                    this.Tipo();
        }
    }

    /**
     * ListaCmd => ListaCmd
     */
    public ListaCmd(): void {
        if (this.isTag(
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ATE,
            Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        )) {
            this.ListaCmdLinha();
        }
        else {

            this.skip(this.buildErrorMessage(
                'SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA, FIM, RETORNE, ATE'
            ));

            if (this.isTag(Tag.EOF))
                this.ListaCmd();

        }
    }

    /**
     * ListaCmd => Cmd ListaCmd | ε
     */
    public ListaCmdLinha(): void {
        if (this.isTag(
            Tag.ID, Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.REPITA,
            Tag.ESCREVA, Tag.LEIA
        )) {
            this.Cmd();
            this.ListaCmdLinha();
        }
        else if (this.isTag(Tag.FIM, Tag.RETORNE, Tag.ATE)) {
        } else {

            this.skip(this.buildErrorMessage(
                'SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA, FIM, RETORNE, ATE'
            ));

            if (!this.isTag(Tag.EOF))
                this.ListaCmdLinha();

        }
    }

	/*
	 * Cmd => CmdSe | CmdEnquanto | CmdPara | CmdRepita | ID Cmd | CmdEscreva | CmdLeia
	 */
    public Cmd(): void {
        switch (this._token.tag) {
            case Tag.SE:
                this.CmdSe();
                break;
            case Tag.ENQUANTO:
                this.CmdEnquanto();
                break;
            case Tag.PARA:
                this.CmdPara();
                break;
            case Tag.REPITA:
                this.CmdRepita();
                break;
            case Tag.ID:
                if (!this.eat(Tag.ID))
                    this.handleError(this.buildErrorMessage('ID'));
                this.CmdLinha();
                break;
            case Tag.ESCREVA:
                this.CmdEscreva();
                break;
            case Tag.LEIA:
                this.CmdLeia();
                break;
            case Tag.FIM:
            case Tag.RETORNE:
            case Tag.ATE:
                this.handleError(this.buildErrorMessage(
                    'SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA'
                ));
                break;
            default:

                this.skip(this.buildErrorMessage(
                    'SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA'
                ));

                if (!this.isTag(Tag.EOF))
                    this.Cmd();
        }
    }

    /**
     * Cmd => CmdAtrib | CmdChamaRotina
     */
    public CmdLinha(): void {
        if (this.isTag(Tag.OP_ARTIB))
            this.CmdAtrib();
        else if (this.isTag(Tag.SB_AP))
            this.CmdChamaRotina();
        else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.REPITA, Tag.ID,
            Tag.ESCREVA, Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE
        )) {
            this.handleError(this.buildErrorMessage('<--, ('));
        } else {

            this.skip(this.buildErrorMessage('<--, ('));

            if (!this.isTag(Tag.EOF))
                this.CmdLinha();

        }
    }

    /**
     * CmdSe => "se" "(" Expressao ")" "inicio" ListaCmd "fim" CmdSe
     */
    public CmdSe(): void {

        if (this.isTag(Tag.SE)) {

            this.eat(Tag.SE);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('INICIO'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('FIM'));

            this.CmdSeLinha();

        } else if (this.isTag(
            Tag.ENQUANTO, Tag.PARA, Tag.REPITA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE
        )) {
            this.handleError(this.buildErrorMessage('SE'));
        } else {

            this.skip(this.buildErrorMessage('SE'));

            if (!this.isTag(Tag.EOF))
                this.CmdSe();

        }
    }

    /**
     * CmdSe => "seNAO" "inicio" ListaCmd "fim" | ε 
     */
    public CmdSeLinha(): void {
        if (this.isTag(Tag.SENAO)) {

            this.eat(Tag.SENAO);

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('FIM'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('FIM'));

        }
        else if (this.isTag(
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.PARA,
            Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        )) {
            return;
        } else {

            this.skip(this.buildErrorMessage(
                'SENAO, SE, ENQUANTO, PARA, REPITA, ID, ESCREVA, LEIA, FIM, RETORNE, ATE'
            ));

            if (!this.isTag(Tag.EOF))
                this.CmdSeLinha();

        }
    }

    /**
     * CmdEnquanto => "enquanto" "(" Expressao ")" "faca" "inicio" ListaCmd "fim"
     */
    public CmdEnquanto(): void {
        if (this.isTag(Tag.ENQUANTO)) {

            this.eat(Tag.ENQUANTO);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));


            if (!this.eat(Tag.FACA))
                this.handleError(this.buildErrorMessage('FACA'));


            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('INICIO'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('FIM'));

        } else if (this.isTag(
            Tag.SE, Tag.PARA, Tag.REPITA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE
        )) {
            this.handleError(this.buildErrorMessage('ENQUANTO'));
        } else {

            this.skip(this.buildErrorMessage('ENQUANTO'));

            if (!this.isTag(Tag.EOF))
                this.CmdEnquanto();

        }
    }

    /**
     * CmdPara => "para" ID CmdAtrib "ate" Expressao "faca" "inicio" 
     *            ListaCmd "fim"
     */
    public CmdPara(): void {
        if (this.isTag(Tag.PARA)) {

            this.eat(Tag.PARA);

            if (!this.eat(Tag.ID))
                this.handleError(this.buildErrorMessage('ID'));

            this.CmdAtrib();

            if (!this.eat(Tag.ATE))
                this.handleError(this.buildErrorMessage('ATE'));

            this.Expressao();

            if (!this.eat(Tag.FACA))
                this.handleError(this.buildErrorMessage('FACA'));

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('INICIO'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('FIM'));

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.REPITA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE
        )) {
            this.handleError(this.buildErrorMessage('PARA'));
        } else {

            this.skip(this.buildErrorMessage('PARA'));

            if (!this.isTag(Tag.EOF))
                this.CmdPara();

        }
    }

    /**
     * CmdRepita => "repita" ListaCmd "ate" Expressao
     */
    public CmdRepita(): void {
        if (this.isTag(Tag.REPITA)) {

            this.eat(Tag.REPITA);

            this.ListaCmd();

            if (!this.eat(Tag.ATE))
                this.handleError(this.buildErrorMessage('ATE'));

            this.Expressao();

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE
        )) {
            this.handleError(this.buildErrorMessage('REPITA'));
        } else {
            this.skip(this.buildErrorMessage('REPITA'));
            if (!this.isTag(Tag.EOF))
                this.CmdRepita();

        }
    }

    /**
     * CmdAtrib => "<--" Expressao ";"
     */
    public CmdAtrib(): void {
        if (this.isTag(Tag.OP_ARTIB)) {

            this.eat(Tag.OP_ARTIB);

            this.Expressao();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        )) {
            this.handleError(this.buildErrorMessage('<-- '));
        } else {

            this.skip(this.buildErrorMessage('<-- '));

            if (!this.isTag(Tag.EOF))
                this.CmdAtrib();

        }
    }

    /**
     * CmdChamaRotina => "(" RegexExp ")" ";"
     */
    public CmdChamaRotina(): void {
        if (this.isTag(Tag.SB_AP)) {

            this.eat(Tag.SB_AP);
            this.RegexExp();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        )) {
            this.handleError(this.buildErrorMessage('( '));
        } else {

            this.skip(this.buildErrorMessage('( '));

            if (!this.isTag(Tag.EOF))
                this.CmdChamaRotina();

        }
    }

    /**
     * RegexExp => Expressao RegexExp | ε
     */
    public RegexExp(): void {
        if (this.isTag(
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        )) {
            this.Expressao();
            this.RegexExpLinha();
        }
        else if (this.isTag(Tag.SB_FP)) { }
        else {

            this.skip(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));

            if (!this.isTag(Tag.EOF))
                this.RegexExp();

        }
    }

    /**
     * RegexExp => , Expressao RegexExp | ε
     */
    public RegexExpLinha(): void {
        if (this.isTag(Tag.SB_VIRG)) {

            this.eat(Tag.SB_VIRG);

            this.Expressao();
            this.RegexExpLinha();

        } else if (this.isTag(Tag.SB_FP)) { }
        else {

            this.skip(this.buildErrorMessage(','));

            if (!this.isTag(Tag.EOF))
                this.RegexExpLinha();

        }
    }

    /**
     * CmdEscreva => "escreva" "(" Expressao ")" ";"
     */
    public CmdEscreva(): void {
        if (this.isTag(Tag.ESCREVA)) {

            this.eat(Tag.ESCREVA);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        ))
            this.handleError(this.buildErrorMessage('ESCREVA'));
        else {

            this.skip(this.buildErrorMessage('ESCREVA'));

            if (!this.isTag(Tag.EOF))
                this.CmdEscreva();

        }
    }

    /**
     * CmdLeia => "leia" "(" ID ")" ";"
     */
    public CmdLeia(): void {
        if (this.isTag(Tag.LEIA)) {

            this.eat(Tag.LEIA);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            if (!this.eat(Tag.ID))
                this.handleError(this.buildErrorMessage('ID'));

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if (this.isTag(
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA,
            Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        ))
            this.handleError(this.buildErrorMessage('LEIA'));
        else {

            this.skip(this.buildErrorMessage('LEIA'));

            if (!this.isTag(Tag.EOF))
                this.CmdLeia();
        }
    }

    /**
     * Expressao => Exp1 Exp
     */
    public Expressao(): void {
        if (this.isTag(
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        )) {
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(
            Tag.FIM, Tag.SB_FP, Tag.SE, Tag.ENQUANTO, Tag.PARA,
            Tag.REPITA, Tag.ESCREVA, Tag.LEIA, Tag.RETORNE, Tag.ATE,
            Tag.SB_PVIRG, Tag.SB_VIRG
        )) {
            this.handleError(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));
        } else {

            this.skip(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));

            if (!this.isTag(Tag.EOF))
                this.Expressao();

        }
    }

	/*
     * Exp => < Exp1 Exp | <= Exp1 Exp | > Exp1 Exp | >= Exp1 Exp | 
     *        = Exp1 Exp | <> Exp1 Exp | ε
	 */
    public ExpLinha(): void {
        if (this.isTag(Tag.OP_LT)) {
            this.eat(Tag.OP_LT);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(Tag.OP_LE)) {
            this.eat(Tag.OP_LE);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(Tag.OP_GT)) {
            this.eat(Tag.OP_GT);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(Tag.OP_GE)) {
            this.eat(Tag.OP_GE);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(Tag.OP_EQ)) {
            this.eat(Tag.OP_EQ);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(Tag.OP_LT_GT)) {
            this.eat(Tag.OP_LT_GT);
            this.Exp1();
            this.ExpLinha();
        } else if (this.isTag(
            Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_AP, Tag.SB_FP,
            Tag.SB_VIRG, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.FACA,
            Tag.PARA, Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        )) {
        } else {

            this.skip(this.buildErrorMessage('<, <=, >, >=, =, <>'));

            if (!this.isTag(Tag.EOF))
                this.ExpLinha();

        }
    }

    /**
     *  Exp1 => Exp2 Exp1
     */
    public Exp1(): void {
        if (this.isTag(
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        )) {
            this.Exp2();
            this.Exp1Linha();
        } else if (this.isTag(
            Tag.OP_LT, Tag.OP_LE, Tag.OP_GT, Tag.OP_GE, Tag.OP_LT_GT, Tag.FIM,
            Tag.SB_FP, Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.REPITA, Tag.ESCREVA,
            Tag.LEIA, Tag.RETORNE, Tag.ATE, Tag.SB_PVIRG, Tag.SB_VIRG
        ))
            this.handleError(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));
        else {

            this.skip(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));

            if (!this.isTag(Tag.EOF))
                this.Exp1();

        }
    }

    /**
     * Exp1 => E Exp2 Exp1 | Ou Exp2 Exp1 | ε 
     */
    public Exp1Linha(): void {
        if (this.isTag(Tag.E)) {
            this.eat(Tag.E);
            this.Exp2();
            this.Exp1Linha();
        }
        else if (this.isTag(Tag.OU)) {
            this.eat(Tag.OU);
            this.Exp2();
            this.Exp1Linha();
        }
        else if (this.isTag(
            Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG,
            Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA,
            Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA, Tag.OP_LT,
            Tag.OP_LE, Tag.OP_GT, Tag.OP_GE, Tag.OP_EQ, Tag.OP_LT_GT
        )) {
            return
        } else {

            this.skip(this.buildErrorMessage('E, Ou'));

            if (!this.isTag(Tag.EOF))
                this.Exp1Linha();

        }
    }

    /**
     * Exp2 => Exp3 Exp2
     */
    public Exp2(): void {
        if (this.isTag(
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        )) {
            this.Exp3();
            this.Exp2Linha();
        } else if (this.isTag(
            Tag.E, Tag.OU, Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP,
            Tag.SB_VIRG, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA,
            Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA, Tag.OP_LT, Tag.OP_LE,
            Tag.OP_GT, Tag.OP_GE, Tag.OP_EQ, Tag.OP_LT_GT
        )) {
            this.handleError(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));
        } else {

            this.skip(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));

            if (!this.isTag(Tag.EOF))
                this.Exp2();

        }
    }

    /**
     * Exp2 => + Exp3 Exp2 | - Exp3 Exp2 | ε 
     */
    public Exp2Linha(): void {
        if (this.isTag(Tag.OP_PLUS)) {
            this.eat(Tag.OP_PLUS);
            this.Exp3();
            this.Exp2Linha();
        } else if (this.isTag(Tag.OP_MINUS)) {
            this.eat(Tag.OP_MINUS);
            this.Exp3();
            this.Exp2Linha();
        } else if (this.isTag(
            Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG, Tag.RETORNE,
            Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA, Tag.ATE, Tag.REPITA,
            Tag.ESCREVA, Tag.LEIA, Tag.OP_LT, Tag.OP_LE, Tag.OP_GT, Tag.OP_GE,
            Tag.OP_EQ, Tag.OP_LT_GT, Tag.E, Tag.OU
        )) {
        } else {

            this.skip(this.buildErrorMessage('+, -'));

            if (!this.isTag(Tag.EOF))
                this.Exp2Linha();

        }
    }

    /**
     * Exp3 => Exp4 Exp3 
     */
    public Exp3(): void {
        if (this.isTag(
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        )) {
            this.Exp4();
            this.Exp3Linha();
        } else if (this.isTag(
            Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG, Tag.RETORNE,
            Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA, Tag.ATE, Tag.REPITA,
            Tag.ESCREVA, Tag.LEIA, Tag.OP_LT, Tag.OP_LE, Tag.OP_GT, Tag.OP_GE,
            Tag.OP_EQ, Tag.OP_LT_GT, Tag.E, Tag.OU
        )) {
            this.handleError(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('
            ));
        } else {

            this.skip(this.buildErrorMessage(
                'ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ( '
            ));

            if (!this.isTag(Tag.EOF))
                this.Exp3();

        }
    }

    /**
     * Exp3 => * Exp4 Exp3 | / Exp4 Exp3 | ε 
     */
    public Exp3Linha(): void {
        if (this.isTag(Tag.OP_MULT)) {
            this.eat(Tag.OP_MULT);
            this.Exp4();
            this.Exp3Linha();
        } else if (this.isTag(Tag.OP_DIV)) {
            this.eat(Tag.OP_DIV);
            this.Exp4();
            this.Exp3Linha();
        } else if (this.isTag(
            Tag.FIM, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG,
            Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA,
            Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA, Tag.OP_LT,
            Tag.OP_LE, Tag.OP_GT, Tag.OP_GE, Tag.OP_EQ, Tag.OP_LT_GT,
            Tag.E, Tag.OU, Tag.OP_PLUS, Tag.OP_MINUS)) {
        } else {

            this.skip(this.buildErrorMessage('*, /'));

            if (!this.isTag(Tag.EOF))
                this.Exp3Linha();

        }
    }

    /*
     * Exp4 => ID Exp4 | NUMERICO | Litetal | "VERDADEIRO" | "FALSO" |
     *         OpUnario Expressao | "("" Expressao ")" 
     */
    public Exp4(): void {
        if (this.isTag(Tag.ID)) {
            this.eat(Tag.ID);
            this.Exp4Linha();
        } else if (this.isTag(Tag.NUMERICO, Tag.LITERAL, Tag.VERDADEIRO, Tag.FALSO))
            this.eat(this._token.tag);
        else if (this.isTag(Tag.NAO)) {
            this.OpUnario();
            this.Expressao();
        } else if (this.isTag(Tag.SB_AP)) {

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

        } else if (this.isTag(
            Tag.DECLARE, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG, Tag.RETORNE,
            Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA, Tag.ATE, Tag.REPITA, Tag.ESCREVA,
            Tag.LEIA, Tag.E, Tag.OU, Tag.OP_LT, Tag.OP_LE, Tag.OP_GT, Tag.OP_GE,
            Tag.OP_LT_GT, Tag.OP_EQ, Tag.OP_PLUS, Tag.OP_MINUS, Tag.OP_DIV, Tag.OP_MULT
        ))
            this.handleError(this.buildErrorMessage('ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('));
        else {

            this.skip(this.buildErrorMessage('ID, NUMERICO, LITERAL, VERDADEIRO, FALSO, NAO, ('));

            if (!this.isTag(Tag.EOF))
                this.Exp4();

        }
    }

    /**
     * Exp4 => "(" RegexExp ")" | ε 
     */
    public Exp4Linha(): void {
        if (this.isTag(Tag.SB_AP)) {

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.RegexExp();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

        } else if (this.isTag(
            Tag.DECLARE, Tag.SB_PVIRG, Tag.ID, Tag.SB_FP, Tag.SB_VIRG, Tag.RETORNE,
            Tag.SE, Tag.ENQUANTO, Tag.FACA, Tag.PARA, Tag.ATE, Tag.REPITA, Tag.ESCREVA,
            Tag.LEIA, Tag.E, Tag.OU, Tag.OP_LT, Tag.OP_LE, Tag.OP_GT, Tag.OP_GE,
            Tag.OP_LT_GT, Tag.OP_EQ, Tag.OP_PLUS, Tag.OP_MINUS, Tag.OP_DIV, Tag.OP_MULT
        )) {
        } else {

            this.skip(this.buildErrorMessage('('));

            if (!this.isTag(Tag.EOF))
                this.Exp4Linha();

        }
    }

    /**
     * OpUnario => "NAO"
     */
    public OpUnario(): void {
        if (this.isTag(Tag.NAO))
            this.eat(Tag.NAO);
        else if (this.isTag(
            Tag.ID, Tag.NUMERICO, Tag.LITERAL, Tag.VERDADEIRO, Tag.FALSO, Tag.SB_AP
        ))
            this.handleError(this.buildErrorMessage('NAO'));
        else {

            this.skip(this.buildErrorMessage('NAO'));

            if (!this.isTag(Tag.EOF))
                this.OpUnario();

        }
    }

}