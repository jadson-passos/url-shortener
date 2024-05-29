import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { Prisma } from '@prisma/client';

const authService = new AuthService();

export class AuthController {
  async register(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const user = await authService.register(email, password);
      return response.status(201).json(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          error.meta?.target.includes('email')
        ) {
          return response.status(400).json({ message: 'Email already exists' });
        }
      }
      console.error('Error during registration:', error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const token = await authService.login(email, password);
      return response.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        return response.status(400).json({ message: 'Invalid email or password' });
      } else {
        console.error('Error during login:', error);
        return response.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  
}

