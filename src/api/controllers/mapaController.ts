import { Request, Response, Router } from "express";
import logger from "../../infrastructure/logger/logger.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.js";
import { MapaService } from "../../app/services/mapaService.js";
import { MapaDTO } from "../../app/dtos/mapa.dto.js";
import { CreateMapaDTO } from "../../app/dtos/create.mapa.dto.js";

export class MapaController {
    public router: Router;
    private mapaService: MapaService
    constructor(mapaService: MapaService) {
      this.mapaService = mapaService;
      this.router = Router();
      this.routes();
    }
  
    public async getByEventoId(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      const mapa: MapaDTO = await this.mapaService.findByEventoId(id);

      if (!mapa) {
        res.status(404).json({ message: `Mapa de Evento con id ${id} no encontrado` });
        return;
      }

      return res.status(200).json(mapa);
    }
  
    public async getOriginal(req: Request, res: Response): Promise<Response> {
        const mapa: MapaDTO = await this.mapaService.findOriginal();

        if (!mapa) {
          res.status(404).json({ message: `Mapa original no encontrado` });
          return;
        }
  
        return res.status(200).json(mapa);
    }
  
    public async saveMapa(req: Request, res: Response): Promise<Response> {
      try {
        const mapaDTO: CreateMapaDTO = req.body;
        const mapa = await this.mapaService.saveMapa(mapaDTO);
        return res.status(201).json(mapa);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          return res.status(400).json({ message: error.message });
        }
        return res.status(400).json({ message: error });
      }
    }
  
    public async deleteMapa(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      try {
        logger.debug(`Intentando eliminar al mapa con ID: ${id}`);
        await this.mapaService.deleteMapa(id);
        logger.info(`Mapa con ID: ${id} eliminado con éxito`);
        return res.status(200).json({ message: "Mapa eliminado con éxito" });
      } catch (error) {
        logger.error(
          `Error al eliminar al Mapa con ID: ${id}. Error: ${error}`,
        );
        return res.status(500).json({ message: error });
      }
    }
  
    public routes() {
      this.router.get("/", verifyTokenMiddleware, this.getOriginal.bind(this));
      this.router.get("/:id", verifyTokenMiddleware, this.getByEventoId.bind(this));
      this.router.post("/", verifyTokenMiddleware, this.saveMapa.bind(this));
      this.router.delete("/:id", verifyTokenMiddleware, this.deleteMapa.bind(this));
    }
  }