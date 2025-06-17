import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import { EventoController } from "../../../src/api/controllers/eventoController.js";
import { EventoService } from "../../../src/app/services/eventoService.js";
import { EventoDTO } from "../../../src/app/dtos/evento.dto.js";
import { CreateEventoDTO } from "../../../src/app/dtos/create.evento.dto.js";
import { Long } from "typeorm";

describe("EventoController", () => {
  let eventoServiceStub: sinon.SinonStubbedInstance<EventoService>;
  let eventoController: EventoController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  const mockEvento: EventoDTO = {
    id: "1",
    nombre: "Evento Test",
    costoAsiento: 100,
    descuentoDisponible: 0,
    fechaRealizacion: new Date(),
    createdBy: 1 as unknown as Long,
    createdAt: new Date(),
  };

  beforeEach(() => {
    eventoServiceStub = sinon.createStubInstance(EventoService);
    eventoController = new EventoController(eventoServiceStub as unknown as EventoService);

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

  describe("getEventos", () => {
    it("return a list of eventos", async () => {
      eventoServiceStub.getEventos.resolves([mockEvento]);

      await eventoController.getEventos(req as Request, res as Response);

      expect(statusStub.calledOnceWith(200)).to.be.true;
      expect(jsonStub.calledOnceWith([mockEvento])).to.be.true;
    });
  });

  describe("getEventoById", () => {
    it("return evento when found", async () => {
      req.params = { id: "1" };
      eventoServiceStub.getEventoById.resolves(mockEvento);

      await eventoController.getEventoById(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith(mockEvento)).to.be.true;
    });

    it("return 404 when evento not found", async () => {
      req.params = { id: "1" };
      eventoServiceStub.getEventoById.resolves(null);

      await eventoController.getEventoById(req as Request, res as Response);

      expect(statusStub.calledWith(404)).to.be.true;
      expect(jsonStub.calledWith({ message: "Evento no encontrado" })).to.be.true;
    });
  });

  describe("createEvento", () => {
    it("create an evento and return the evento", async () => {
      const createEventoDTO: CreateEventoDTO = {
        nombre: "Nuevo Evento",
        costoAsiento: 100,
        descuentoDisponible: 10,
        fechaRealizacion: new Date(),
        createdBy: 1 as unknown as Long,
      };

      req.body = createEventoDTO;
      eventoServiceStub.createEvento.resolves(mockEvento);

      await eventoController.createEvento(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith(mockEvento)).to.be.true;
    });

    it("return 500 on error", async () => {
      req.body = {};
      eventoServiceStub.createEvento.rejects(new Error("DB error"));

      await eventoController.createEvento(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({ message: "DB error" })).to.be.true;
    });
  });

  describe("deleteEvento", () => {
    it("delete an evento and return 200", async () => {
      req.params = { id: "1" };
      eventoServiceStub.delete.resolves();

      await eventoController.deleteEvento(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({ message: "Evento eliminado con éxito" })).to.be.true;
    });

    it("return 500 on delete failure", async () => {
      req.params = { id: "1" };
      eventoServiceStub.delete.rejects(new Error("delete failed"));

      await eventoController.deleteEvento(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.called).to.be.true;
    });
  });
});
