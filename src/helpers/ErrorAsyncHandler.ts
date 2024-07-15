import { NextFunction, Request, Response } from 'express'

export const handleErrorAsync = (func: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    return await func(req, res, next)
  } catch (error: any) {
    const status = error.status || 500
    
    res.status(status).json({
      code: error.code,
      messages: error.messages,
    })
  }
}