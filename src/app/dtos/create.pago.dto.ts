import { Long, ObjectId, Timestamp } from "typeorm";

export interface CreatePagoDTO {
    comprador: Long;
    ventaId: string;
    monto: number;
    createdBy: Long;
}