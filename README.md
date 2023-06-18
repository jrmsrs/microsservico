# microserviço equipamento 📦

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_microsservico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jrmsrs_microsservico)

## sobre 📖

microsserviço para gerenciamento de equipamentos de um sistema de controle de bicicletário

gerencia bicicletas, cadeados e totens

## integrações 🌐

- [microserviço aluguel](): gerenciamento de funcionários, cliclistas e aluguéis
- [microserviço externo](): comunicação com sistemas externos de envio de e-mail e cobranças

## setup do ambiente 🛠

### implementação 📝

- node.js + express
- typescript

### repositório remoto 📡

- [github](http://github.com/jrmsrs/microsservico) + github actions
  
### testes 🧪

- [jest](https://jestjs.io/) - testes de unidade, mocks e cobertura
- [supertest](https://github.com/ladjs/supertest) - testes de integração

### CI/CD 🚧

- [sonarcloud](https://sonarcloud.io/) - inspeção contínua de código e análise de qualidade com cobertura de testes, duplicação de código, vulnerabilidades, bugs e code smells
  
  link do projeto: https://sonarcloud.io/project/overview?id=jrmsrs_microsservico

### deploy 🚀

- [vercel](https://vercel.com/) - plataforma gratuita de deploy automático de aplicações javascript integrada com o github
  
  live demo: http://ms-equipamento.vercel.app

### docs auto-gerada 📚

- [swagger](https://swagger.io/) com o middleware [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
  
  link da doc: https://ms-equipamento.vercel.app/docs

### ide 👨‍💻

- [visual studio code](https://code.visualstudio.com/) - com as extensões:
  - [sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode): detecta bugs, vulnerabilidades e code smells enquanto escreve o código
  - [standardjs](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs): javascript standard style
  - [git graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph): interface gráfica pra git

### features ✨

- realiza testes automaticamente antes de cada commit para evitar códigos quebrados com o pacote [husky](https://github.com/typicode/husky)
