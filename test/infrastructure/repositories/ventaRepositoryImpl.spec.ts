import { expect } from "chai";
import sinon from "sinon";
import { VentaRepositoryImpl } from "../../../src/infrastructure/repositories/ventaRepositoryImpl.js";
import { AppDataSource } from "../../../src/infrastructure/config/dataSource.js";
import { VentaEntity } from "../../../src/infrastructure/entities/ventaEntity.js";
import { Venta } from "../../../src/domain/models/venta.js";
import logger from "../../../src/infrastructure/logger/logger.js";
import { ObjectId } from "mongodb";
import { Long } from "typeorm";

describe("VentaRepositoryImpl", () => {
  let repo: VentaRepositoryImpl;
  let fakeRepository: any;

  beforeEach(() => {
    repo = new VentaRepositoryImpl();
    fakeRepository = {
      create: sinon.stub(),
      save: sinon.stub(),
      findOne: sinon.stub(),
      findOneBy: sinon.stub(),
      find: sinon.stub(),
      remove: sinon.stub(),
      merge: sinon.stub(),
    };
    sinon.stub(AppDataSource, "getRepository").returns(fakeRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createVenta", () => {
    it("create and save a Venta", async () => {

        const asientos = [[1, 2], [3, 4]];
        const asientosList = asientos as unknown as Array<Array<number>>;
      const input : VentaEntity = {
        eventoId: "507f1f77bcf86cd799439011",
        comprador: 2 as unknown as Long,
        costoTotal: 100,
        descuentoAplicado: 10,
        listaDeAsientos: asientosList,
        pagoCompletado: false,
        createdAt: new Date(),
        createdBy: 1 as unknown as Long,
      };

      const saved = { ...input, _id: "507f1f77bcf86cd799439215" };
      fakeRepository.create.returns(saved);
      fakeRepository.save.resolves(saved);

      const ventaEntity = saved as unknown as VentaEntity;

      const result = await repo.createVenta(new Venta(ventaEntity));

      expect(fakeRepository.create.calledOnceWith(input)).to.be.true;
      expect(result).to.be.instanceOf(Venta);
      expect(result.eventoId).to.equal("507f1f77bcf86cd799439011");
      expect(result.comprador).to.equal(2);
      expect(result.costoTotal).to.equal(100);
      expect(result.descuentoAplicado).to.equal(10);
      expect(result.listaDeAsientos).to.deep.equal(asientos);
      expect(result.pagoCompletado).to.equal(false);
      expect(result.createdAt.getTime()).to.be.lessThanOrEqual(input.createdAt.getTime());
      expect(result.createdBy).to.equal(1);
    });
  });

  describe("findById", () => {
    it("return a Venta for valid id", async () => {
      const id = "507f1f77bcf86cd799439011";
      const found = { _id: id, comprador: "Ana" };

      fakeRepository.findOne.resolves(found);

      const result = await repo.findById(id);

      expect(fakeRepository.findOne.calledOnceWith({
        where: { _id: new ObjectId(id) }
      })).to.be.true;
      expect(result).to.be.instanceOf(Venta);
      expect(result.comprador).to.equal("Ana");
      expect(result.id).to.equal(id);
    });

    it("return null if not found", async () => {
      fakeRepository.findOne.resolves(null);

      const result = await repo.findById("507f1f77bcf86cd799439011");

      expect(result).to.be.null;
    });
  });

  describe("findByEventoId", () => {
    it("should return list of ventas for eventoId", async () => {
      const eventoId = "507f1f77bcf86cd799439011";
      const ventas = [
        { eventoId:eventoId, comprador: "Juan" },
        { eventoId: eventoId, comprador: "Maria" }
      ];
      fakeRepository.find.resolves(ventas);

      const result = await repo.findByEventoId(eventoId);

      expect(fakeRepository.find.calledOnceWith({ where: { eventoId } })).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.be.instanceOf(Venta);
      expect(result[0].comprador).to.equal("Juan");
      expect(result[1]).to.be.instanceOf(Venta);
      expect(result[1].comprador).to.equal("Maria");
    });
  });

  describe("deleteVenta", () => {
    it("remove a venta", async () => {
      const id = "507f1f77bcf86cd799439011";
      const venta = { _id: id };

      fakeRepository.findOneBy.resolves(venta);
      fakeRepository.remove.resolves();

      await repo.deleteVenta(id);

      expect(fakeRepository.findOneBy.calledOnceWith({ _id: new ObjectId(id) })).to.be.true;
      expect(fakeRepository.remove.calledOnceWith(venta)).to.be.true;
    });

    it("throw and log error if venta not found", async () => {
      const id = "507f1f77bcf86cd799439011";
      fakeRepository.findOneBy.resolves(null);
      const loggerStub = sinon.stub(logger, "error");

      try {
        await repo.deleteVenta(id);
      } catch (err) {
        expect(err.message).to.equal("No se pudo eliminar la venta");
        expect(loggerStub.calledOnce).to.be.true;
      }

      loggerStub.restore();
    });
  });

  describe("updateVenta", () => {
    it("update and return updated venta", async () => {
      const id = "507f1f77bcf86cd799439011";
      const existingVenta = { _id: id};
      const updateData = { id};

      fakeRepository.findOneBy.resolves(existingVenta);
      fakeRepository.merge.callsFake((obj, updates) => Object.assign(obj, updates));
      fakeRepository.save.resolves({ ...existingVenta, pagoCompletado: true });

      const result = await repo.updateVenta(updateData);

      expect(fakeRepository.findOneBy.calledOnceWith({ _id: new ObjectId(id) })).to.be.true;
      expect(result).to.be.instanceOf(Venta);
      expect(result.pagoCompletado).to.equal(true);
    });

    it("throw and log error if venta not found", async () => {
      const updateData = { id: "507f1f77bcf86cd799439011"};
      fakeRepository.findOneBy.resolves(null);
      const loggerStub = sinon.stub(logger, "error");

      try {
        await repo.updateVenta(updateData);
      } catch (err) {
        expect(err.message).to.equal("Venta no encontrada");
        expect(loggerStub.calledOnce).to.be.true;
      }

      loggerStub.restore();
    });
  });
});
