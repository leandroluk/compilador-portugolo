/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package lexer;

import java.io.*;

/**
 *
 * @author gustavo
 */
public class LexerProfessor {
    
   private static final int END_OF_FILE = -1; // contante para fim do arquivo
   private static int lookahead = 0; // armazena o último caractere lido do arquivo	
   public static int n_line = 1; // contador de linhas
   public static int n_column = 1; // contador de linhas
   private RandomAccessFile instance_file; // referencia para o arquivo
   private static TS tabelaSimbolos; // tabela de simbolos
    
   public LexerProfessor(String input_data) {
		
      // Abre instance_file de input_data
      try {
         instance_file = new RandomAccessFile(input_data, "r");
      }
      catch(IOException e) {
         System.out.println("Erro de abertura do arquivo " + input_data + "\n" + e);
         System.exit(1);
      }
      catch(Exception e) {
         System.out.println("Erro do programa ou falha da Tabela de Simbolos\n" + e);
         System.exit(2);
      }
   }
    
   // Fecha instance_file de input_data
   public void fechaArquivo() {

      try {
         instance_file.close();
      }
      catch (IOException errorFile) {
         System.out.println ("Erro ao fechar arquivo\n" + errorFile);
         System.exit(3);
      }
   }
    
   //Reporta erro para o usuário
   public void sinalizaErro(String mensagem) {
      System.out.println("[Erro Lexico]: " + mensagem + "\n");
   }
    
   //Volta uma posição do buffer de leitura
   public void retornaPonteiro() {

      try {
         // Não é necessário retornar o ponteiro em caso de Fim de Arquivo
         if(lookahead != END_OF_FILE) {
            instance_file.seek(instance_file.getFilePointer() - 1);
         }    
      }
      catch(IOException e) {
         System.out.println("Falha ao retornar a leitura\n" + e);
         System.exit(4);
      }
   }
    
