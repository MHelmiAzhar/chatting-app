import express, { type Express, type Response, type Request } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRoutes from './routes/userRoutes'
import errorHandler from './middlewares/errorHandler'
import groupRoutes from './routes/groupRoutes'
import transactionRoutes from './routes/transactionRoutes'

dotenv.config()

const app: Express = express()

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/groups', groupRoutes)
app.use('/api/v1/transactions', transactionRoutes)

app.use(errorHandler)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
