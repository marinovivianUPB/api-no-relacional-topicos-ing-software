import { expect } from "chai";
import sinon from "sinon";
import { PagoRepositoryImpl } from "../../../src/infrastructure/repositories/pagoRepositoryImpl.js";
import { AppDataSource } from "../../../src/infrastructure/config/dataSource.js";
import { PagoEntity } from "../../../src/infrastructure/entities/pagoEntity.js";
import { Pago } from "../../../src/domain/models/pago.js";
import logger from "../../../src/infrastructure/logger/logger.js";
import { ObjectId } from "mongodb";
import { Long } from "typeorm";

describe("PagoRepositoryImpl", () => {
  let repo: PagoRepositoryImpl;
  let fakeRepository: any;

  beforeEach(() => {
    repo = new PagoRepositoryImpl();
    fakeRepository = {
      create: sinon.stub(),
      save: sinon.stub(),
      find: sinon.stub(),
      findOneBy: sinon.stub(),
      remove: sinon.stub(),
    };
    sinon.stub(AppDataSource, "getRepository").returns(fakeRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPago", () => {
    it("create and save a new Pago", async () => {
      const input = {
        ventaId: "507f1f77bcf86cd799439011",
        comprador: "Juan",
        monto: 100,
        createdAt: new Date(),
        createdBy: 1 as unknown as Long,
      };

      const saved = { ...input, _id: "someid" };
      fakeRepository.create.returns(saved);
      fakeRepository.save.resolves(saved);

      const result = await repo.createPago(input);

      expect(fakeRepository.create.calledOnceWith(input)).to.be.true;
      expect(fakeRepository.save.calledOnceWith(saved)).to.be.true;
      expect(result).to.be.instanceOf(Pago);
      expect(result.comprador).to.equal("Juan");
      expect(result.monto).to.equal(100);
      expect(result.createdAt.getTime()).to.be.lessThanOrEqual(input.createdAt.getTime());
      expect(result.createdBy).to.equal(1);
      expect(result.ventaId).to.equal("507f1f77bcf86cd799439011");
    });
  });

  describe("findByVentaId", () => {
    it("should return an array of Pagos for given ventaId", async () => {
      const ventaId = "507f1f77bcf86cd799439011";
      const pagosData = [
        { ventaId:ventaId, comprador: "Luis", monto: 50 },
        { ventaId:ventaId, comprador: "Ana", monto: 75 },
      ];

      fakeRepository.find.resolves(pagosData);

      const result = await repo.findByVentaId(ventaId);

      expect(fakeRepository.find.calledOnceWith({ where: { ventaId } })).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result? result[0] : null).to.be.instanceOf(Pago);
      expect(result? result[1] : null).to.be.instanceOf(Pago);
      expect(result? result[0].ventaId : null).to.equal(ventaId);
      expect(result? result[1].ventaId : null).to.equal(ventaId);
      expect(result? result[0].monto : null).to.equal(50);
      expect(result? result[1].monto : null).to.equal(75);
      expect(result? result[0].comprador : null).to.equal("Luis");
      expect(result? result[1].comprador : null).to.equal("Ana");
    });
  });

  describe("deletePago", () => {
    it("remove an existing Pago", async () => {
      const id = "507f1f77bcf86cd799439011";
      const mockPago = { _id: new ObjectId(id), monto: 100 };

      fakeRepository.findOneBy.resolves(mockPago);
      fakeRepository.remove.resolves();

      await repo.deletePago(id);

      expect(fakeRepository.findOneBy.calledOnceWith({ _id: new ObjectId(id) })).to.be.true;
      expect(fakeRepository.remove.calledOnceWith(mockPago)).to.be.true;
    });

    it("throw and log an error if Pago not found", async () => {
      const id = "507f1f77bcf86cd799439011";
      fakeRepository.findOneBy.resolves(null);
      const loggerStub = sinon.stub(logger, "error");

      try {
        await repo.deletePago(id);
      } catch (err) {
        expect(err.message).to.equal("No se pudo eliminar la venta");
        expect(loggerStub.calledOnce).to.be.true;
      }

      loggerStub.restore();
    });
  });
});
