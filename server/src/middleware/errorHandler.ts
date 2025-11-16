import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  errors?: any[];
}

const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    status,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const response: any = {
    error: message,
  };

  // Include additional error details in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    if (err.errors) {
      response.errors = err.errors;
    }
  }

  res.status(status).json(response);
};

export default errorHandler;
