import { UserRequest } from "@/interfaces/userRequest.interface";
import { logger } from "@/utils/logger";
import { NextFunction, Response } from "express";
import cloudinary from "@/config/cloudinary.config";
import { get } from "lodash";
import MediaModel from "@/models/media.model";
import { isUserAdmin } from "@/utils/helper";
import { CommentInput } from "@/types/media.type";
import UserModel from "@/models/user.model";
import { MediaDocument } from "@/interfaces/media.interface";
import { UserDocument } from "@/interfaces/user.interface";

class MediaController {
  public uploadImage = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const file = req.files.image;

      if (isUserAdmin(req.user.role)) {
        return res.status(404).send({ error: true, message: "Admin is not allowed to upload any images." });
      }

      if (!file) return res.status(400).json({ error: true, message: "No File Selected" });

      const fileName = get(file, "tempFilePath", "");
      const result = await cloudinary.uploader.upload(fileName, {
        quality: 60,
        public_id: `${Date.now()}`,
        resource_type: "image",
      });

      const newMedia = new MediaModel({
        public_id: result.public_id,
        signature: result.signature,
        resource_type: result.resource_type,
        resource_url: result.secure_url,
        format: result.format,
        user: userId,
      });

      if (result.height) newMedia.height = String(result.height);
      if (result.width) newMedia.width = String(result.width);
      await newMedia.save();

      logger.info("mediaController.uploadImage successfully executed. Image has been successfully uploaded.");
      return res.status(200).send({ error: false, data: newMedia });
    } catch (error: any) {
      logger.error(`Error in mediaController.uploadImage: ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public deleteImage = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;

      const image = await MediaModel.findById(imageId);
      const deletedImage = await cloudinary.uploader.destroy(image.public_id, { resource_type: "image" });
      await MediaModel.findByIdAndDelete(imageId);
      logger.info("mediaController.deleteImage successfully executed. Image has been successfully deleted");
      return res.status(200).send({ error: false, message: "Image deleted successfully", data: deletedImage });
    } catch (error: any) {
      logger.error(`Error in mediaController.deleteImage : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public uploadVideo = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const file = req.files.video;

      if (isUserAdmin(req.user.role)) {
        return res.status(404).send({ error: true, message: "Admin is not allowed to upload any video." });
      }
      if (!file) return res.status(400).json({ error: true, message: "No File Selected" });

      const fileName = get(file, "tempFilePath", "");
      const result = await cloudinary.uploader.upload(fileName, {
        quality: 60,
        public_id: `${Date.now()}`,
        resource_type: "video",
      });

      const newMedia = new MediaModel({
        public_id: result.public_id,
        signature: result.signature,
        resource_type: result.resource_type,
        resource_url: result.secure_url,
        format: result.format,
        user: userId,
      });

      if (result.height) newMedia.height = String(result.height);
      if (result.width) newMedia.width = String(result.width);
      await newMedia.save();

      logger.info("mediaController.uploadVideo successfully executed. Video has been successfully uploaded.");
      return res.status(200).send({ error: false, data: newMedia });
    } catch (error: any) {
      logger.error(`Error in mediaController.uploadVideo: ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public deleteVideo = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.params;

      const video = await MediaModel.findById(videoId);
      const deletedVideo = await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });
      await MediaModel.findByIdAndDelete(videoId);
      logger.info("mediaController.deleteVideo successfully executed. Video has been successfully deleted");
      return res.status(200).send({ error: false, message: "Video deleted successfully", data: deletedVideo });
    } catch (error: any) {
      logger.error(`Error in mediaController.deleteVideo : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public likePost = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
      const userPost = await MediaModel.findById(postId);
      // Check if the user has already unliked the post
      const isUserAlreadyLiked = userPost.likes.some((likedUserId) => likedUserId.equals(userId));
      let post: MediaDocument;

      if (isUserAlreadyLiked) {
        post = await MediaModel.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });
      } else {
        post = await MediaModel.findOneAndUpdate(
          { _id: postId },
          { $addToSet: { likes: userId }, $pull: { unlikes: userId } },
          { new: true }
        );
      }

      if (!post) {
        return res.status(404).send({ error: true, message: "Post not found" });
      }

      logger.info(`mediaController.likePost is successfully exectuted. Post with id : ${postId} successfully liked.`);
      return res.status(200).send({ error: false, post, likes: post.likes.length });
    } catch (error: any) {
      logger.error(`Error in mediaController.likePost : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public unlikePost = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
      const userPost = await MediaModel.findById(postId);

      // Check if the user has already unliked the post
      const isUserAlreadyUnliked = userPost.unlikes.some((unlikeUserId) => unlikeUserId.equals(userId));
      let post: MediaDocument;

      if (isUserAlreadyUnliked) {
        post = await MediaModel.findOneAndUpdate({ _id: postId }, { $pull: { unlikes: userId } }, { new: true });
      } else {
        post = await MediaModel.findOneAndUpdate(
          { _id: postId },
          { $addToSet: { unlikes: userId }, $pull: { likes: userId } },
          { new: true }
        );
      }
      if (!post) {
        return res.status(404).send({ error: true, message: "Post not found" });
      }

      logger.info(`mediaController.unlikePost is successfully exectuted. Post with id : ${postId} successfully unliked.`);
      return res.status(200).send({ error: false, post, unlikes: post.unlikes.length });
    } catch (error: any) {
      logger.error(`Error in mediaController.unlikePost : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public addComment = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { message }: CommentInput = req.body;
      const userId = req.user._id;
      const post = await MediaModel.findByIdAndUpdate(postId, { $push: { comments: { message, author: userId } } }, { new: true });
      if (!post) {
        return res.status(404).send({ error: true, message: "Post not found" });
      }

      logger.info(`mediaController.addComment is successfully exectuted. Successfully commented on Post with id : ${postId}.`);
      return res.status(200).send({ error: false, post });
    } catch (error: any) {
      logger.error(`Error in mediaController.addComment : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public addAsFavouritePost = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
      const userDetails = await UserModel.findById(userId);

      // Check if the user has already marked post as favorites
      const postAlreadyMarkedAsFavourite = userDetails.favourites.some((favouritePostId) => favouritePostId.equals(postId as any));
      let user: UserDocument;

      if (postAlreadyMarkedAsFavourite) {
        user = await UserModel.findOneAndUpdate({ _id: userId }, { $pull: { favourites: postId } }, { new: true });
      } else {
        user = await UserModel.findOneAndUpdate({ _id: userId }, { $addToSet: { favourites: postId } }, { new: true });
      }

      if (!user) {
        return res.status(404).send({ error: true, message: "Post not found" });
      }

      logger.info(
        `mediaController.addAsFavouritePost is successfully exectuted. Post with id : ${postId} successfully added as a favourite post.`
      );
      return res.status(200).send({ error: false, user });
    } catch (error: any) {
      logger.error(`Error in mediaController.addAsFavouritePost : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };
}

export default MediaController;
