import express from 'express'

const { json, urlencoded } = express
const jsonMiddleware = json()
const urlencodedMiddleware = urlencoded({ extended: true })
const expressMiddlewares = { jsonMiddleware, urlencodedMiddleware }

export default expressMiddlewares
