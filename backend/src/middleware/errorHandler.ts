import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource not found'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};