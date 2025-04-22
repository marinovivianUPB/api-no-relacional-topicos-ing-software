import { List } from './../../../node_modules/mongodb/src/utils';
import { Long, Timestamp } from "typeorm";

export interface PagoDTO {
    id: string;
    comprador: Long;
    monto: number;
    createdBy: Long;
    createdAt: Date;
}