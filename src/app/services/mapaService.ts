import { ObjectId } from "mongodb";
import { MapaRepository } from "../../domain/interfaces/mapaRepository.js";
import { MapaEntity } from "../../infrastructure/entities/mapaEntity.js";
import { CreateMapaDTO } from "../dtos/create.mapa.dto.js";
import { MapaDTO } from "../dtos/mapa.dto.js";
import { Mapa } from "../../domain/models/mapa.js";

export class MapaService {
    constructor(private mapaRepository: MapaRepository) {}

    async saveMapa(createMapaDTO: CreateMapaDTO): Promise<MapaDTO> {
        const mapaEntity : MapaEntity = {
            numberOfRows: createMapaDTO.numberOfRows,
            availableSeats: createMapaDTO.availableSeats,    
            rows: createMapaDTO.rows,
            eventoId: createMapaDTO.eventoId ? createMapaDTO.eventoId : null,
            original: false,
            createdAt: new Date(),
            createdBy: null
        }
        const mapa = new Mapa(mapaEntity);
        const newMapa = await this.mapaRepository.saveMapa(mapa);
        const mapaResponse : MapaDTO = {
            id: newMapa.id ? newMapa.id : null,
            numberOfRows: newMapa.numberOfRows,
            rows: newMapa.rows,
            availableSeats: newMapa.availableSeats,
            original: newMapa.original
        }
        return mapaResponse;

    }

    async findByEventoId(id: string): Promise<MapaDTO | null> {
        const mapa = await this.mapaRepository.findByEventoId(id);
        const mapaResponse : MapaDTO = {
            id: mapa.id ? mapa.id : null,
            numberOfRows: mapa.numberOfRows,
            rows: mapa.rows,
            availableSeats: mapa.availableSeats,
            original: mapa.original
        }
        return mapaResponse;
    }

    async findOriginal(): Promise<MapaDTO | null> {
        const mapa = await this.mapaRepository.findOriginal();
        const mapaResponse : MapaDTO = {
            id: mapa.id ? mapa.id : null,
            numberOfRows: mapa.numberOfRows,
            rows: mapa.rows,
            availableSeats: mapa.availableSeats,
            original: mapa.original
        }
        return mapaResponse;
    }

    async deleteMapa(id: string): Promise<void> {
        return this.mapaRepository.deleteMapa(id);
    }
}