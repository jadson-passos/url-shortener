import { Request, Response } from 'express';
import { UrlController } from '../src/controllers/UrlController';
import { UrlService } from '../src/services/UrlService';
import { PrismaClient } from '@prisma/client';

jest.mock('../src/services/UrlService');
jest.mock('@prisma/client');

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: jest.Mocked<UrlService>;
  let mockResponse: Partial<Response>;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(() => {
    urlService = new UrlService() as jest.Mocked<UrlService>;
    urlController = new UrlController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    } as Partial<Response>;
  });

  afterEach(async () => {
    
    jest.clearAllMocks();
  });

  afterAll(async () => {
    
    await prisma.$disconnect();
  });

  describe('shortenUrl', () => {
    
  });

  describe('listUserUrls', () => {
    
  });

  describe('editUrlDestination', () => {
    it('should return 200 and the updated URL on successful edit', async () => {
      const mockRequest = {
        body: {
          shortUrl: 'abc123',
          newDestination: 'https://newexample.com',
        },
        userId: 'user123',
      } as unknown as Request;

      urlService.editUrlDestination.mockResolvedValueOnce({ success: true, message: 'URL destination successfully updated', updatedUrl: 'https://newexample.com' });

      await urlController.editUrlDestination(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: 'URL destination successfully updated', updatedUrl: 'https://newexample.com' });
    });

    
  });

  describe('deleteUrl', () => {
    it('should return 200 and a success message on successful deletion', async () => {
      const mockRequest = {
        body: {
          shortUrl: 'abc123',
        },
        userId: 'user123',
      } as unknown as Request;

      await urlController.deleteUrl(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'URL with shortUrl: abc123 deleted successfully for userId: user123' });
    });

    
  });

  describe('redirectUrl', () => {
    it('should redirect to the original URL', async () => {
      const mockRequest = {
        params: {
          short: 'abc123',
        },
      } as unknown as Request;

      urlService.getOriginalUrlAndIncrementClicks.mockResolvedValueOnce('https://example.com');

      const redirectMockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      await urlController.redirectUrl(mockRequest, redirectMockResponse);

      expect(redirectMockResponse.redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should return 404 if the original URL is not found', async () => {
      const mockRequest = {
        params: {
          short: 'abc123',
        },
      } as unknown as Request;

      urlService.getOriginalUrlAndIncrementClicks.mockRejectedValueOnce(new Error('URL not found'));

      await urlController.redirectUrl(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'URL not found' });
    });
  });
});
