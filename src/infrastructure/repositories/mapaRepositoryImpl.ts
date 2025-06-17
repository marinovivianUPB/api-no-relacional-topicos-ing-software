import { ObjectId } from "mongodb";
import { MapaRepository } from "../../domain/interfaces/mapaRepository.js";
import { Mapa } from "../../domain/models/mapa.js";
import { AppDataSource } from "../config/dataSource.js";
import { MapaEntity } from "../entities/mapaEntity.js";
import logger from "../logger/logger.js";

export class MapaRepositoryImpl implements MapaRepository {
    async updateMapa(mapa: Partial<Mapa>): Promise<Mapa> {
        throw new Error("Method not implemented.");
    }
    async saveMapa(mapa: Mapa): Promise<Mapa> {
        const mapaRepository = AppDataSource.getRepository(MapaEntity);
        const mapaEntity = mapaRepository.create({
            numberOfRows: mapa.numberOfRows,
            availableSeats: mapa.availableSeats,    
            rows: mapa.rows,
            eventoId: mapa.eventoId ? mapa.eventoId : null,
            original: mapa.original
        });
        const mapaResponse = await mapaRepository.save(mapa);
        return new Mapa(mapaResponse);
    }
    async findByEventoId(id: string): Promise<Mapa | null> {
        const mapaRepository = AppDataSource.getRepository(MapaEntity);
        const mapa = await mapaRepository.findOneBy({ eventoId: id });
        return mapa ? new Mapa(mapa) : null;
    }
    async findOriginal(): Promise<Mapa | null> {
        const mapaRepository = AppDataSource.getRepository(MapaEntity);
        const mapa = await mapaRepository.findOneBy({ original: true });
        return mapa ? new Mapa(mapa) : null;
    }
    async deleteMapa(id: string): Promise<void> {
        const mapaRepository = AppDataSource.getRepository(MapaEntity);
        const mapa = await mapaRepository.findOneBy({ _id: new ObjectId(id) });
        if(!mapa){
            logger.error(`MapaRepository: Error al eliminar la mapa con ID: ${id}.`);
            throw new Error("No se pudo eliminar el mapa");
        }
        await mapaRepository.remove(mapa);
    }
}