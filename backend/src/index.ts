import app from './app'
import prisma from '../prisma/client'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
