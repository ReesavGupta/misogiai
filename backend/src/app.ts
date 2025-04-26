import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import routes
import indexRouter from './routes/index.router'

app.use('/api', indexRouter)


export default app
