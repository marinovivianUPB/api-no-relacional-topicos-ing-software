import {Evento} from "../models/evento.js";

export interface EventoRepository {
    createEvento(evento: Evento): Promise<Evento>;
    findById(id: string): Promise<Evento | null>;
    findAll(): Promise<Evento[]>;
    //pruebas
    deleteEvento(id: string): Promise<void>;
}