import Axios from 'axios'

export const Aluguel = Axios.create({
  baseURL: 'https://microsservico-aluguel.vercel.app/',
  headers: {
    'Content-type': 'application/json'
  }
})

export const Externo = Axios.create({
  baseURL: 'https://externopm-production.up.railway.app',
  headers: {
    'Content-type': 'application/json'
  }
})
