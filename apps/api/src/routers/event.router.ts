import { EventController } from '@/controllers/event.controller';
import { verifyToken } from '@/middlewares/token';
import { uploader } from '@/middlewares/uploader';
import { Router } from 'express';
import multer from 'multer';

const testUpload = multer();

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.eventController.getEvents);

    this.router.get('/user/:userId', this.eventController.getEvents);

    this.router.post(
      '/',
      uploader('event-', '/event').single('image'),
      verifyToken,
      this.eventController.createEvents,
    );

    this.router.get('/category-location', this.eventController.getCategoryLocation)

    this.router.get('/:slug', this.eventController.getEventSlug)

    this.router.post('/voucher', testUpload.none(), verifyToken, this.eventController.createVoucher)

    this.router.post('/review', testUpload.none(), verifyToken, this.eventController.createReview)

    this.router.get('/review/available', verifyToken, this.eventController.getReviewAvailable)

    this.router.get('/review/already', verifyToken, this.eventController.getReviewAlready)

  }

  getRouter(): Router {
    return this.router;
  }
}
