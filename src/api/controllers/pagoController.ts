import { Request, Response, Router } from "express";
import logger from "../../infrastructure/logger/logger.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.js";
import { PagoDTO } from "../../app/dtos/pago.dto.js";
import { PagoService } from "../../app/services/pagoService.js";
import { CreatePagoDTO } from "../../app/dtos/create.pago.dto.js";

export class PagoController {
    public router: Router;
    private pagoService: PagoService;
    constructor(pagoService: PagoService) {
      this.pagoService = pagoService;
      this.router = Router();
      this.routes();
    }
  
    public async getByVentaId(req: Request, res: Response): Promise<void> {
      const { id } = req.params;
      const pago: PagoDTO[] = await this.pagoService.getPagosByVentaId(id);

      if (!pago) {
        res.status(404).json({ message: `Pagos de Venta con id ${id} no encontrado` });
        return;
      }

      res.status(200).json(pago);
    }
  
    public async createPago(req: Request, res: Response): Promise<void> {
      try {
        const pagoDTO: CreatePagoDTO = req.body;
        const pago = await this.pagoService.createPago(pagoDTO);
        res.status(201).json(pago);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: error });
      }
    }
  
    public async deletePago(req: Request, res: Response): Promise<void> {
      const { id } = req.params;
      try {
        logger.debug(`Intentando eliminar el pago con ID: ${id}`);
        await this.pagoService.delete(id);
        logger.info(`Pago con ID: ${id} eliminado con éxito`);
        res.status(200).json({ message: "Pago eliminado con éxito" });
      } catch (error) {
        logger.error(
          `Error al eliminar al Pago con ID: ${id}. Error: ${error}`,
        );
        res.status(500).json({ message: error });
      }
    }
  
    public routes() {
      this.router.get("/:id", verifyTokenMiddleware, this.getByVentaId.bind(this));
      this.router.post("/", verifyTokenMiddleware, this.createPago.bind(this));
      this.router.delete("/:id", verifyTokenMiddleware, this.deletePago.bind(this));
    }
  }