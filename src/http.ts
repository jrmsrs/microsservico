import Axios from 'axios'

export const Aluguel = Axios.create({
  baseURL: 'https://todo',
  headers: {
    'Content-type': 'application/json'
  }
})

export const Externo = Axios.create({
  baseURL: 'https://todo',
  headers: {
    'Content-type': 'application/json'
  }
})
