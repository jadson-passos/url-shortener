import { Router } from 'express';
import { UrlController } from '../controllers/UrlController';
import { authMiddleware } from '../middlewares/authMiddleware';

const urlRoutes = Router();
const urlController = new UrlController();

urlRoutes.post('/url', authMiddleware, urlController.shortenUrl);
urlRoutes.get('/urls', authMiddleware, urlController.listUserUrls);
urlRoutes.put('/url', authMiddleware, urlController.editUrlDestination);
urlRoutes.delete('/url', authMiddleware, urlController.deleteUrl);
urlRoutes.get('/:short', urlController.redirectUrl);

export { urlRoutes };

