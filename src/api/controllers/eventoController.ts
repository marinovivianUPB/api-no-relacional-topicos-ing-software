import { Request, Response, Router } from "express";
import { EventoService } from "../../app/services/eventoService.js";
import { EventoDTO } from "../../app/dtos/evento.dto.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.js";
import { CreateEventoDTO } from "../../app/dtos/create.evento.dto.js";
import logger from "../../infrastructure/logger/logger.js";

export class EventoController {
  public router: Router;
  private eventoService: EventoService;
  constructor(eventoService: EventoService) {
    this.eventoService = eventoService;
    this.router = Router();
    this.routes();
  }

  public async getEventos(req: Request, res: Response): Promise<Response> {
    const eventos: EventoDTO[] = await this.eventoService.getEventos();
    return res.status(200).json(eventos);
  }

  public async getEventoById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const evento: EventoDTO | null = await this.eventoService.getEventoById(id);

    if (!evento) {
      res.status(404).json({ message: "Evento no encontrado" });
      return;
    }

    return res.status(200).json(evento);
  }

  public async createEvento(req: Request, res: Response): Promise<Response> {
    try {
      const eventoDTO: CreateEventoDTO = req.body;
      const evento = await this.eventoService.createEvento(eventoDTO);
      return res.status(201).json(evento);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: error });
    }
  }

  public async deleteEvento(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      logger.debug(`Intentando eliminar al evento con ID: ${id}`);
      await this.eventoService.delete(id);
      logger.info(`Evento con ID: ${id} eliminado con éxito`);
      return res.status(200).json({ message: "Evento eliminado con éxito" });
    } catch (error) {
      logger.error(
        `Error al eliminar al Evento con ID: ${id}. Error: ${error}`,
      );
      return res.status(500).json({ message: error });
    }
  }

  public routes() {
    this.router.get("/", verifyTokenMiddleware, this.getEventos.bind(this));
    this.router.get("/:id", verifyTokenMiddleware, this.getEventoById.bind(this));
    this.router.post("/", verifyTokenMiddleware, this.createEvento.bind(this));
    this.router.delete("/:id", verifyTokenMiddleware, this.deleteEvento.bind(this));
  }
}