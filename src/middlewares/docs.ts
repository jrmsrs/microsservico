import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css'

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Equipamentos API',
      version,
      description: 'Microsserviço para gerenciamento de Equipamentos de um Sistema de Controle de Bicicletário',
      contact: {
        name: 'jrmsrs',
        email: 'jrmsrs2.0@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://github.com/jrmsrs/microsservico/blob/master/LICENSE'
      }
    },
    tags: [
      {
        name: 'Aplicação',
        description: 'Endpoints gerais'
      },
      {
        name: 'Bicicleta',
        description: 'Endpoints para gerenciamento de bicicletas'
      }
    ],
    externalDocs: {
      description: 'Github',
      url: 'https://github.com/jrmsrs/microsservico'
    }
  },
  apis: [
    './src/routes/*.ts'
  ]
}

export default {
  path: '/docs',
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerJSDoc(options), { customCssUrl: CSS_URL })
}
