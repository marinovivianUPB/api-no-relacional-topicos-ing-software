import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.ENV_PORT || 8082,
  environment: process.env.ENV || "develop",
};

export const db = {
  port: process.env.DB_PORT || 27017,
  type: process.env.DB_TYPE || "mongodb",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "vfercms1221",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "cocoeventsnorelacional",
};

export const lg = {
  level: process.env.LOGGER_LEVEL || "info",
};

export const jwt = {
  secretKey: process.env.JWT_SECRET || "your_secret_key",
  expirationTime: process.env.JWT_EXPIRATION_TIME,
};

export const swagger_env = {
  title: process.env.SW_TITLE || "cocoeventsnorelacional",
  version: process.env.SW_VERSION || "1.0.0",
};