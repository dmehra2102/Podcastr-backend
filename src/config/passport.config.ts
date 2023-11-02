import UserModel from "@/models/user.model";
import { PassportStatic } from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { UserDocument } from "@/interfaces/user.interface";

export default function (passport: PassportStatic) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return done("Email or password is incorrect", false);
      }

      //match password
      if (bcrypt.compareSync(password, user.password) === false) {
        return done("Email or password is incorrect", false);
      }

      return done(null, user);
    })
  );

  passport.serializeUser(function (user: UserDocument, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(async function (id: string, done) {
    try {
      const user = await UserModel.findOne({ _id: id });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  });
}
