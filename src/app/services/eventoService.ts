import { EventoRepository } from "../../domain/interfaces/eventoRepository.js";
import { Evento } from "../../domain/models/evento.js";
import { EventoEntity } from "../../infrastructure/entities/eventoEntity.js";
import { CreateEventoDTO } from "../dtos/create.evento.dto.js";
import { EventoDTO } from "../dtos/evento.dto.js";

export class EventoService {
    constructor(
        private eventoRepository: EventoRepository,
    ) {}

    async getEventos(): Promise<EventoDTO[]> {

        const eventos = await this.eventoRepository.findAll();

        const eventosResponse : EventoDTO[] = eventos.map((evento: Evento) => {
            const eventoDTO: EventoDTO = {
                id: evento.id,
                nombre: evento.nombre,
                fechaRealizacion: evento.fechaRealizacion,
                createdBy: evento.createdBy
            };
            return eventoDTO
        });

        return eventosResponse
    }

    async getEventoById(id: string): Promise<EventoDTO | null> {
        const evento = await this.eventoRepository.findById(id);
        const eventoResponse : EventoDTO = {
            id: evento.id,
            nombre: evento.nombre,
            costoAsiento: evento.costoAsiento,
            descuentoDisponible: evento.descuentoDisponible,
            fechaRealizacion: evento.fechaRealizacion,
            createdBy: evento.createdBy,
            createdAt: evento.createdAt
        }
        return eventoResponse;
    }

    async createEvento(createEventoDTO: CreateEventoDTO): Promise<EventoDTO> {
        const eventoEntity : EventoEntity = {
            nombre: createEventoDTO.nombre,
            costoAsiento: createEventoDTO.costoAsiento,
            descuentoDisponible: createEventoDTO.descuentoDisponible,
            fechaRealizacion: createEventoDTO.fechaRealizacion,
            createdBy: createEventoDTO.createdBy,
            createdAt: new Date()
        };
        const evento = new Evento(eventoEntity);
        const newEvento = await this.eventoRepository.createEvento(evento);

        const eventoResponse : EventoDTO = {
            id: newEvento.id,
            nombre: newEvento.nombre,
            costoAsiento: newEvento.costoAsiento,
            descuentoDisponible: newEvento.descuentoDisponible,
            fechaRealizacion: newEvento.fechaRealizacion,
            createdBy: newEvento.createdBy,
            createdAt: newEvento.createdAt
        }
        return eventoResponse;
    }

    async delete(id: string): Promise<void> {
        return this.eventoRepository.deleteEvento(id);
    }
}