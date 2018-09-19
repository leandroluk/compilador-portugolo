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
public class Token {
    
   private Tag nome;
   private String lexema;
   private int linha;
   private int coluna;
	
   public Token(Tag nome, String lexema, int linha, int coluna) {

      this.nome = nome;
      this.lexema = lexema;
      this.linha = linha;
      this.coluna = coluna;
   }
	
   public Tag getClasse() {
		
      return nome;
   }
	
   public void setClasse(Tag nome) {
		
      this.nome = nome;
   }
	
   public String getLexema() {
	
      return lexema;
   }
	
   public void setLexema(String lexema) {
		
      this.lexema = lexema;
   }
    
   public int getLinha() {
      return linha;
   }

   public void setLinha(int linha) {
      this.linha = linha;
   }

   public int getColuna() {
      return coluna;
   }

   public void setColuna(int coluna) {
      this.coluna = coluna;
   }
    
   @Override
   public String toString() {
      return "<" + nome + ", \"" + lexema + "\">";
   }
}