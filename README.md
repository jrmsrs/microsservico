# microssistema 📦

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_microsservico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jrmsrs_microsservico)

## setup do ambiente 🛠

### implementação 📝

- node.js + express
- typescript

### repositório remoto 📚

- [github](http://github.com/jrmsrs/microsservico) + github actions
  
### testing 🧪

- [jest](https://jestjs.io/) - unit tests, mocks, test coverage
- [supertest](https://www.npmjs.com/package/supertest) - integration tests

### CI/CD 🚧

- [sonarcloud](https://sonarcloud.io/) - "cloud service offered by sonarsource that helps you with code quality management"
  
  link do projeto: https://sonarcloud.io/project/overview?id=jrmsrs_microsservico

### deployment 🚀

- [vercel](https://vercel.com/) - "vercel is a free cloud platform for static sites and serverless functions that fits perfectly with your workflow"
  
  live demo: http://ms-equipamento.vercel.app

### docs auto-gerada 📖

- [swagger](https://swagger.io/) com o middleware [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) + [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
  
  link da doc: https://ms-equipamento.vercel.app/docs

### ide 👨‍💻

- [visual studio code](https://code.visualstudio.com/) - com as extensões:
  - [sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode): helps you detect and fix quality issues as you write code
  - [standardjs](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs): javascript standard style
  - [git graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph): make git looks less painful

### features ✨

- realiza testes automaticamente antes de cada commit para evitar códigos quebrados com o pacote [husky](https://www.npmjs.com/package/husky)
