import { prismaClient } from '../utils/prisma'; 

import { Request, Response } from 'express';
import { UrlService } from '../services/UrlService';

const urlService = new UrlService();

export class UrlController {
    async shortenUrl(request: Request, response: Response): Promise<Response> {
        try {
          const { originalUrl } = request.body;
          const userId = request.userId; 
          const shortUrl = await urlService.shortenUrl(originalUrl, userId);
          return response.status(201).json({ shortUrl });
        } catch (error) {
          console.error("Error shortening URL:", error);
          return response.status(500).json({ message: "Internal server error" });
        }
    }

    async listUserUrls(request: Request, response: Response): Promise<Response> {
        try {
          const userId = request.userId;
      
          if (!userId) {
            const errorMessage = "User ID is missing";
            console.error(errorMessage);
            return response.status(400).json({ message: errorMessage });
          }
    
          const urls = await prismaClient.url.findMany({
            where: { userId, deletedAt: null },
          });
      
          console.log("User URLs:", urls);
      
          return response.status(200).json(urls);
        } catch (error) {
          console.error("Error fetching user URLs:", error);
          return response.status(500).json({ message: "Internal server error" });
        }
      }

    async editUrlDestination(request: Request, response: Response): Promise<Response> {
        try {
            const { shortUrl, newDestination } = request.body;
            const userId = request.userId;
    
            if (!userId || typeof shortUrl !== 'string' || typeof newDestination !== 'string' || !shortUrl.trim() || !newDestination.trim()) {
                const errorMessage = "Invalid request body";
                console.error(errorMessage);
                return response.status(400).json({ message: errorMessage });
            }
    
            const url = await urlService.findUrlByShortAndUserId(userId, shortUrl);
            
            if (!url) {
                const errorMessage = `URL not found or does not belong to the user: ${shortUrl}`;
                console.error(errorMessage);
                return response.status(404).json({ message: errorMessage });
            }            
    
            const updatedUrl = await urlService.editUrlDestination(userId, shortUrl, newDestination);
            if (!updatedUrl) {
                const errorMessage = "Failed to update URL destination";
                console.error(errorMessage);
                return response.status(500).json({ message: errorMessage });
            }
    
            console.log("URL destination successfully updated:", updatedUrl);
    
            return response.status(200).json(updatedUrl);
        } catch (error) {
            console.error("Error editing URL destination:", error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }    

    async deleteUrl(request: Request, response: Response): Promise<Response> {
        try {
            const { shortUrl } = request.body;
            const userId = request.userId;

            if (!userId) {
                const message = "User ID is missing";
                console.error(message);
                return response.status(400).json({ message });
            }

            await urlService.deleteUrl(userId, shortUrl);
            const successMessage = `URL with shortUrl: ${shortUrl} deleted successfully for userId: ${userId}`;
            console.log(successMessage);
            return response.status(200).json({ message: successMessage });
        } catch (error) {
            const errorMessage = `Error deleting URL with shortUrl: ${shortUrl} for userId: ${userId}`;
            
            if (error instanceof Error) {
                console.error(`${errorMessage} - Error: ${error.message}`);
                return response.status(500).json({ message: "Internal server error", error: error.message });
            } else {
                console.error(errorMessage);
                return response.status(500).json({ message: "Internal server error" });
            }
        }
    }

    async redirectUrl(request: Request, response: Response): Promise<void> {
        try {
            const { short } = request.params;
            const originalUrl = await urlService.getOriginalUrlAndIncrementClicks(short);
            response.redirect(originalUrl);
        } catch (error) {
            response.status(404).json({ message: "URL not found" });
        }
    }
}

