import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/CustomRequest'
import * as transactionService from '../services/transactionService'
import { joinFreeGroupSchema } from '../utils/schema/group'

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = joinFreeGroupSchema.safeParse(req.body)
    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        details: errorMessages
      })
    }

    const data = await transactionService.createTransaction(
      parse.data.group_id,
      req?.user?.id || ''
    )
    res
      .status(200)
      .json({ success: true, message: 'Transaction created', data })
  } catch (error) {
    next(error)
  }
}

export const updateTransactionStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionService.updateTransactionStatus(
      req.body.order_id,
      req.body.transaction_status
    )
    res
      .status(200)
      .json({ success: true, message: 'Transaction status updated', data })
  } catch (error) {
    next(error)
  }
}

export const getRevenueStat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionService.getRevenueStat(req?.user?.id || '')
    res
      .status(200)
      .json({ success: true, message: 'Revenue statistics retrieved', data })
  } catch (error) {
    next(error)
  }
}

export const getHistoryPayouts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionService.getHistoryPayouts(req?.user?.id || '')
    res
      .status(200)
      .json({ success: true, message: 'History payouts retrieved', data })
  } catch (error) {
    next(error)
  }
}
