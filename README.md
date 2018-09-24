# Compilador Portugolo
### Responsáveis
 - Leandro Santiago Gomes <https://github.com/leandroluk>
 - André Luiz Gomes lages <https://github.com/andrelgl>
 
### Introdução
Este é um projeto desenvolvido para a matéria de compiladores do 6º período da faculdade UniBH (Centro Universitário de Belo Horizonte). A idéia é criar um compilador que faz a interpretação dos 3 passos de compilação de uma linguagem que o professor crio chamada PORTUGOLO. 

### Dependências
 - NodeJS <https://nodejs.org/en/>
 
### Como rodar o projeto
1. É necessário instalar as dependencias do projeto após a extração do mesmo. Para isso, abra o terminal no diretório raiz do projeto (mesmo diretório do arquivo `package.json`) e rode o arquivo **INSTALAR_DEPENDENCIAS.bat**. Ele irá instalar todas as dependencias para o funcionamento.
2. É possível fazer a bateria de testes unitários de todos os arquivos com base em cada arquivo `*.spec.ts`. Para isso, rode o arquivo **RODAR_TESTES_UNITARIOS.bat**.
3. Para rodar qualquer outro teste, utilize os arquivos que estão na pasta './tests' onde `main.ts` funciona como a classe de inicialização no projeto de exemplo. Esse arquivo está configurado para procurar o arquivo chamado `arquivo_de_teste.ptgl` que se encontra no mesmo diretório e fazer os testes sobre o mesmo.

