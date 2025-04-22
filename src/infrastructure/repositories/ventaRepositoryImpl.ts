import { ObjectId } from "mongodb";
import { Venta } from "../../domain/models/venta.js";
import { AppDataSource } from "../config/dataSource.js";
import { VentaRepository } from "./../../domain/interfaces/ventaRepository.js";
import { VentaEntity } from "../entities/ventaEntity.js";
import logger from "../logger/logger.js";

export class VentaRepositoryImpl implements VentaRepository {
  async deleteVenta(id: string): Promise<void> {
    const ventaRepository = AppDataSource.getRepository(VentaEntity);
    const venta = await ventaRepository.findOneBy({id: new ObjectId(id)});
    if(!venta){
        logger.error(`VentaRepository: Error al eliminar la venta con ID: ${id}.`);
        throw new Error("No se pudo eliminar la venta");
    }
    await ventaRepository.remove(venta);
  }
  async findById(id: string): Promise<Venta> {
    const ventaRepository = AppDataSource.getRepository(VentaEntity);
    const venta = await ventaRepository.findOneBy({ id: new ObjectId(id) });
    return venta ? new Venta(venta) : null;
  }
  async createVenta(venta: Venta): Promise<Venta> {
    const ventaRepository = AppDataSource.getRepository(VentaEntity);
    const ventaEntity = ventaRepository.create({
      eventoId: venta.eventoId,
      comprador: venta.comprador,
      costoTotal: venta.costoTotal,
      descuentoAplicado: venta.descuentoAplicado,
      listaDeAsientos: venta.listaDeAsientos,
      pagoCompletado: venta.pagoCompletado,
      createdAt: venta.createdAt,
      createdBy: venta.createdBy,
    });
    const ventaResponse = await ventaRepository.save(ventaEntity);
    return new Venta(ventaResponse);
  }
  async findByEventoId(id: string): Promise<Venta[]> {
    const ventaRepository = AppDataSource.getRepository(VentaEntity);
    const ventas = await ventaRepository.find({
      where: { eventoId: id },
    });
    return ventas.map((venta) => new Venta(venta));
  }
  async updateVenta(venta: Partial<Venta>): Promise<Venta> {
    const ventaRepository = AppDataSource.getRepository(VentaEntity);
    const ventaResponse = await ventaRepository.findOneBy({
      id: new ObjectId(venta.id),
    });

    if (!ventaResponse) {
      logger.error(
        `VentaRepository: Error al modificar la venta con ID: ${venta.id}.`
      );
      throw new Error("Venta no encontrada");
    }

    ventaRepository.merge(ventaResponse, venta);
    const updatedVenta = await ventaRepository.save(ventaResponse);
    return new Venta(updatedVenta);
  }
}
