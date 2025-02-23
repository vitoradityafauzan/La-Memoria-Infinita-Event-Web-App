import { Router } from 'express';
import { LoginController } from '@/controllers/login.controller';

export class LoginRouter {
  private router: Router;
  private loginController: LoginController;

  constructor() {
    this.loginController = new LoginController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
  }

  getRouter(): Router {
    return this.router;
  }
}
