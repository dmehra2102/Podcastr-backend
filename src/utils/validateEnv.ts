import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGODB_URI: str(),
    SESSION_SECRET: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_SECRET_KEY: str(),
    CLOUDINARY_CLOUD_NAME: str(),
  });
};

export default validateEnv;
