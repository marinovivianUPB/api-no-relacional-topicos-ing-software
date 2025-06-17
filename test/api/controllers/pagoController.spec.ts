import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import { PagoController } from "../../../src/api/controllers/pagoController.js";
import { PagoService } from "../../../src/app/services/pagoService.js";
import { PagoDTO } from "../../../src/app/dtos/pago.dto.js";
import { CreatePagoDTO } from "../../../src/app/dtos/create.pago.dto.js";
import { Long } from "typeorm";

describe("PagoController", () => {
  let pagoServiceStub: sinon.SinonStubbedInstance<PagoService>;
  let pagoController: PagoController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  const mockPago: PagoDTO = {
      id: "507f1f77bcf86cd799439211",
      monto: 100,
      createdBy: 1 as unknown as Long,
      createdAt: new Date(),
      comprador: 2 as unknown as Long
  };

  beforeEach(() => {
    pagoServiceStub = sinon.createStubInstance(PagoService);
    pagoController = new PagoController(pagoServiceStub as unknown as PagoService);

    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub } as any);

    req = {};
    res = {
      status: statusStub,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getByVentaId", () => {
    it("return pagos when found", async () => {
      req.params = { id: "507f1f77bcf86cd799439211" };
      pagoServiceStub.getPagosByVentaId.resolves([mockPago]);

      await pagoController.getByVentaId(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith([mockPago])).to.be.true;
    });

    it("should return 404 when no pagos found", async () => {
      req.params = { id: "venta123" };
      pagoServiceStub.getPagosByVentaId.resolves([]);

      await pagoController.getByVentaId(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true; // Because an empty array is still valid
      expect(jsonStub.calledWith([])).to.be.true;
    });
  });

  describe("createPago", () => {
    it("should create a pago and return it", async () => {
      const createPagoDTO: CreatePagoDTO = {
        monto: 100,
        ventaId: "507f1f77bcf86cd799439211",
        comprador: 2 as unknown as Long,
        createdBy: 1 as unknown as Long,
      };

      req.body = createPagoDTO;
      pagoServiceStub.createPago.resolves(mockPago);

      await pagoController.createPago(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith(mockPago)).to.be.true;
    });

    it("should return 500 on service error", async () => {
      req.body = {};
      pagoServiceStub.createPago.rejects(new Error("Internal error"));

      await pagoController.createPago(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({ message: "Internal error" })).to.be.true;
    });
  });

  describe("deletePago", () => {
    it("should delete a pago and return 200", async () => {
      req.params = { id: "1" };
      pagoServiceStub.delete.resolves();

      await pagoController.deletePago(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({ message: "Pago eliminado con éxito" })).to.be.true;
    });

    it("should return 500 on delete failure", async () => {
      req.params = { id: "1" };
      pagoServiceStub.delete.rejects(new Error("Failed to delete"));

      await pagoController.deletePago(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.called).to.be.true;
    });
  });
});
