import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(request: Request, response: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ message: 'Token not provided' });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    request.userId = (decoded as any).id;
    next();
  } catch (err) {
    response.status(401).json({ message: 'Token invalid' });
  }
}

