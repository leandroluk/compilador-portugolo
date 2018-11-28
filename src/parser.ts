import { Lexem } from './lexem';
import { Token } from './Token';
import { Tag } from './Tag';

export class Parser {

    private readonly _lexem: Lexem;
    private _token: Token;
    private _errors: Error[];

    constructor(lexem: Lexem) {
        this._lexem = lexem;
        this._token = lexem.next();
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
     * Compilador => Programa EOF
     */
    public Compilador(): void {

        if (this._token.tag !== Tag.ALGORITMO)
            this.skip(this.buildErrorMessage('algoritmo', this._token));

        this.Programa();

    }

    /**
     * Programa => "algoritmo" RegexDeclVar ListaCmd "fim" "algoritmo" 
     *             ListaRotina
     */
    public Programa(): void {

        if (!this.eat(Tag.ALGORITMO))
            this.skip(this.buildErrorMessage('algoritimo'));

        this.RegexDeclVar();
        this.ListaCmd();

        if (!this.eat(Tag.FIM))
            this.handleError(this.buildErrorMessage('fim'));

        if (!this.eat(Tag.ALGORITMO))
            this.handleError(this.buildErrorMessage('algoritmo'));

        this.ListaRotina();

    }

    /**
     * RegexDeclVar => "declare" Tipo ListaID ";" DeclaraVar | ε
     */
    public RegexDeclVar(): void {
        if (this._token.tag === Tag.DECLARE) {

            this.eat(Tag.DECLARE);
            this.Tipo();
            this.ListaID();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

            this.DeclaraVar();

        } else if ([
            Tag.ALGORITMO, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO,
            Tag.PARA, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        ].indexOf(this._token.tag) > -1) {
            return
        } else {
            this.skip(this.buildErrorMessage(
                'declare, se, enquanto, para, repita, id, escreva, leia'
            ));
            if (this._token.tag !== Tag.EOF)
                this.RegexDeclVar();
        }
    }

    /**
     * DeclaraVar => Tipo ListaID ";" DeclaraVar | ε
     */
    public DeclaraVar(): void {

        if ([
            Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL, Tag.NULO
        ].indexOf(this._token.tag) > -1) {
            this.Tipo();
            this.ListaID();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

            this.DeclaraVar();
        }
        else if ([
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO,
            Tag.PARA, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        ].indexOf(this._token.tag) > -1) {
            return;
        }
        else {

            this.skip(this.buildErrorMessage(
                'logico, numerico, literal, nulo'
            ));

            if (this._token.tag !== Tag.EOF)
                this.DeclaraVar();

        }

    }

    /**
     * ListaRotina => ListaRotina
     */
    public ListaRotina(): void {
        if ([Tag.SUBROTINA, Tag.EOF].indexOf(this._token.tag) > -1)
            this.ListaRotinaLinha();
        else {

            this.skip(this.buildErrorMessage('subrotina'));

            if (this._token.tag !== Tag.EOF)
                this.ListaRotina();

        }
    }

    /**
     * ListaRotina => Rotina ListaRotina | ε
     */
    public ListaRotinaLinha(): void {

        if (this._token.tag === Tag.SUBROTINA) {
            this.Rotina();
            this.ListaRotinaLinha();
        } else if (this._token.tag === Tag.EOF) {
            return;
        } else {
            this.skip(this.buildErrorMessage('subrotina'));
            this.ListaRotinaLinha();
        }

    }

    /**
     * Rotina => "subrotina" ID "(" ListaParam ")" RegexDeclVar 
     *           ListaCmd Retorno "fim" "subrotina"
     */
    public Rotina(): void {
        if (this._token.tag === Tag.SUBROTINA) {

            this.eat(Tag.SUBROTINA);

            if (!this.eat(Tag.ID))
                this.handleError(this.buildErrorMessage('id'));
            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.ListaParam();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            this.RegexDeclVar();
            this.ListaCmd();
            this.Retorno();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('fim'));

            if (!this.eat(Tag.SUBROTINA))
                this.handleError(this.buildErrorMessage('subrotina'));

        }
        else if (this._token.tag === Tag.EOF) {
            this.handleError(this.buildErrorMessage('subrotina'));
            return;
        }
        // this.skip()
        else {
            this.skip(this.buildErrorMessage('subrotina'));
            this.Rotina();
        }
    }

