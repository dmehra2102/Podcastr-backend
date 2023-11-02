import UserController from "@/controllers/user.controller";
import { Routes } from "@/interfaces/routes.interface";
import { ensureAdminAuthorised } from "@/middlewares/authorization.middleware";
import ensureAuthenticated from "@/middlewares/ensureAuthenticated.middleware";
import { Router } from "express";

class UserRoute implements Routes {
  public path = "/";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}admin/allUsers`, ensureAuthenticated, ensureAdminAuthorised, this.userController.getAllUsers);
    this.router.get(`${this.path}admin/user/:userId`, ensureAuthenticated, ensureAdminAuthorised, this.userController.getUserById);
    this.router.get(`${this.path}admin/allMedia`, ensureAuthenticated, ensureAdminAuthorised, this.userController.getAllMedia);
    this.router.get(`${this.path}user/:userId/media`, ensureAuthenticated, this.userController.getMediaByUserId);
    this.router.patch(`${this.path}user/follow/:userId`, ensureAuthenticated, this.userController.followOtherUser);
  }
}

export default UserRoute;
