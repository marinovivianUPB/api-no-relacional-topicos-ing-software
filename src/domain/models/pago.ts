import { Long, ObjectId, Timestamp } from 'typeorm';
import { IPagoEntity } from './../entities/IPagoEntity.js';

export class Pago{
    id?: string
    ventaId: string
    comprador: Long
    monto: number
    createdAt: Date
    createdBy: Long

    constructor(pago: IPagoEntity){
        this.id = pago.id.toString();
        this.ventaId = pago.ventaId;
        this.comprador = pago.comprador;
        this.monto = pago.monto;
        this.createdAt = pago.createdAt;
        this.createdBy = pago.createdBy;
    }
}