    /**
     * ListaParam => Param ListaParam
     */
    public ListaParam(): void {
        if (this._token.tag === Tag.ID) {
            this.Param();
            this.ListaParamLinha();
        }
        else if (this._token.tag === Tag.SB_FP) {
            this.handleError(this.buildErrorMessage('subrotina'));
            return;
        }
        else {
            this.skip(this.buildErrorMessage('subrotina'));
            this.ListaParam();
        }
    }

    /**
     * ListaParam => "," ListaParam | ε 
     */
    public ListaParamLinha(): void {
        if (this._token.tag === Tag.SB_VIRG) {
            this.eat(Tag.SB_VIRG);
            this.ListaParam();
        } else if (this._token.tag === Tag.SB_FP) {
            return;
        } else {

            this.skip(this.buildErrorMessage(';'));

            if (this._token.tag !== Tag.EOF)
                this.ListaParamLinha();

        }

    }

    /**
     * Param => ListaID Tipo
     */
    public Param(): void {
        if (this._token.tag === Tag.ID) {
            this.ListaID();
            this.Tipo();
        } else if ([
            Tag.SB_VIRG, Tag.SB_FP
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('id'));
            return;
        } else {

            this.skip(this.buildErrorMessage('id'));

            if (this._token.tag !== Tag.EOF)
                this.Param();

        }
    }

    /**
     * ListaID => ID ListaID
     */
    public ListaID(): void {

        if (this._token.tag === Tag.ID) {
            this.eat(Tag.ID);
            this.ListaIDLinha();
        }
        else if ([
            Tag.SB_PVIRG, Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL,
            Tag.NULO
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('id'));
            return;
        } else {
            this.skip(this.buildErrorMessage('id'));
            if (this._token.tag !== Tag.EOF)
                this.ListaID();
        }

    }

    /**
     * ListaID  => "," ListaID | ε
     */
    public ListaIDLinha(): void {
        if (this._token.tag === Tag.SB_VIRG) {
            this.eat(Tag.SB_VIRG);
            this.ListaID();
        } else if ([
            Tag.SB_PVIRG, Tag.LOGICO, Tag.NUMERICO, Tag.LITERAL,
            Tag.NULO
        ].indexOf(this._token.tag) > -1) {
            return;
        } else {

            this.skip(this.buildErrorMessage(
                '",", ";", logico, numerico, literal, nulo'
            ));

            if (this._token.tag !== Tag.EOF)
                this.ListaIDLinha();

        }
    }

