# microsserviço equipamento 📦

[![quality gate status](https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_microsservico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jrmsrs_microsservico)

## sobre 📖

microsserviço para gerenciamento de equipamentos de um sistema de controle de bicicletário - gerencia o sistema de bicicletas, trancas e estações de um bicicletário

esse sistema de controle de bicicletário é um backend composto por 3 microsserviços que se comunicam entre si e com sistemas externos onde alguns endpoints são acessados internamente e outros pelo frontend

## [descrição dos endpoints 📡](/src/routes/README.md#descrição-dos-endpoints-📡)

- [/bicicleta/*](/src/routes/README.md#bicicleta-🚲): bicicletas
- [/tranca/*](/src/routes/README.md#tranca-🔒): trancas
- [/totem/*](/src/routes/README.md#totem-🏬): estações

## integrações (grupo) 🌐

- [microsserviço aluguel (kevincrys/microsservicoAluguel)](https://github.com/kevincrys/microsservicoAluguel): gerenciamento de funcionários, ciclistas e aluguéis
- [microsserviço externo (Mad-Clap/Externo_PM)](https://github.com/Mad-Clap/Externo_PM): gerenciamento de cobranças, comunicação com sistemas externos de envio de e-mail e cartão de credito

## setup do ambiente 🛠

### implementação 📝

- node.js + express
- typescript

### [padrão de projeto 🏗](/src/README.md)
- [estrutura de pastas](/src/README.md#estrutura-de-pastas-🗄️)
- [fluxo de dados](/src/README.md#fluxo-de-dados-📊)
- [descrição das pastas](/src/README.md#descrição-das-pastas-📁)
- [testes](/src/README.md#testes-🧪)

### banco de dados 💾

- [supabase](https://supabase.io/) ([postgresql](https://www.postgresql.org/)) - banco de dados relacional com api restful compatível com typescript

### repositório remoto 📡

- [github](http://github.com/jrmsrs/microsservico) + github actions

### testes 🧪

- [jest](https://jestjs.io/) - testes de unidade, mocks e cobertura
- [supertest](https://github.com/ladjs/supertest) - [testes de integração](/src/routes/)

### ci/cd 🚧

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
- schemes do banco supabase auto-gerado com o script `yarn gentypes`
