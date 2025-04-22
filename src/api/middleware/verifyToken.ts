import { Request, Response, NextFunction } from "express";
import { EncryptImpl } from "../../infrastructure/utils/encrypt.jwt.js";

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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