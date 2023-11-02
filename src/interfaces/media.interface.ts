import { MediaType } from "@/enums/media.enum";
import { Document } from "mongoose";
import { UserDocument } from "./user.interface";
import { CommentDocument } from "./comments.interface";

export interface Media {
  public_id: string;
  signature: string;
  resource_type: MediaType;
  resource_url: string;
  format: string;
  author: UserDocument;
  height?: string;
  width?: string;
  likes: UserDocument[];
  unlikes: UserDocument[];
  comments: CommentDocument[];
}

export interface MediaDocument extends Document, Media {}
