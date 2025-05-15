import { Request, Response, NextFunction } from "express";
import { EncryptImpl } from "../../infrastructure/utils/encrypt.jwt.js";
import logger from "../../infrastructure/logger/logger.js";

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  logger.info(`Request: ${req.headers.token}`)
  const authHeader = req.headers.token;

  if (authHeader) {

    const encrypt = new EncryptImpl();
    const valid = encrypt.decrypt(authHeader as string);
      if (!valid) {
        return res.status(403).json({ message: "Token no válido" });
      }
      next();
  } else {
    res.status(401).json({ message: "Token no proporcionado" });
  }
};