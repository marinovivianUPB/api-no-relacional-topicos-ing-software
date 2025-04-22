import { Long, ObjectId } from "typeorm";

export interface IEventoEntity {
    _id?: ObjectId;
    nombre: string;
    costoAsiento: number;
    descuentoDisponible: number;
    fechaRealizacion: Date;
    createdAt: Date;
    createdBy: Long;
}