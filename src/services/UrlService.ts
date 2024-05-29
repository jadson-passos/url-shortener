import { PrismaClient, Url } from '@prisma/client';
import { generateShortCode } from '../utils/generateShortCode';

const prisma = new PrismaClient();

export class UrlService {
    [x: string]: any;
    async shortenUrl(originalUrl: string, userId?: string): Promise<string> {
        try {
          const shortCode = generateShortCode();
          const url = await prisma.url.create({
            data: {
              original: originalUrl,
              short: shortCode,
              userId,
            },
          });
          return `http://localhost:3000/${url.short}`;
        } catch (error) {
          console.error("Error shortening URL:", error);
          throw new Error("Failed to shorten URL");
        }
    }

async listUserUrls(userId: string): Promise<Url[]> {
    const urls = await prisma.url.findMany({
        where: { deletedAt: null }, 
    });
    return urls || [];
   }

async findUrlByShortAndUserId(userId: string, shortUrl: string): Promise<Url | null> {
    try {
        const url = await prisma.url.findFirst({
            where: {
                short: shortUrl,
                userId: userId,
                deletedAt: null
            }
        });
        return url;
    } catch (error) {
        console.error("Error finding URL by short and user ID:", error);
        return null;
    }
}

async editUrlDestination(userId: string, shortUrl: string, newDestination: string): Promise<{ success: boolean, message: string, updatedUrl: string | null }> {
    try {
        const url = await this.findUrlByShortAndUserId(userId, shortUrl);
        
        if (!url) {
            const errorMessage = `URL not found or does not belong to the user: ${shortUrl}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage, updatedUrl: null };
        }            

        if (url.original === newDestination) {
            const errorMessage = `New destination is same as the original URL: ${newDestination}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage, updatedUrl: null };
        }

        const updatedUrl = await prisma.url.update({
            where: {
                short: shortUrl,
                userId,
                deletedAt: null,
            },
            data: { original: newDestination },
        });

        console.log("URL destination successfully updated:", updatedUrl.original);

        return { success: true, message: "URL destination successfully updated", updatedUrl: updatedUrl.short };
    } catch (error) {
        console.error("Error editing URL destination:", error);
        return { success: false, message: "Internal server error", updatedUrl: null };
    }
}

async deleteUrl(userId: string, shortUrl: string): Promise<void> {
    try {
        await prisma.url.update({
            where: {
                short: shortUrl,
                userId,
                deletedAt: null,
            },
            data: { deletedAt: new Date() },
        });
    } catch (error) {
        console.error("Error deleting URL:", error);
        throw new Error("Failed to delete URL");
    }
}

async getOriginalUrlAndIncrementClicks(shortUrl: string): Promise<string> {
    const url = await prisma.url.update({
      where: { short: shortUrl },
      data: { clicks: { increment: 1 } },
    });
    return url.original;
  }
}
