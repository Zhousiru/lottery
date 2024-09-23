import { NextFunction, Request, Response } from 'express'
import { $respondWith } from './utils'

export function checkAuthHeader(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers['authorization']
  if (!authorization) {
    return $respondWith(res, {
      success: false,
      msg: 'Invalid authorization header',
    })
  }

  next()
}
