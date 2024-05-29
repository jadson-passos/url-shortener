import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthController } from '../src/controllers/AuthController';
import { AuthService } from '../src/services/AuthService';

jest.mock('../src/services/AuthService');

const prisma = new PrismaClient();

async function getUsers() {
  return prisma.user.findMany();
}

async function closePrisma() {
  await prisma.$disconnect();
}

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  describe('register', () => {
    it('should return 201 and the user data on successful registration', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      authService.register.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authController.register(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return 400 if email already exists', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      authService.register.mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      await authController.register(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should return 500 on internal server error', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      authService.register.mockRejectedValueOnce(new Error('Some error occurred'));

      await authController.register(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('login', () => {
    it('should return 200 and a token on successful login', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      authService.login.mockResolvedValueOnce('fakeToken');

      await authController.login(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });

    it('should return 500 on internal server error', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      authService.login.mockRejectedValueOnce(new Error('Some error occurred'));

      await authController.login(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
