# padrão de projeto 📦
- arquitetura mvc com camada de serviços e repositórios.

## estrutura de pastas 🗄️
```
src
├───controllers
├───enums
├───middlewares
├───models
├───repositories
├───routes
├───services
└───utils
```

## fluxo de dados 📊
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://jrmsrs.github.io/supersecrepcto/dataflow-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://jrmsrs.github.io/supersecrepcto/dataflow.png">
  <img alt="dataflow: route -> controller -> service -> repository -> db/in-memory" src="https://jrmsrs.github.io/supersecrepcto/dataflow.png">
</picture>

## descrição das pastas 📁

### controllers
responsável por receber as requisições e enviar as respostas.

### enums
responsável por armazenar os enums da aplicação.

### middlewares
responsável por interceptar as requisições. 

### models
responsável por representar as entidades do banco de dados. 

### repositories
responsável por fazer a comunicação com o banco de dados ou com a camada de memória.  

### routes
responsável por definir as rotas da aplicação. 

### services
responsável por fazer a regra de negócio da aplicação.

### utils
responsável por armazenar funções que podem ser utilizadas em mais de um lugar da aplicação.

## testes 🧪

### testes unitários

arquivos `*.spec.ts` responsáveis por testar uma unidade do código, ou seja, uma função, um método, uma classe, etc.

### testes de integração

arquivos `*.test.ts` responsáveis por testar a integração entre duas ou mais unidades do código, ou seja, testar a integração entre funções, métodos, classes, etc. 

