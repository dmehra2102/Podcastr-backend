import { MediaType } from "@/enums/media.enum";
import { CommentDocument } from "@/interfaces/comments.interface";
import { MediaDocument } from "@/interfaces/media.interface";
import { CommentModelInterface, MediaModelInterface } from "@/types/media.type";
import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema<CommentDocument, CommentModelInterface>(
  {
    author: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const mediaSchema = new Schema<MediaDocument, MediaModelInterface>(
  {
    public_id: { type: String, required: true, unique: true },
    signature: { type: String, required: true, unique: true },
    resource_type: { type: String, required: true, enum: Object.values(MediaType), default: MediaType.IMAGE },
    resource_url: { type: String, required: true },
    format: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    height: { type: String },
    width: { type: String },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    unlikes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    comments: { type: [commentSchema], required: true, default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MediaModel = model("Media", mediaSchema);

export default MediaModel;
