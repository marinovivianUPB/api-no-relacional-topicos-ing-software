import { Long, ObjectId } from "typeorm";

export interface IEventoEntity {
    id?: ObjectId;
    nombre: string;
    costoAsiento: number;
    descuentoDisponible: number;
    fechaRealizacion: Date;
    createdAt: Date;
    createdBy: Long;
}