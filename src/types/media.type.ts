import { CommentDocument } from "@/interfaces/comments.interface";
import { MediaDocument } from "@/interfaces/media.interface";
import { Model } from "mongoose";

export type CommentInput = {
  message: string;
};

export type MediaModelInterface = Model<MediaDocument>;
export type CommentModelInterface = Model<CommentDocument>;