    /* TODO:
    //[1]   Voce devera se preocupar quando incremetar as linhas e colunas,
    //      assim como quando decrementar ou reseta-las.
    //[2]   Toda vez que voce encontrar um lexema completo, voce deve retornar
    //      um objeto new Token(Tag, "lexema", linha, coluna). Cuidado com as
    //      palavras reservadas que ja sao cadastradas na TS. Essa consulta
    //      voce devera fazer somente quando encontrar um Identificador.
    //[3]   Se o caractere lido nao casar com nenhum caractere esperado,
    //      apresentar a mensagem de erro na linha e coluna correspondente.
    
    */
    // Obtém próximo token: esse metodo simula um AFD
   public Token proxToken() {

      StringBuilder lexema = new StringBuilder();
      int estado = 1;
      char c;
		
      while(true) {
         c = '\u0000'; // null char
            
         // avanca caractere ou retorna token
         try {
            // read() retorna um inteiro. -1 em caso de EOF
            lookahead = instance_file.read();
                
            if(lookahead != END_OF_FILE) {
               c = (char) lookahead; // conversao int para char
            }
         }
         catch(IOException e) {
            System.out.println("Erro na leitura do arquivo");
            System.exit(3);
         }
            
         // movimentacao do automato
         switch(estado) {
            // estado 1
            case 1:
               if(lookahead == END_OF_FILE)
                  return new Token(Tag.EOF, "EOF", n_line, n_column);
               else if(c == ' ' || c == '\t' || c == '\n' || c == '\r') {
                  // Permance no estado = 1
                  estado = 1;
               }
               else if(Character.isLetter(c)) {
                  lexema.append(c);
                  estado = 17;
               }
               else if(Character.isDigit(c)) {
                  lexema.append(c);
                  estado = 19;
               }
               else if(c == '<') {
                  estado = 6;
               }
               else if(c == '>') {
                  estado = 9;
               }
               else if(c == '=') {
                  estado = 12;
               }
               else if(c == '!') {
                  estado = 15;
               }
               else if(c == '/') {
                  //estado = 5;
                  return new Token(Tag.RELOP_DIV, "/", n_line, n_column);
               }
               else if(c == '*') {
                  //estado = 4;
                  return new Token(Tag.RELOP_MULT, "*", n_line, n_column);
               }
               else if(c == '+') {
                  //estado = 2;
                  return new Token(Tag.RELOP_SUM, "+", n_line, n_column);
               }
               else if(c == '-') {
                  //estado = 3;
                  return new Token(Tag.RELOP_MINUS, "-", n_line, n_column);
               }
               else if(c == ';') {
                  //estado = 27;
                  return new Token(Tag.SMB_SEMICOLON, ";", n_line, n_column);
               }
               else if(c == '(') {
                  //estado = 28;
                  return new Token(Tag.SMB_OP, "(", n_line, n_column);
               }
               else if(c == ')') {
                  //estado = 29;
                  return new Token(Tag.SMB_CP, ")", n_line, n_column);
               }
               else if(c == '"') {
                  estado = 24;
               }
               else {
                  sinalizaErro("Caractere invalido " + c + " na linha " + n_line + " e coluna " + n_column);
                  return null;
               }
               break;
            case 6:
               if(c == '=') {
                  //estado = 7;
                  return new Token(Tag.RELOP_LE, "<=", n_line, n_column);
               }
               else {
                  //estado = 8;
                  retornaPonteiro();
                  return new Token(Tag.RELOP_LT, "<", n_line, n_column);
               }
            case 9:
               if(c == '=') {
                  //estado = 10;
                  return new Token(Tag.RELOP_GE, ">=", n_line, n_column);
               }
               else {
                  //estado = 11;
                  retornaPonteiro();
                  return new Token(Tag.RELOP_GT, ">", n_line, n_column);
               }
            case 12:
               if (c == '=') {
                  //estado = 13;
                  return new Token(Tag.RELOP_EQ, "==", n_line, n_column);
               }
               else {
                  //estado = 14;
                  retornaPonteiro();
                  return new Token(Tag.RELOP_ASSIGN, "=", n_line, n_column);
               }
            case 15:
               if( c == '=') {
                  //estado = 16;
                  return new Token(Tag.RELOP_NE, "!=", n_line, n_column);
               }
               else {
                  retornaPonteiro();
                  sinalizaErro("Token incompleto para o caractere [!] na linha " + n_line + " e coluna " + n_column);
                  return null;
               }
            case 17:
               if(Character.isLetterOrDigit(c)) {
                  lexema.append(c);
                  // Permanece no estado 17
               }
               else {
                  //estado = 18;
                  retornaPonteiro();
                  return new Token(Tag.ID, lexema.toString(), n_line, n_column);
               }
               break;
            case 19:
               if(Character.isDigit(c)) {
                  lexema.append(c);
                  // Permanece no estado 19
               }
               else if (c == '.') {
                  lexema.append(c);
                  estado = 21;
               }
               else {
                  //estado = 20;
                  retornaPonteiro();
                  return new Token(Tag.INTEGER, lexema.toString(), n_line, n_column);
               }
               break;
            case 21:
               if(Character.isDigit(c)) {
                  lexema.append(c);
                  estado = 22;
               }
               else {
                  retornaPonteiro();
                  sinalizaErro("Padrao para [ConstNumDouble] invalido na linha " + n_line + " coluna " + n_column);
                  return null;
               }
               break;
            case 22:
               if(Character.isDigit(c)) {
                  lexema.append(c);
                  // permanece no estado 22
               }
               else {
                  //estado = 23;
                  retornaPonteiro();
                  return new Token(Tag.DOUBLE, lexema.toString(), n_line, n_column);
               }
               break;
            case 24:
               if(c == '"') {
                  sinalizaErro("String deve conter pelo menos um caractere. Erro na linha " + n_line + " coluna " + n_column);
                  return null;
               }
               else if(c == '\n') {
                  sinalizaErro("Padrao para [ConstString] invalido na linha " + n_line + " coluna " + n_column);
                  return null;
               }
               else if(lookahead == END_OF_FILE) {
                  sinalizaErro("String deve ser fechada com \" antes do fim de arquivo");
                  return null;
               }
               else {
                  lexema.append(c);
                  estado = 25;
               }
               break;
            case 25:
               if(c == '"') {
                  //estado = 26;
                  return new Token(Tag.STRING, lexema.toString(), n_line, n_column);
               }
               else if(c == '\n') {
                  sinalizaErro("Padrao para [ConstString] invalido na linha " + n_line + " coluna " + n_column);
                  return null;
               }
               else if(lookahead == END_OF_FILE) {
                  sinalizaErro("String deve ser fechada com \" antes do fim de arquivo");
                  return null;
               }
               else {
                  lexema.append(c);
                  // permanece no estado 25
               }
               break;
         } // fim switch
      } // fim while
   } // fim proxToken()

    /**
     * @param args the command line arguments
     */
   public static void main(String[] args) {
      LexerProfessor lexer = new LexerProfessor("HelloJavinha.jvn");
      Token token;
      tabelaSimbolos = new TS();

      // Enquanto nao houver erros ou nao for fim de arquivo:
      do {
         token = lexer.proxToken();
            
         // Imprime token
         if(token != null) {
            System.out.println("Token: " + token.toString() + "\t Linha: " + n_line + "\t Coluna: " + n_column);
         }
	     
      } while(token != null && token.getClasse() != Tag.EOF);
	
      lexer.fechaArquivo();
        
      // Imprime a tabela de simbolos
      System.out.println("");
      System.out.println("Tabela de simbolos:");
      System.out.println(tabelaSimbolos.toString());
   } 
}
