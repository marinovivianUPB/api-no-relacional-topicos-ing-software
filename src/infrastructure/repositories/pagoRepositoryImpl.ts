import { PagoRepository } from './../../domain/interfaces/pagoRepository.js';
import { Pago } from "../../domain/models/pago.js";
import { AppDataSource } from '../config/dataSource.js';
import { PagoEntity } from '../entities/pagoEntity.js';
import { ObjectId } from 'mongodb';
import logger from '../logger/logger.js';

export class PagoRepositoryImpl implements PagoRepository {
    async createPago(pago: any): Promise<Pago> {
        const pagoRepository = AppDataSource.getRepository(PagoEntity);
        const pagoEntity = pagoRepository.create({
            ventaId: pago.ventaId,
            comprador: pago.comprador,
            monto: pago.monto,
            createdAt: pago.createdAt,
            createdBy: pago.createdBy
        })
        const pagoResponse = await pagoRepository.save(pagoEntity);
        return new Pago(pagoResponse)
    }
    async findByVentaId(id: string): Promise<Pago[] | null> {
        const pagoRepository = AppDataSource.getRepository(PagoEntity);
        const pagos = await pagoRepository.find({ where: { ventaId: id } });
        return pagos.map((pago) => new Pago(pago));
    }
    async deletePago(id: string): Promise<void> {
        const pagoRepository = AppDataSource.getRepository(PagoEntity);
        const pago = await pagoRepository.findOneBy({id: new ObjectId(id)});
        if(!pago){
            logger.error(`VentaRepository: Error al eliminar el pago con ID: ${id}.`);
            throw new Error("No se pudo eliminar la venta");
        }
        await pagoRepository.remove(pago);
    }
}