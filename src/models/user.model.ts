import { UserDocument } from "@/interfaces/user.interface";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { UserModelInterface } from "@/types/user.type";
import { UserRole } from "@/enums/user.enum";

const userSchema = new Schema<UserDocument, UserModelInterface>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, unique: true, required: true },
    dateOfBirth: { type: Date },
    role: { type: String, required: true, enum: Object.values(UserRole), default: UserRole.USER },
    favourites: { type: [{ type: Schema.Types.ObjectId, ref: "Media" }], default: [] },
    followers: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    following: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(8));
  }

  next();
});

const UserModel = model("User", userSchema);

export default UserModel;
