/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package lexer;

import java.util.Map;
import java.util.HashMap;

/**
 *
 * @author gustavo
 */
public class TS {
    
    private HashMap<String, Token> tabelaSimbolos; // Tabela de símbolos do ambiente

    public TS() {
        tabelaSimbolos = new HashMap();

        // Inserindo as palavras reservadas
        Token word;
        word = new Token(Tag.KW, "public", 0, 0);
        this.tabelaSimbolos.put("public", word);
        
        word = new Token(Tag.KW, "class", 0, 0);
        this.tabelaSimbolos.put("class", word);
        
        word = new Token(Tag.KW, "SystemOutDispln", 0, 0);
        this.tabelaSimbolos.put("SystemOutDispln", word);
        
        word = new Token(Tag.KW, "end", 0, 0);
        this.tabelaSimbolos.put("end", word);
        
        word = new Token(Tag.KW, "integer", 0, 0);
        this.tabelaSimbolos.put("integer", word);

        word = new Token(Tag.KW, "double", 0, 0);
        this.tabelaSimbolos.put("double", word);
        
        word = new Token(Tag.KW, "string", 0, 0);
        this.tabelaSimbolos.put("string", word);
    }
    
    public void put(String s, Token w) {
        tabelaSimbolos.put(s, w);
    }

    // Pesquisa na tabela de símbolos se há algum token com determinado lexema
    // vamos usar esse metodo somente para diferenciar ID e KW
    public Token retornaToken(String lexema) {
		  Token token = tabelaSimbolos.get(lexema); 
		  return token;   	
    }
    
    @Override
    public String toString() {
        String saida = "";
        int i = 1;
        
        for(Map.Entry<String, Token> entry : tabelaSimbolos.entrySet()) {
            saida += ("posicao " + i + ": \t" + entry.getValue().toString()) + "\n";
            i++;
        }
        return saida;
    }
}