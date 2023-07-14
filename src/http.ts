import Axios from 'axios'

export const Aluguel = Axios.create({
  baseURL: 'https://microsservico-aluguel.vercel.app',
  headers: {
    'Content-type': 'application/json'
  },
  timeout: 60000
})

export const Externo = Axios.create({
  baseURL: 'https://externo-pm.onrender.com',
  headers: {
    'Content-type': 'application/json'
  },
  timeout: 60000
})
