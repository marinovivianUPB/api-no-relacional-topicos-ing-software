import { expect } from "chai";
import sinon from "sinon";
import { EventoService } from "../../../src/app/services/eventoService.js";
import { Evento } from "../../../src/domain/models/evento.js";
import { EventoRepository } from "../../../src/domain/interfaces/eventoRepository.js";
import { CreateEventoDTO } from "../../../src/app/dtos/create.evento.dto.js";
import { ObjectId } from "mongodb";
import { Long } from "typeorm";

describe("EventoService", () => {
  let eventoRepositoryMock: sinon.SinonStubbedInstance<EventoRepository>;
  let eventoService: EventoService;

  beforeEach(() => {
    eventoRepositoryMock = {
      findAll: sinon.stub(),
      findById: sinon.stub(),
      createEvento: sinon.stub(),
      deleteEvento: sinon.stub()
    } as any;

    eventoService = new EventoService(eventoRepositoryMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getEventos", () => {
    it("return list of EventoDTOs", async () => {
      const mockEventos = [
        new Evento({
          _id: new ObjectId("507f1f77bcf86cd799439011"),
          nombre: "Concierto",
          costoAsiento: 100,
          descuentoDisponible: 10,
          fechaRealizacion: new Date("2025-06-01"),
          createdBy: 1 as unknown as Long,
          createdAt: new Date(),
        }),
      ];

      eventoRepositoryMock.findAll.resolves(mockEventos);

      const result = await eventoService.getEventos();

      expect(eventoRepositoryMock.findAll.calledOnce).to.be.true;
      expect(result).to.be.an("array");
      expect(result[0]).to.include({
        id: "507f1f77bcf86cd799439011",
        nombre: "Concierto",
        createdBy: 1 as unknown as Long,
      });
      expect(result[0].fechaRealizacion.getTime()).to.equal(new Date("2025-06-01").getTime());
    });
  });

  describe("getEventoById", () => {
    it("return EventoDTO if found", async () => {
      const mockEvento = new Evento({
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        nombre: "Feria",
        costoAsiento: 50,
        descuentoDisponible: 10,
        fechaRealizacion: new Date("2025-08-01"),
        createdBy: 1 as unknown as Long,
        createdAt: new Date(),
      });

      eventoRepositoryMock.findById.resolves(mockEvento);

      const result = await eventoService.getEventoById("507f1f77bcf86cd799439011");

      expect(eventoRepositoryMock.findById.calledOnceWith("507f1f77bcf86cd799439011")).to.be.true;
      expect(result).to.include({
        id: "507f1f77bcf86cd799439011",
        nombre: "Feria",
        costoAsiento: 50,
        descuentoDisponible: 10,
        createdBy: 1 as unknown as Long
      });
      expect(result?.createdAt?.getTime()).to.be.lessThanOrEqual(new Date().getTime());
      expect(result?.fechaRealizacion.getTime()).to.equal(new Date("2025-08-01").getTime());
    });

    it("throw if evento not found", async () => {
      eventoRepositoryMock.findById.resolves(null);

      try {
        await eventoService.getEventoById("invalid");
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });

  describe("createEvento", () => {
    it("create and return EventoDTO", async () => {
      const dto: CreateEventoDTO = {
        nombre: "Charla",
        costoAsiento: 30,
        descuentoDisponible: 10,
        fechaRealizacion: new Date("2025-09-15"),
        createdBy: 1 as unknown as Long,
      };

      const createdEvento = new Evento({
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        nombre: dto.nombre,
        costoAsiento: dto.costoAsiento,
        descuentoDisponible: dto.descuentoDisponible,
        fechaRealizacion: dto.fechaRealizacion,
        createdBy: dto.createdBy,
        createdAt: new Date(),
      });

      eventoRepositoryMock.createEvento.resolves(createdEvento);

      const result = await eventoService.createEvento(dto);

      expect(eventoRepositoryMock.createEvento.calledOnce).to.be.true;
      expect(result).to.include({
        id: "507f1f77bcf86cd799439011",
        costoAsiento: 30,
        descuentoDisponible: 10,
        nombre: "Charla",
        createdBy: 1 as unknown as Long,
      });
      expect(result?.createdAt?.getTime()).to.be.lessThanOrEqual(new Date().getTime());
      expect(result?.fechaRealizacion.getTime()).to.equal(new Date("2025-09-15").getTime());
    });
  });

  describe("delete", () => {
    it("call deleteEvento", async () => {
      await eventoService.delete("507f1f77bcf86cd799439011");

      expect(eventoRepositoryMock.deleteEvento.calledOnceWith("507f1f77bcf86cd799439011")).to.be.true;
    });
  });
});
