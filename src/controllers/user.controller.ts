import { UserRequest } from "@/interfaces/userRequest.interface";
import MediaModel from "@/models/media.model";
import UserModel from "@/models/user.model";
import { logger } from "@/utils/logger";
import { NextFunction, Response } from "express";

class UserController {
  public getAllUsers = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find().select("-password -updatedAt");
      logger.info("userController.getAllUsers executed successfully");
      return res.status(200).send({ error: false, data: users });
    } catch (error: any) {
      logger.error(`Error in userController.getAllUsers : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getUserById = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId).select("-password");
      logger.info(`userController.getUserById executed successfully for user with _id : ${userId}`);
      return res.status(200).send({ error: false, data: user });
    } catch (error: any) {
      logger.error(`Error in userController.getUserById : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getAllMedia = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const allMedia = await MediaModel.find();
      logger.info("userController.getAllMedia executed successfully");
      return res.status(200).send({ error: false, data: allMedia });
    } catch (error: any) {
      logger.error(`Error in userController.getAllMedia : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getMediaByUserId = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const allUserMedia = await MediaModel.find({ user: userId }).select("-user").sort({ createAt: "desc" });
      logger.info(`userController.getMediaByUserId executed successfully for user with _id : ${userId}`);
      return res.status(200).send({ error: false, data: allUserMedia });
    } catch (error: any) {
      logger.error(`Error in userController.getMediaByUserId : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public followOtherUser = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const id = req.user._id;
      if (userId === String(id)) return res.status(400).send({ error: true, message: "You can't follow yourself." });

      const userDetails = await UserModel.findById(id);

      // Check wheather user is already following this user
      const isUserAlreadyFollowing = userDetails.following.some((followingUserId) => followingUserId.equals(userId as any));

      if (isUserAlreadyFollowing) await UserModel.findByIdAndUpdate(id, { $pull: { following: userId } }, { new: true });
      else await UserModel.findByIdAndUpdate(id, { $addToSet: { following: userId } }, { new: true });

      logger.info(`userController.getMediaByUserId executed successfully for user with _id : ${userId}`);
      return res.status(200).send({ error: false, message: "Successfully Follwing." });
    } catch (error: any) {
      logger.error(`Error in userController.getMediaByUserId : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };
}

export default UserController;
