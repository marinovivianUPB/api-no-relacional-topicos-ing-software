import { Timestamp, Long } from "typeorm";
import { IEventoEntity } from "../entities/IEventoEntity.js";

export class Evento {
    id?: string;
    nombre: string;
    costoAsiento: number;
    descuentoDisponible: number;
    fechaRealizacion: Date;
    createdAt: Date;
    createdBy: Long;
    constructor(evento: IEventoEntity) {
        this.id = evento.id?.toString();
        this.nombre = evento.nombre;
        this.costoAsiento = evento.costoAsiento;
        this.descuentoDisponible = evento.descuentoDisponible;
        this.fechaRealizacion = evento.fechaRealizacion;
        this.createdAt = evento.createdAt;
        this.createdBy = evento.createdBy;
    }
}