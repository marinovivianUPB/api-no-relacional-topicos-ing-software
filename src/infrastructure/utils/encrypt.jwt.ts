import  jwt  from "jsonwebtoken";
import { Encrypt } from "../../app/utils/encrypt.js";
import { jwt as jwtConfig } from "../config/config.js";

export class EncryptImpl implements Encrypt {
  encrypt(data: object): string {
    const token = jwt.sign(data, jwtConfig.secretKey as string, {
      algorithm: "HS384",
      expiresIn: jwtConfig.expirationTime,
    });
    return token;
  }

  decrypt(token: string): boolean {
    try {
      jwt.verify(token, jwtConfig.secretKey as string, {
        algorithms: ["HS384"],
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
