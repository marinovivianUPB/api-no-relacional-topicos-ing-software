import { VentaService } from './../../app/services/ventaService.js';
import { Request, Response, Router } from "express";
import logger from "../../infrastructure/logger/logger.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.js";
import { VentaDTO } from '../../app/dtos/venta.dto.js';
import { CreateVentaDTO } from '../../app/dtos/create.venta.dto.js';

export class VentaController {
    public router: Router;
    private ventaService: VentaService;
    constructor(ventaService: VentaService) {
      this.ventaService = ventaService;
      this.router = Router();
      this.routes();
    }
  
    public async getByEventoId(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      const venta: VentaDTO[] = await this.ventaService.getVentasByEventoId(id);

      if (!venta) {
        res.status(404).json({ message: `Ventas de Evento con id ${id} no encontrado` });
        return;
      }

      return res.status(200).json(venta);
    }
  
    public async getVentaById(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      const venta: VentaDTO | null = await this.ventaService.getVentaById(id);
  
      if (!venta) {
        res.status(404).json({ message: "Venta no encontrada" });
        return;
      }
  
      return res.status(200).json(venta);
    }
  
    public async createVenta(req: Request, res: Response): Promise<Response> {
      try {
        const eventoDTO: CreateVentaDTO = req.body;
        const evento = await this.ventaService.createVenta(eventoDTO);
        return res.status(201).json(evento);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          return res.status(400).json({ message: error.message });
        }
        return res.status(400).json({ message: error });
      }
    }
  
    public async deleteVenta(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      try {
        logger.debug(`Intentando eliminar la venta con ID: ${id}`);
        await this.ventaService.delete(id);
        logger.info(`Venta con ID: ${id} eliminada con éxito`);
        return res.status(200).json({ message: "Venta eliminada con éxito" });
      } catch (error) {
        logger.error(
          `Error al eliminar la Venta con ID: ${id}. Error: ${error}`,
        );
        return res.status(500).json({ message: error });
      }
    }
  
    public routes() {
      this.router.get("/evento/:id", verifyTokenMiddleware, this.getByEventoId.bind(this));
      this.router.get("/:id", verifyTokenMiddleware, this.getVentaById.bind(this));
      this.router.post("/", verifyTokenMiddleware, this.createVenta.bind(this));
      this.router.delete("/:id", verifyTokenMiddleware, this.deleteVenta.bind(this));
    }
  }