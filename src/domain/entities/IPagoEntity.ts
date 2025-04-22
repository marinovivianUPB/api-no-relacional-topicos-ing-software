import { Long, Timestamp, ObjectId } from "typeorm";

export interface IPagoEntity {
    _id?: ObjectId;
    ventaId: string;
    comprador: Long;
    monto: number;
    createdAt: Date;
    createdBy: Long;
}