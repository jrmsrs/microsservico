import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { tags } from './tags'
import { components } from './components'
import { info, externalDocs } from './info'

const options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info,
    tags,
    components,
    externalDocs
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js' // vercel build
  ]
}

export default {
  path: '/docs',
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(
    swaggerJSDoc(options),
    {
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css'
    }
  )
}
