import { Router } from "express";
import { EventoService } from "../../app/services/eventoService.js";
import { MapaService } from "../../app/services/mapaService.js";
import { PagoService } from "../../app/services/pagoService.js";
import { VentaService } from "../../app/services/ventaService.js";
import { EventoRepositoryImpl } from "../../infrastructure/repositories/eventoRepositoryImpl.js";
import { MapaRepositoryImpl } from "../../infrastructure/repositories/mapaRepositoryImpl.js";
import { PagoRepositoryImpl } from "../../infrastructure/repositories/pagoRepositoryImpl.js";
import { VentaRepositoryImpl } from "../../infrastructure/repositories/ventaRepositoryImpl.js";
import { EventoController } from "./eventoController.js";
import { MapaController } from "./mapaController.js";
import { PagoController } from "./pagoController.js";
import { VentaController } from "./ventaController.js";

const eventoRepository = new EventoRepositoryImpl();
const mapaRepository = new MapaRepositoryImpl();
const VentaRepository = new VentaRepositoryImpl();
const pagoRepository = new PagoRepositoryImpl();

const eventoService = new EventoService(eventoRepository);
const mapaService = new MapaService(mapaRepository);
const ventaService = new VentaService(VentaRepository);
const pagoService = new PagoService(pagoRepository);

const eventosController = new EventoController(eventoService);
const ventasController = new VentaController(ventaService);
const pagosController = new PagoController(pagoService);
const mapasController = new MapaController(mapaService);

export function apiRoutes(): Router {
    const router = Router();
  
    router.use("/eventos", eventosController.router);
    router.use("/ventas", ventasController.router);
    router.use("/pagos", pagosController.router);
    router.use("/mapas", mapasController.router);

  
    return router;
}