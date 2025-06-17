import { expect } from "chai";
import sinon from "sinon";
import { PagoService } from "../../../src/app/services/pagoService.js";
import { PagoRepository } from "../../../src/domain/interfaces/pagoRepository.js";
import { Pago } from "../../../src/domain/models/pago.js";
import { CreatePagoDTO } from "../../../src/app/dtos/create.pago.dto.js";
import { Long} from "typeorm";
import { ObjectId } from "mongodb";

describe("PagoService", () => {
  let pagoRepositoryMock: sinon.SinonStubbedInstance<PagoRepository>;
  let pagoService: PagoService;

  beforeEach(() => {
    pagoRepositoryMock = {
      createPago: sinon.stub(),
      findByVentaId: sinon.stub(),
      deletePago: sinon.stub()
    } as any;

    pagoService = new PagoService(pagoRepositoryMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPago", () => {
    it("create a new pago and return PagoDTO", async () => {
      const dto: CreatePagoDTO = {
        ventaId: "507f1f77bcf86cd799439011",
        comprador: 2 as unknown as Long,
        monto: 250,
        createdBy: 1 as unknown as Long
      };

      const createdPago = new Pago({
        _id: new ObjectId("507f1f77bcf86cd799439211"),
        ventaId: dto.ventaId,
        comprador: dto.comprador,
        monto: dto.monto,
        createdAt: new Date(),
        createdBy: dto.createdBy
      });

      pagoRepositoryMock.createPago.resolves(createdPago);

      const result = await pagoService.createPago(dto);

      expect(pagoRepositoryMock.createPago.calledOnce).to.be.true;
      expect(result).to.include({
        id: "507f1f77bcf86cd799439211",
        comprador: dto.comprador,
        monto: dto.monto,
        createdBy: dto.createdBy
      });
        expect(result?.createdAt?.getTime()).to.be.lessThanOrEqual(new Date().getTime());
    });
  });

  describe("getPagosByVentaId", () => {
    it("return list of PagoDTOs", async () => {
      const mockPagos = [
        new Pago({
          _id: new ObjectId("507f1f77bcf86cd799439211"),
          ventaId: "507f1f77bcf86cd799439011",
          comprador: 2 as unknown as Long,
          monto: 100,
          createdAt: new Date(),
          createdBy: 1 as unknown as Long
        }),
        new Pago({
          _id: new ObjectId("507f1f77bcf86cd799439231"),
          ventaId: "507f1f77bcf86cd799439011",
          comprador: 3 as unknown as Long,
          monto: 150,
          createdAt: new Date(),
          createdBy: 1 as unknown as Long

        }),
      ];

      pagoRepositoryMock.findByVentaId.resolves(mockPagos);

      const result = await pagoService.getPagosByVentaId("venta123");

      expect(pagoRepositoryMock.findByVentaId.calledOnceWith("venta123")).to.be.true;
      expect(result).to.be.an("array").with.lengthOf(2);
      expect(result? result[0] : null).to.include({ comprador: 2, monto: 100, createdBy: 1 });
      expect(result? result[1] : null).to.include({ comprador: 3, monto: 150, createdBy: 1 });
      expect(result? result[0].createdAt.getTime() : null).to.be.lessThanOrEqual(new Date().getTime());
      expect(result? result[1].createdAt.getTime() : null).to.be.lessThanOrEqual(new Date().getTime());

    });
  });

  describe("delete", () => {
    it("call deletePago with correct id", async () => {
      await pagoService.delete("pago123");

      expect(pagoRepositoryMock.deletePago.calledOnceWith("pago123")).to.be.true;
    });
  });
});
