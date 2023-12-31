import AuthController from "@/controllers/auth.controller";
import { Routes } from "@/interfaces/routes.interface";
import ensureAuthenticated from "@/middlewares/ensureAuthenticated.middleware";
import { Router } from "express";

class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/signout`, this.authController.signout);
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.get(`${this.path}/get-user-details`, ensureAuthenticated, this.authController.getUserDetail);
  }
}

export default AuthRoute;
