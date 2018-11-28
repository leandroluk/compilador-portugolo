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
    ID,              // ID
    ALGORITMO,       // ALGORITMO
    DECLARE,         // DECLARE
    INICIO,          // INICIO
    FIM,             // FIM
    SUBROTINA,       // SUBROTINA
    RETORNE,         // RETORNE
    SE,              // SE
    SENAO,           // SENAO
    ENQUANTO,        // ENQUANTO
    PARA,            // PARA
    ATE,             // ATE
    FACA,            // FACA
    REPITA,          // REPITA
    ESCREVA,         // ESCREVA
    LEIA,            // LEIA
    VERDADEIRO,      // VERDADEIRO
    FALSO,           // FALSO
    OU,              // OU
    E,               // E
    NAO              // NAO

}