import { Request, Response, NextFunction } from "express";
import sinon from "sinon";
import { expect } from "chai";
import { verifyTokenMiddleware } from "../../../src/api/middleware/verifyToken.js";
import { EncryptImpl } from "../../../src/infrastructure/utils/encrypt.jwt.js";
import logger from "../../../src/infrastructure/logger/logger.js";

describe("verifyTokenMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonSpy;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    req = { headers: {} };
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = { status: statusStub };
    next = sinon.spy();

    sinon.stub(logger, "info");
    sinon.stub(logger, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("call next() if token is valid (real token)", () => {
    const encrypt = new EncryptImpl();
    const validToken = encrypt.encrypt({}); // Empty payload by design

    req.headers = {
        token: validToken
    };

    verifyTokenMiddleware(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnce).to.be.true;
    expect(statusStub.notCalled).to.be.true;
  });

  it("return 403 if token is invalid", () => {
    req.headers = {
        token: "invalid.token.fake"
    };

    verifyTokenMiddleware(req as Request, res as Response, next as NextFunction);

    expect(statusStub.calledOnceWith(403)).to.be.true;
    expect(jsonStub.calledOnceWith({ message: "Token no válido" })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("return 401 if token is not provided", () => {
    verifyTokenMiddleware(req as Request, res as Response, next as NextFunction);

    expect(statusStub.calledOnceWith(401)).to.be.true;
    expect(jsonStub.calledOnceWith({ message: "Token no proporcionado" })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