    /**
     * Retorno => "retorne" Expressao | ε
     */
    public Retorno(): void {
        // 18
        if (this._token.tag === Tag.RETORNE) {
            this.eat(Tag.RETORNE);
            this.Expressao();
        }
        // 19
        else if (this._token.tag === Tag.FIM) {
            return;
        } else {
            this.skip(this.buildErrorMessage('retorne, fim'));
            if (this._token.tag !== Tag.EOF)
                this.Retorno();
        }
    }

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
                this.handleError(this.buildErrorMessage(
                    'logico, numerico, literal, nulo'
                ));
                break;
            default:
                this.skip(this.buildErrorMessage(
                    'logico, numerico, literal, nulo'
                ));
                if (this._token.tag !== Tag.EOF)
                    this.Tipo();
        }
    }

    /**
     * ListaCmd => ListaCmd
     */
    public ListaCmd(): void {
        if ([
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ATE,
            Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        ].indexOf(this._token.tag) > -1) {
            this.ListaCmdLinha();
        }
        else {

            this.skip(this.buildErrorMessage(
                'se, enquanto, para, repita, id, escreva, leia, fim, retorne, ate'
            ));

            if (this._token.tag === Tag.EOF)
                this.ListaCmd();

        }
    }

    /**
     * ListaCmd => Cmd ListaCmd | ε
     */
    public ListaCmdLinha(): void {
        if ([
            Tag.ID, Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.REPITA,
            Tag.ESCREVA, Tag.LEIA
        ].indexOf(this._token.tag) > -1) {
            this.Cmd();
            this.ListaCmdLinha();
        }
        else if ([
            Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            return;
        } else {

            this.skip(this.buildErrorMessage(
                'se, enquanto, para, repita, id, escreva, leia, fim, retorne, ate'
            ));

            if (this._token.tag !== Tag.EOF)
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
                    this.handleError(this.buildErrorMessage('id'));
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
                this.handleError(this.buildErrorMessage('se, enquanto, para, repita, id, escreva, leia'));
                break;
            default:
                this.skip(this.buildErrorMessage('se, enquanto, para, repita, id, escreva, leia'));
                if (this._token.tag !== Tag.EOF)
                    this.Cmd();
        }
    }

    /**
     * Cmd => CmdAtrib | CmdChamaRotina
     */
    public CmdLinha(): void {
        if (this._token.tag === Tag.OP_ARTIB)
            this.CmdAtrib();
        else if (this._token.tag === Tag.SB_AP)
            this.CmdChamaRotina();
        else if ([
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.REPITA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('<--, ('));
        } else {

            this.skip(this.buildErrorMessage('<--, ('));

            if (this._token.tag !== Tag.EOF)
                this.CmdLinha();

        }
    }

    /**
     * CmdSe => "se" "(" Expressao ")" "inicio" ListaCmd "fim" CmdSe
     */
    public CmdSe(): void {

        if (this._token.tag === Tag.SE) {

            this.eat(Tag.SE);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('inicio'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('fim'));

            this.CmdSeLinha();

        } else if ([
            Tag.ENQUANTO, Tag.PARA, Tag.REPITA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('se'));
        } else {

            this.skip(this.buildErrorMessage('se'));

            if (this._token.tag !== Tag.EOF)
                this.CmdSe();

        }
    }

    /**
     * CmdSe => "senao" "inicio" ListaCmd "fim" | ε 
     */
    public CmdSeLinha(): void {
        if (this._token.tag === Tag.SENAO) {

            this.eat(Tag.SENAO);

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('fim'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('fim'));

        }
        else if ([
            Tag.FIM, Tag.ID, Tag.RETORNE, Tag.SE, Tag.ENQUANTO, Tag.PARA,
            Tag.ATE, Tag.REPITA, Tag.ESCREVA, Tag.LEIA
        ].indexOf(this._token.tag) > -1) {
            return;
        } else {

            this.skip(this.buildErrorMessage(
                'senao , se, enquanto, para, repita, id, escreva, leia,fim, retorne, ate'
            ));

            if (this._token.tag !== Tag.EOF)
                this.CmdSeLinha();

        }
    }

    /**
     * CmdEnquanto => "enquanto" "(" Expressao ")" "faca" "inicio" ListaCmd "fim"
     */
    public CmdEnquanto(): void {
        if (this._token.tag === Tag.ENQUANTO) {

            this.eat(Tag.ENQUANTO);

            if (!this.eat(Tag.SB_AP))
                this.handleError(this.buildErrorMessage('('));

            this.Expressao();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));


            if (!this.eat(Tag.FACA))
                this.handleError(this.buildErrorMessage('faca'));


            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('inicio'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('fim'));

        } else if ([
            Tag.SE, Tag.PARA, Tag.REPITA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('enquanto'));
        } else {

            this.skip(this.buildErrorMessage('enquanto'));

            if (this._token.tag !== Tag.EOF)
                this.CmdEnquanto();

        }
    }

    /**
     * CmdPara => "para" ID CmdAtrib "ate" Expressao "faca" "inicio" 
     *            ListaCmd "fim"
     */
    public CmdPara(): void {
        if (this._token.tag === Tag.PARA) {

            this.eat(Tag.PARA);

            if (!this.eat(Tag.ID))
                this.handleError(this.buildErrorMessage('id'));

            this.CmdAtrib();

            if (!this.eat(Tag.ATE))
                this.handleError(this.buildErrorMessage('ate'));

            this.Expressao();

            if (!this.eat(Tag.FACA))
                this.handleError(this.buildErrorMessage('faca'));

            if (!this.eat(Tag.INICIO))
                this.handleError(this.buildErrorMessage('inicio'));

            this.ListaCmd();

            if (!this.eat(Tag.FIM))
                this.handleError(this.buildErrorMessage('fim'));

        } else if ([
            Tag.SE, Tag.ENQUANTO, , Tag.REPITA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('para'));
        } else {

            this.skip(this.buildErrorMessage('para'));

            if (this._token.tag !== Tag.EOF)
                this.CmdPara();

        }
    }

    /**
     * CmdRepita => "repita" ListaCmd "ate" Expressao
     */
    public CmdRepita(): void {
        if (this._token.tag === Tag.REPITA) {

            this.eat(Tag.REPITA);

            this.ListaCmd();

            if (!this.eat(Tag.ATE))
                this.handleError(this.buildErrorMessage('ate'));

            this.Expressao();

        } else if ([
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('repita'));
        } else {
            this.skip(this.buildErrorMessage('repita'));
            if (this._token.tag !== Tag.EOF)
                this.CmdRepita();

        }
    }

    /**
     * CmdAtrib => "<--" Expressao ";"
     */
    public CmdAtrib(): void {
        if (this._token.tag === Tag.OP_ARTIB) {

            this.eat(Tag.OP_ARTIB);

            this.Expressao();

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if ([
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA,
            Tag.LEIA, Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('<-- '));
        } else {

            this.skip(this.buildErrorMessage('<-- '));

            if (this._token.tag !== Tag.EOF)
                this.CmdAtrib();

        }
    }

    /**
     * CmdChamaRotina => "(" RegexExp ")" ";"
     */
    public CmdChamaRotina(): void {
        if (this._token.tag === Tag.SB_AP) {

            this.eat(Tag.SB_AP);
            this.RegexExp();

            if (!this.eat(Tag.SB_FP))
                this.handleError(this.buildErrorMessage(')'));

            if (!this.eat(Tag.SB_PVIRG))
                this.handleError(this.buildErrorMessage(';'));

        } else if ([
            Tag.SE, Tag.ENQUANTO, Tag.PARA, Tag.ID, Tag.ESCREVA, Tag.LEIA,
            Tag.FIM, Tag.RETORNE, Tag.ATE, Tag.REPITA
        ].indexOf(this._token.tag) > -1) {
            this.handleError(this.buildErrorMessage('( '));
        } else {

            this.skip(this.buildErrorMessage('( '));

            if (this._token.tag !== Tag.EOF)
                this.CmdChamaRotina();

        }
    }

    /**
     * RegexExp => Expressao RegexExp | ε
     */
    public RegexExp(): void {
        if ([
            Tag.ID, Tag.SB_AP, Tag.NAO, Tag.VERDADEIRO, Tag.FALSO,
            Tag.NUMERICO, Tag.LITERAL
        ].indexOf(this._token.tag) > -1) {
            this.Expressao();
            this.RegexExpLinha();
        }
        else if (this._token.tag === Tag.SB_FP)
            return;
        else {

            this.skip(this.buildErrorMessage(
                'id, Numerico, Literal, verdadeiro, falso, Nao, ('
            ));

            if (this._token.tag !== Tag.EOF)

                this.RegexExp();

        }
    }

    // RegexExp => , Expressao RegexExp 46 | ε 47
    public void RegexExpLinha() {
        if (this._token.tag === Tag.SB_VIRG) {
            this.eat(Tag.SB_VIRG);
            Expressao();
            RegexExpLinha();
        } else if (this._token.tag === Tag.SB_FP)
            return;
        else {
            this.skip(this.buildErrorMessage(',', this._token));
            if (this._token.tag !== Tag.EOF)
                RegexExpLinha();

        }
    }

    // CmdEscreva =>'escreva'"('Expressao')'";'48
    public void CmdEscreva() {
        if (this._token.tag === Tag.ESCREVA) {
            this.eat(Tag.ESCREVA);
            if (!this.eat(Tag.SB_AP)) {
                handleError('Esperado \'( \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }

            Expressao();

            if (!this.eat(Tag.SB_FP)) {
                handleError('Esperado \') \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }

            if (!this.eat(Tag.SB_PVIRG)) {
                handleError('Esperado \'; \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
        } else if (this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.PARA || this._token.tag === Tag.ID || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.FIM || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA) {
            handleError(this.buildErrorMessage('escreva ', this._token));
        } else {
            this.skip(this.buildErrorMessage('escreva ', this._token));
            if (this._token.tag !== Tag.EOF)
                CmdEscreva();

        }

    } // fIM cmdeSCREVA

    // CmdLeia =>'leia'"('id')'";'49
    public void CmdLeia() {
        if (this._token.tag === Tag.LEIA) {
            this.eat(Tag.LEIA);
            if (!this.eat(Tag.SB_AP)) {
                handleError('Esperado \'( \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }

            if (!this.eat(Tag.ID)) {
                handleError('Esperado \'ID \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }

            if (!this.eat(Tag.SB_FP)) {
                handleError('Esperado \') \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }

            if (!this.eat(Tag.SB_PVIRG)) {
                handleError('Esperado \'; \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
        } else if (this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.PARA || this._token.tag === Tag.ID
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.FIM
            || this._token.tag === Tag.RETORNE || this._token.tag === Tag.ATE
            || this._token.tag === Tag.REPITA) {
            handleError(this.buildErrorMessage('leia ', this._token));
        } else {
            this.skip(this.buildErrorMessage('leia ', this._token));
            if (this._token.tag !== Tag.EOF)
                CmdLeia();

        }

    }

    // Expressao => Exp1 Exp 50
    public void Expressao() {
        if (this._token.tag === Tag.ID || this._token.tag === Tag.SB_AP || this._token.tag === Tag.nao
            || this._token.tag === Tag.verdadeiro || this._token.tag === Tag.falso
            || this._token.tag === Tag.NUMERICO || this._token.tag === Tag.LITERAL) {

            Exp1();
            ExpLinha();
        } else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_FP || this._token.tag === Tag.SE
            || this._token.tag === Tag.ENQUANTO || this._token.tag === Tag.PARA
            || this._token.tag === Tag.REPITA || this._token.tag === Tag.ESCREVA
            || this._token.tag === Tag.LEIA || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.ATE || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.SB_VIRG) {
            handleError(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            if (this._token.tag !== Tag.EOF)
                Expressao();
        }
    }// fim Expressao

	/*
	 * Exp => < Exp1 Exp 51 | <= Exp1 Exp 52 | > Exp1 Exp 53 | >= Exp1 Exp 54 |
	 * = Exp1 Exp 55 | <> Exp1 Exp 56 | ε 57
	 */
    public void ExpLinha() {
        // 51
        if (this._token.tag === Tag.RELOP_LT) {
            this.eat(Tag.RELOP_LT);
            Exp1();
            ExpLinha();
        }
        // 52
        else if (this._token.tag === Tag.RELOP_LE) {
            this.eat(Tag.RELOP_LE);
            Exp1();
            ExpLinha();
        }
        // 53
        else if (this._token.tag === Tag.RELOP_GT) {
            this.eat(Tag.RELOP_GT);
            Exp1();
            ExpLinha();
        } // 54
        else if (this._token.tag === Tag.RELOP_GE) {
            this.eat(Tag.RELOP_GE);
            Exp1();
            ExpLinha();
        } // 55
        else if (this._token.tag === Tag.RELOP_EQ) {
            this.eat(Tag.RELOP_EQ);
            Exp1();
            ExpLinha();
        } // 56
        else if (this._token.tag === Tag.RELOP_LT_GT) {
            this.eat(Tag.RELOP_LT_GT);
            Exp1();
            ExpLinha();
        } // 57
        else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_AP || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA) {
            return;
        } else {
            this.skip(this.buildErrorMessage('<, <=, >, >=, =, <>', this._token));
            if (this._token.tag !== Tag.EOF)
                ExpLinha();
        }

    }

    // Exp1 => Exp2 Exp1 58
    public void Exp1() {
        if (this._token.tag === Tag.ID || this._token.tag === Tag.SB_AP || this._token.tag === Tag.nao
            || this._token.tag === Tag.verdadeiro || this._token.tag === Tag.falso
            || this._token.tag === Tag.NUMERICO || this._token.tag === Tag.LITERAL) {
            Exp2();
            Exp1Linha();
        } else if (this._token.tag === Tag.RELOP_LT || this._token.tag === Tag.RELOP_LE
            || this._token.tag === Tag.RELOP_GT || this._token.tag === Tag.RELOP_GE
            || this._token.tag === Tag.RELOP_LT_GT || this._token.tag === Tag.FIM
            || this._token.tag === Tag.SB_FP || this._token.tag === Tag.SE
            || this._token.tag === Tag.ENQUANTO || this._token.tag === Tag.PARA
            || this._token.tag === Tag.REPITA || this._token.tag === Tag.ESCREVA
            || this._token.tag === Tag.LEIA || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.ATE || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.SB_VIRG) {
            handleError(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, (  ', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp1();
        }
    }

    // Exp1 => E Exp2 Exp1 59 | Ou Exp2 Exp1 60| ε 61
    public void Exp1Linha() {
        // 59
        if (this._token.tag === Tag.e) {
            this.eat(Tag.e);
            Exp2();
            Exp1Linha();
        }
        // 60
        else if (this._token.tag === Tag.ou) {
            this.eat(Tag.ou);
            Exp2();
            Exp1Linha();
        }
        // 61
        else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.RELOP_LT || this._token.tag === Tag.RELOP_LE
            || this._token.tag === Tag.RELOP_GT || this._token.tag === Tag.RELOP_GE
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_LT_GT) {
            return;
        } else {
            this.skip(this.buildErrorMessage('E, Ou', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp1Linha();
        }

    }// fim Exp1Linha

    // Exp2 => Exp3 Exp2 62
    public void Exp2() {
        if (this._token.tag === Tag.ID || this._token.tag === Tag.SB_AP || this._token.tag === Tag.nao
            || this._token.tag === Tag.verdadeiro || this._token.tag === Tag.falso
            || this._token.tag === Tag.NUMERICO || this._token.tag === Tag.LITERAL) {

            Exp3();
            Exp2Linha();
        } else if (this._token.tag === Tag.e || this._token.tag === Tag.ou || this._token.tag === Tag.FIM
            || this._token.tag === Tag.SB_PVIRG || this._token.tag === Tag.ID
            || this._token.tag === Tag.SB_FP || this._token.tag === Tag.SB_VIRG
            || this._token.tag === Tag.RETORNE || this._token.tag === Tag.SE
            || this._token.tag === Tag.ENQUANTO || this._token.tag === Tag.FACA
            || this._token.tag === Tag.PARA || this._token.tag === Tag.ATE
            || this._token.tag === Tag.REPITA || this._token.tag === Tag.ESCREVA
            || this._token.tag === Tag.LEIA || this._token.tag === Tag.RELOP_LT
            || this._token.tag === Tag.RELOP_LE || this._token.tag === Tag.RELOP_GT
            || this._token.tag === Tag.RELOP_GE || this._token.tag === Tag.RELOP_EQ
            || this._token.tag === Tag.RELOP_LT_GT) {

            handleError(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, (', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp2();
        }

    }// Exp2

    // Exp2 => + Exp3 Exp2 63 | - Exp3 Exp2 64 | ε 65
    public void Exp2Linha() {

        if (this._token.tag === Tag.RELOP_PLUS) {
            this.eat(Tag.RELOP_PLUS);
            Exp3();
            Exp2Linha();
        } else if (this._token.tag === Tag.RELOP_MINUS) {
            this.eat(Tag.RELOP_MINUS);
            Exp3();
            Exp2Linha();
        } else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.RELOP_LT || this._token.tag === Tag.RELOP_LE
            || this._token.tag === Tag.RELOP_GT || this._token.tag === Tag.RELOP_GE
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_LT_GT
            || this._token.tag === Tag.e || this._token.tag === Tag.ou) {
            return;
        } else {
            this.skip(this.buildErrorMessage('+, -', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp2Linha();
        }

    }// fim Exp2Linha

    // Exp3 => Exp4 Exp3 66
    public void Exp3() {
        if (this._token.tag === Tag.ID || this._token.tag === Tag.SB_AP || this._token.tag === Tag.nao
            || this._token.tag === Tag.verdadeiro || this._token.tag === Tag.falso
            || this._token.tag === Tag.NUMERICO || this._token.tag === Tag.LITERAL) {
            Exp4();
            Exp3Linha();
        } else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.RELOP_LT || this._token.tag === Tag.RELOP_LE
            || this._token.tag === Tag.RELOP_GT || this._token.tag === Tag.RELOP_GE
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_LT_GT
            || this._token.tag === Tag.e || this._token.tag === Tag.ou) {
            handleError(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, (', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp3();
        }
    }// fim Exp3

    // Exp3 =>* Exp4 Exp3 67 | / Exp4 Exp3 68 | ε 69
    public void Exp3Linha() {
        // 67
        if (this._token.tag === Tag.RELOP_MULT) {
            this.eat(Tag.RELOP_MULT);
            Exp4();
            Exp3Linha();
        } else if (this._token.tag === Tag.RELOP_DIV) {
            this.eat(Tag.RELOP_DIV);
            Exp4();
            Exp3Linha();
        } else if (this._token.tag === Tag.FIM || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.RELOP_LT || this._token.tag === Tag.RELOP_LE
            || this._token.tag === Tag.RELOP_GT || this._token.tag === Tag.RELOP_GE
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_LT_GT
            || this._token.tag === Tag.e || this._token.tag === Tag.ou
            || this._token.tag === Tag.RELOP_PLUS || this._token.tag === Tag.RELOP_MINUS) {
            return;
        } else {
            this.skip(this.buildErrorMessage('* , /', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp3Linha();
        }

    }

    // Exp4 => id Exp4 70 | Numerico 71 | Litetal 72 | “verdadeiro” 73 | “falso” 74|
    // OpUnario Expressao 75| “(“ Expressao “)” 76
    public void Exp4() {
        // 70
        if (this._token.tag === Tag.ID) {
            this.eat(Tag.ID);
            Exp4Linha();
        } // 71
        else if (this._token.tag === Tag.NUMERICO) {
            this.eat(Tag.NUMERICO);
        } // 72
        else if (this._token.tag === Tag.LITERAL) {
            this.eat(Tag.LITERAL);
        } // 73
        else if (this._token.tag === Tag.verdadeiro) {
            this.eat(Tag.verdadeiro);
        } // 74
        else if (this._token.tag === Tag.falso) {
            this.eat(Tag.falso);

        } // 75
        else if (this._token.tag === Tag.nao) {
            OpUnario();
            Expressao();
        } // 76
        else if (this._token.tag === Tag.SB_AP) {
            if (!this.eat(Tag.SB_AP)) {
                handleError('Esperado \'( \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
            Expressao();
            if (!this.eat(Tag.SB_FP)) {
                handleError('Esperado \') \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
        } else if (this._token.tag === Tag.declare || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.e || this._token.tag === Tag.ou || this._token.tag === Tag.RELOP_LT
            || this._token.tag === Tag.RELOP_LE || this._token.tag === Tag.RELOP_GT
            || this._token.tag === Tag.RELOP_GE || this._token.tag === Tag.RELOP_LT_GT
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_PLUS
            || this._token.tag === Tag.RELOP_MINUS || this._token.tag === Tag.RELOP_DIV
            || this._token.tag === Tag.RELOP_MULT) {
            handleError(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('id, Numerico, Literal, verdadeiro, falso, Nao, ( ', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp4();
        }

    }

    // Exp4 => “(“ RegexExp ”)” 77 | ε 78
    public void Exp4Linha() {
        // 77
        if (this._token.tag === Tag.SB_AP) {
            if (!this.eat(Tag.SB_AP)) {
                handleError('Esperado \'( \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
            RegexExp();
            if (!this.eat(Tag.SB_FP)) {
                handleError('Esperado \') \', encontrado ' + '\"' + this._token.getLexema() + '\"");
            }
        }
        // 78
        else if (this._token.tag === Tag.declare || this._token.tag === Tag.SB_PVIRG
            || this._token.tag === Tag.ID || this._token.tag === Tag.SB_FP
            || this._token.tag === Tag.SB_VIRG || this._token.tag === Tag.RETORNE
            || this._token.tag === Tag.SE || this._token.tag === Tag.ENQUANTO
            || this._token.tag === Tag.FACA || this._token.tag === Tag.PARA
            || this._token.tag === Tag.ATE || this._token.tag === Tag.REPITA
            || this._token.tag === Tag.ESCREVA || this._token.tag === Tag.LEIA
            || this._token.tag === Tag.e || this._token.tag === Tag.ou || this._token.tag === Tag.RELOP_LT
            || this._token.tag === Tag.RELOP_LE || this._token.tag === Tag.RELOP_GT
            || this._token.tag === Tag.RELOP_GE || this._token.tag === Tag.RELOP_LT_GT
            || this._token.tag === Tag.RELOP_EQ || this._token.tag === Tag.RELOP_PLUS
            || this._token.tag === Tag.RELOP_MINUS || this._token.tag === Tag.RELOP_DIV
            || this._token.tag === Tag.RELOP_MULT) {
            return;
        } else {
            this.skip(this.buildErrorMessage('( ', this._token));
            if (this._token.tag !== Tag.EOF)
                Exp4Linha();
        }

    }

    // OpUnario =>'Nao'79
    public void OpUnario() {
        if (this._token.tag === Tag.nao) {
            this.eat(Tag.nao);
        } else if (this._token.tag === Tag.ID || this._token.tag === Tag.NUMERICO || this._token.tag === Tag.LITERAL
            || this._token.tag === Tag.verdadeiro || this._token.tag === Tag.falso
            || this._token.tag === Tag.SB_AP) {

            handleError(this.buildErrorMessage('nao', this._token));
            return;
        } else {
            this.skip(this.buildErrorMessage('nao ', this._token));
            if (this._token.tag !== Tag.EOF)
                OpUnario();
        }
    }


}