import { EventoRepository } from "../../domain/interfaces/eventoRepository.js";
import { Evento } from "../../domain/models/evento.js";
import { AppDataSource } from "../config/dataSource.js";
import { EventoEntity } from "../entities/eventoEntity.js";
import logger from "../logger/logger.js";
import { ObjectId } from "mongodb";

export class EventoRepositoryImpl implements EventoRepository {
    async createEvento(evento: Evento): Promise<any> {
        const eventoRepository = AppDataSource.getRepository(EventoEntity);
        const eventoEntity = eventoRepository.create({
            nombre: evento.nombre,
            costoAsiento: evento.costoAsiento,
            descuentoDisponible: evento.descuentoDisponible,
            fechaRealizacion: evento.fechaRealizacion,
            createdAt: evento.createdAt,
            createdBy: evento.createdBy
        })
        const eventoResponse = await eventoRepository.save(eventoEntity);
        return new Evento(eventoResponse);
    }

    async findById(id: string): Promise<Evento | null> { 
        const eventoRepository = AppDataSource.getRepository(EventoEntity);
        const evento = await eventoRepository.findOneBy({_id: new ObjectId(id)});
        return evento ? new Evento(evento) : null;
    }

    async findAll(): Promise<Evento[]> {
        const eventoRepository = AppDataSource.getRepository(EventoEntity);
        const eventos = await eventoRepository.find();
        if (eventos) {
            return eventos.map(evento => new Evento(evento));
        }
        return null;
    }

    async deleteEvento(id: string): Promise<void> {
        const eventoRepository = AppDataSource.getRepository(EventoEntity);
        const evento = await eventoRepository.findOneBy({_id: new ObjectId(id)});
        if(!evento){
            logger.error(`EventoRepository: Error al eliminar al evento con ID: ${id}.`);
            throw new Error("No se pudo eliminar el evento");
        }
        await eventoRepository.remove(evento);
    }
}