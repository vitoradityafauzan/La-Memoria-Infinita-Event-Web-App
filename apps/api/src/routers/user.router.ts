import { UserController } from '@/controllers/user.controller';
import {
  checkExperience,
  checkOrganizer,
  verifyToken,
} from '@/middlewares/token';
import { validateRegister } from '@/middlewares/validator';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // protected routes
    this.router.get('/', verifyToken, this.userController.getUser);
    this.router.get('/:id', this.userController.getUserId);
    this.router.put('/update', verifyToken, this.userController.updateUser); // Added route for updating user

    // public routes
    this.router.post('/', this.userController.createUser);
    this.router.post('/login', this.userController.loginUser);
    this.router.patch('/verify', verifyToken, this.userController.verifyUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
