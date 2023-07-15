import app from './app'
import { Aluguel } from './http'

const port = 3333
app.listen(port, () => {
  // pinga o microsserviço de Aluguel para que ele esteja ativo quando o servidor for iniciado
  Aluguel.get('/').catch(() => {})

  console.log(`Server is running at http://localhost:${port}`)
})
