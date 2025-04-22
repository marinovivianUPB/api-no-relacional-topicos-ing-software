import { Long, Timestamp } from "typeorm";

export interface EventoDTO {
    id: string;
    nombre: string;
    costoAsiento?: number;
    descuentoDisponible?: number;
    fechaRealizacion: Date;
    createdBy: Long;
    createdAt?: Date;
}