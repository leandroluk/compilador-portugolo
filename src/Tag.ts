export enum Tag {

    EOF = "EOF",                    // FIM DE ARQUIVO

    // OPERAÇÕES MATEMÁTICAS
    OP_LT = "OP_LT",                // <
    OP_LE = "OP_LE",                // <=
    OP_GT = "OP_GT",                // >
    OP_GE = "OP_GE",                // >=
    OP_LT_GT = "OP_LT_GT",          // <>
    OP_EQ = "OP_EQ",                // =
    OP_PLUS = "OP_PLUS",            // +
    OP_MINUS = "OP_MINUS",          // -
    OP_MULT = "OP_MULT",            // *
    OP_DIV = "OP_DIV",              // /
    OP_NQ = "OP_NQ",                // !=
    OP_ATRIB = "OP_ATRIB",          // <--

    // SIMBOLOS AUXILIARES
    SB_VIRG = "SB_VIRG",            // ,
    SB_PVIRG = "SB_PVIRG",          // ;
    SB_AP = "SB_AP",                // (
    SB_FP = "SB_FP",                // )

    // TIPOS
    NUMERICO = "NUMERICO",          // NUMBER
    LITERAL = "LITERAL",            // STRING
    LOGICO = "LOGICO",              // BOOLEAN
    NULO = "NULO",                  // NULL

    // PARAVRAS RESERVADAS
    ID = "ID",                      // ID
    ALGORITMO = "ALGORITMO",        // ALGORITMO
    DECLARE = "DECLARE",            // DECLARE
    INICIO = "INICIO",              // INICIO
    FIM = "FIM",                    // FIM
    SUBROTINA = "SUBROTINA",        // SUBROTINA
    RETORNE = "RETORNE",            // RETORNE
    SE = "SE",                      // SE
    SENAO = "SENAO",                // SENAO
    ENQUANTO = "ENQUANTO",          // ENQUANTO
    PARA = "PARA",                  // PARA
    ATE = "ATE",                    // ATE
    FACA = "FACA",                  // FACA
    REPITA = "REPITA",              // REPITA
    ESCREVA = "ESCREVA",            // ESCREVA
    LEIA = "LEIA",                  // LEIA
    VERDADEIRO = "VERDADEIRO",      // VERDADEIRO
    FALSO = "FALSO",                // FALSO
    OU = "OU",                      // OU
    E = "E",                        // E
    NAO = "NAO"                     // NAO

}