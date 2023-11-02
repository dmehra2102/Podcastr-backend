import { Document } from "mongoose";
import { UserDocument } from "./user.interface";

export interface Comments {
  author: UserDocument;
  message: string;
}

export interface CommentDocument extends Document, Comments {}
