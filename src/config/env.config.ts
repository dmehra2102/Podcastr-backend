import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const baseApi = `${process.env.API_BASE_HOST}${process.env.API_BASE_PATH}`;
export const {
  NODE_ENV,
  BASE_PATH,
  API_HOST,
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
  LOG_FORMAT,
  LOG_DIR,
  COOKIE_DOMAIN,
  ARE_USING_CRON,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
  BASE_API,
  INSIGHT_ITEMS_PER_CRON,
} = process.env;
