import { version } from '../../../package.json'

export const info = {
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
}

export const externalDocs = {
  description: 'Github',
  url: 'https://github.com/jrmsrs/microsservico'
}

export const servers = [
  {
    description: 'Local',
    url: 'http://localhost:3000'
  },
  {
    description: 'Produção',
    url: 'https://ms-equipamento.vercel.app'
  }
]
