import express from 'express'
import middlewares from './middlewares/index'
import routes from './routes/index'
import { errorHandler } from './error/error-handler'

const app = express()

middlewares(app)
routes(app)
app.use(errorHandler)

export default app
