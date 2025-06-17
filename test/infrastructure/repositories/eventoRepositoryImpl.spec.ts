import { expect } from "chai";
import sinon from "sinon";
import { EventoRepositoryImpl } from "../../../src/infrastructure/repositories/eventoRepositoryImpl.js";
import { AppDataSource } from "../../../src/infrastructure/config/dataSource.js";
import { EventoEntity } from "../../../src/infrastructure/entities/eventoEntity.js";
import { Evento } from "../../../src/domain/models/evento.js";
import logger from "../../../src/infrastructure/logger/logger.js";
import { ObjectId } from "mongodb";
import { Long } from "typeorm";


describe("EventoRepositoryImpl", () => {
  let repo: EventoRepositoryImpl;
  let fakeRepository: any;

  beforeEach(() => {
    repo = new EventoRepositoryImpl();
    fakeRepository = {
      create: sinon.stub(),
      save: sinon.stub(),
      findOneBy: sinon.stub(),
      find: sinon.stub(),
      remove: sinon.stub(),
    };
    sinon.stub(AppDataSource, "getRepository").returns(fakeRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createEvento", () => {
    it("create and save a new Evento", async () => {
      const input = new Evento({
        nombre: "Concierto",
        costoAsiento: 50,
        descuentoDisponible: 10,
        fechaRealizacion: new Date(2025, 11, 31),
        createdAt: new Date(),
        createdBy: 1 as unknown as Long,
      });

      const saved = { ...input, _id: "507f1f77bcf86cd799439011" };
      fakeRepository.create.returns(saved);
      fakeRepository.save.resolves(saved);

      const result = await repo.createEvento(input);

      expect(fakeRepository.create.calledOnce).to.be.true;
      expect(fakeRepository.save.calledOnceWith(saved)).to.be.true;
      expect(result).to.be.instanceOf(Evento);
      expect(result.nombre).to.equal("Concierto");
      expect(result.costoAsiento).to.equal(50);
      expect(result.descuentoDisponible).to.equal(10);
      expect(result.fechaRealizacion.getTime()).to.equal(new Date(2025, 11, 31).getTime());
      expect(result.createdAt.getTime()).to.be.lessThanOrEqual(input.createdAt.getTime());
      expect(result.createdBy).to.equal(1);
    });
  });

  describe("findById", () => {
    it("return Evento if it exists", async () => {
      const id = "507f1f77bcf86cd799439011";
      const mockEvento = { _id: new ObjectId(id), nombre: "Feria", costoAsiento: 30 };
      fakeRepository.findOneBy.resolves(mockEvento);

      const result = await repo.findById(id);

      expect(fakeRepository.findOneBy.calledOnceWith({ _id: new ObjectId(id) })).to.be.true;
      expect(result).to.be.instanceOf(Evento);
      expect(result?.nombre).to.equal("Feria");
      expect(result?.costoAsiento).to.equal(30);
    });

    it("return null if it doesn't exist", async () => {
      fakeRepository.findOneBy.resolves(null);
      const result = await repo.findById("507f1f77bcf86cd799439011");
      expect(result).to.be.null;
    });
  });

  describe("findAll", () => {
    it("return list of Eventos", async () => {
      const events = [{ nombre: "1" }, { nombre: "2" }];
      fakeRepository.find.resolves(events);

      const result = await repo.findAll();

      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.be.instanceOf(Evento);
      expect(result[1]).to.be.instanceOf(Evento);
      expect(result[0].nombre).to.equal("1");
      expect(result[1].nombre).to.equal("2");
    });
  });

  describe("deleteEvento", () => {
    it("delete an existing Evento", async () => {
      const id = "507f1f77bcf86cd799439011";
      const mockEvento = { _id: new ObjectId(id), nombre: "Feria" };
      fakeRepository.findOneBy.resolves(mockEvento);
      fakeRepository.remove.resolves();

      await repo.deleteEvento(id);

      expect(fakeRepository.findOneBy.calledOnceWith({ _id: new ObjectId(id) })).to.be.true;
      expect(fakeRepository.remove.calledOnceWith(mockEvento)).to.be.true;
    });

    it("should throw error and log if Evento not found", async () => {
      const id = "507f1f77bcf86cd799439011";
      fakeRepository.findOneBy.resolves(null);
      const loggerStub = sinon.stub(logger, "error");

      try {
        await repo.deleteEvento(id);
      } catch (error) {
        expect(error.message).to.equal("No se pudo eliminar el evento");
        expect(loggerStub.calledOnce).to.be.true;
      }

      loggerStub.restore();
    });
  });
});