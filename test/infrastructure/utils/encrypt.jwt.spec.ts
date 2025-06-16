import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { EncryptImpl } from "../../../src/infrastructure/utils/encrypt.jwt.js";
import { jwt as jwtConfig } from "../../../src/infrastructure/config/config.js";

describe("EncryptImpl", () => {
    const encryptImpl = new EncryptImpl();
    const mockPayload = { id: "123", name: "Test" };
    const fakeToken = "fake.jwt.token";

    afterEach(() => {
        sinon.restore();
    });

    describe("encrypt() with real jwt", () => {
        it("JWT containing the original payload", () => {
            const token = encryptImpl.encrypt(mockPayload);
            const decoded = jwt.decode(token) as jwt.JwtPayload;

            expect(decoded).to.include(mockPayload);
            expect(decoded).to.have.property("iat");
            expect(decoded).to.have.property("exp");
        });

        it("should set the token expiration based on jwtConfig.expirationTime", () => {
            const token = encryptImpl.encrypt(mockPayload);
            const decoded = jwt.decode(token) as jwt.JwtPayload;

            expect(decoded).to.have.property("iat");
            expect(decoded).to.have.property("exp");

            const issuedAt = decoded.iat!;
            const expiresAt = decoded.exp!;
            const durationInSeconds = expiresAt - issuedAt;

            const expectedSeconds = normalizeExpiration(jwtConfig.expirationTime ?? "3600s");

            expect(durationInSeconds).to.be.closeTo(expectedSeconds, 1);
        });
    });
});

function normalizeExpiration(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return parseInt(value);

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return amount;
    case "m": return amount * 60;
    case "h": return amount * 3600;
    case "d": return amount * 86400;
    default: return amount;
  }
}