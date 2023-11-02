import { UserRole } from "@/enums/user.enum";
import { Document } from "mongoose";
import { MediaDocument } from "./media.interface";

export interface User {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  phoneNumber: number;
  role: UserRole;
  favourites: MediaDocument[];
  followers: UserDocument[];
  following: UserDocument[];
}

export interface UserDocument extends Document, User {}
