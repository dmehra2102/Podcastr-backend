import MediaController from "@/controllers/media.controller";
import { Routes } from "@/interfaces/routes.interface";
import ensureAuthenticated from "@/middlewares/ensureAuthenticated.middleware";
import { Router } from "express";

class MediaRoute implements Routes {
  public path = "/media";
  public router = Router();
  public mediaController = new MediaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.delete(`${this.path}/image/:imageId`, ensureAuthenticated, this.mediaController.deleteImage);
    this.router.delete(`${this.path}/video/:videoId`, ensureAuthenticated, this.mediaController.deleteVideo);
    this.router.post(`${this.path}/upload/image`, ensureAuthenticated, this.mediaController.uploadImage);
    this.router.post(`${this.path}/upload/video`, ensureAuthenticated, this.mediaController.uploadVideo);
    this.router.patch(`${this.path}/likePost/:postId`, ensureAuthenticated, this.mediaController.likePost);
    this.router.patch(`${this.path}/unLikePost/:postId`, ensureAuthenticated, this.mediaController.unlikePost);
    this.router.patch(`${this.path}/comment/:postId`, ensureAuthenticated, this.mediaController.addComment);
    this.router.patch(`${this.path}/addFavourite/:postId`, ensureAuthenticated, this.mediaController.addAsFavouritePost);
  }
}

export default MediaRoute;
