import { MONGODB_URI } from "@/config/env.config";

export const dbConnection = {
  uri: MONGODB_URI,
  options: {
    autoIndex: true,
    autoCreate: true,
  },
};
