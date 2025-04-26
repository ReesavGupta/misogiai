import express from 'express'
import cors from 'cors'
import cookie from 'cookie-parser'

const app = express()

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie())
// Import routes
import indexRouter from './routes/index.router'

app.use('/api', indexRouter)

export default app
