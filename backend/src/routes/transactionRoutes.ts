import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import * as transactionController from '../controllers/transactionControllers'

const transactionRoutes = express.Router()

transactionRoutes.post(
  '/payment',
  verifyToken,
  transactionController.createTransaction
)
transactionRoutes.post(
  '/handle-payment',
  transactionController.updateTransactionStatus
)

transactionRoutes.get(
  '/revenue-stat',
  verifyToken,
  transactionController.getRevenueStat
)

export default transactionRoutes
