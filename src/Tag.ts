export enum Tag {

    EOF,                // FIM DE ARQUIVO

    // OPERAÇÕES MATEMÁTICAS
    OP_LT,              // <
    OP_LE,              // <=
    OP_GT,              // >
    OP_GE,              // >=
    OP_LT_GT,           // <>
    OP_EQ,              // =
    OP_PLUS,            // +
    OP_MINUS,           // -
    OP_MULT,            // *
    OP_DIV,             // /
    OP_NQ,              // !=
    OP_ARTIB,           // <--

    // SIMBOLOS AUXILIARES
    SB_VIRG,            // ,
    SB_PVIRG,           // ;
    SB_AP,              // (
    SB_FP,              // )

    // TIPOS
    NUMERICO,           // NUMBER
    LITERAL,            // STRING
    LOGICO,             // BOOLEAN
    NULO,               // NULL

    // PARAVRAS RESERVADAS
    ID,                 // ID
    KW_ALGORITMO,       // ALGORITMO
    KW_DECLARE,         // DECLARE
    KW_INICIO,          // INICIO
    KW_FIM,             // FIM
    KW_SUBROTINA,       // SUBROTINA
    KW_RETORNE,         // RETORNE
    KW_SE,              // SE
    KW_SENAO,           // SENAO
    KW_ENQUANTO,        // ENQUANTO
    KW_PARA,            // PARA
    KW_ATE,             // ATE
    KW_FACA,            // FACA
    KW_REPITA,          // REPITA
    KW_ESCREVA,         // ESCREVA
    KW_LEIA,            // LEIA
    KW_VERDADEIRO,      // VERDADEIRO
    KW_FALSO,           // FALSO
    KW_OU,              // OU
    KW_E,               // E
    KW_NAO              // NAO

}