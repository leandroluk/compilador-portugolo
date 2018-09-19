/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package lexer;

/**
 *
 * @author gustavo
 */
public enum Tag {
    
    // fim de arquivo
    EOF,
    
    //Operadores
    RELOP_LT,       // <
    RELOP_LE,       // <=
    RELOP_GT,       // >
    RELOP_GE,       // >=
    RELOP_EQ,       // ==
    RELOP_NE,       // !=
    RELOP_ASSIGN,   // =
    RELOP_SUM,      // +
    RELOP_MINUS,    // -
    RELOP_MULT,     // *
    RELOP_DIV,      // /
    
    //Simbolos
    SMB_OP,         // (
    SMB_CP,         // )
    SMB_SEMICOLON,  // ;
    
    //identificador
    ID,
    
    //numeros
    INTEGER,
    DOUBLE,
    
    //strings
    STRING,
    
    // palavra reservada
    KW;
}
