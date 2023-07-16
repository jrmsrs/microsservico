# rotas 🛣️

## testes de integração 🧪

nesse diretório estão os testes de integração, que testam a integração do sistema com o banco de dados e com os outros microsserviços para todas as rotas desse microsserviço, utilizando a biblioteca [supertest](https://npmjs.com/package/supertest) para fazer as requisições http e [jest](https://jestjs.io/) para fazer os testes.

## descrição dos endpoints 📡

veja mais detalhes na [documentação](https://ms-equipamento.vercel.app/docs) do swagger

### /bicicleta/* 🚲

uma bicicleta é cadastrada como "nova" (``post /bicicleta``) quando é adicionada ao sistema, e para ser usada primeiro precisa ser incluída no sistema, o que é feito ao ser integrado numa tranca pela primeira vez passando para o estado "disponível" (``post /bicicleta/integrarNaRede``).

depois de integrada ela pode ser alugada por um ciclista passando para o estado "em uso" (``post (aluguel) /alugar``), quando o ciclista a devolve ela passa para o estado "disponível" novamente (``post (aluguel) /devolver``) ou o ciclista pode solicitar um reparo passando para o estado "reparo solicitado" (``post /bicicleta/status/:status``). 

um funcionário do bicicletário pode aceitar o reparo passando para o estado "em reparo" (``post /bicicleta/retirarDaRede``) ou recusar passando para o estado "disponível" novamente (``post /bicicleta/status/:status``), outra opção é passar para o estado "aposentada" (``post /bicicleta/retirarDaRede``) quando a bicicleta não pode mais ser usada.

### /tranca/* 🔒

uma tranca é cadastrada como "nova" (``post /tranca``) quando é adicionada ao sistema, e para ser usada primeiro precisa ser integrada a uma estação de bicicletário passando para o estado "livre" (``post /tranca/integrarNaRede``).

depois de integrada, uma bicicleta pode ser integrada a ela (``post /bicicleta/integrarNaRede``), ou trancada (``post /tranca/:id/trancar``), passando para o estado "ocupada", e quando a bicicleta é retirada (``post /tranca/:id/destrancar``) ela passa para o estado "livre" novamente.

um funcionário do bicicletário pode acionar o estado "em reparo" (``post /tranca/:id/retirarDaRede``) ou "aposentada" (``post /tranca/:id/retirarDaRede``) quando a tranca não pode mais ser usada.

### /totem/* 🏬

uma estação (totem) é cadastrada pronto para uso (``post /totem``), onde o funcionário deve fornecer o endereço e a descrição da estação. 

o funcionário pode obter uma lista de bicicletas (``get /totem/:id/bicicletas``) e trancas (``get /totem/:id/trancas``) incluídas na estação.