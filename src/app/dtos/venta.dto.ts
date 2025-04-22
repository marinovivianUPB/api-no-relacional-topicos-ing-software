import { List } from './../../../node_modules/mongodb/src/utils';
import { Long, Timestamp } from "typeorm";

export interface VentaDTO {
    id: string;
    comprador: Long;
    costoTotal?: number;
    costoConDescuento: number
    descuentoAplicado: number;
    listaDeAsientos: List<List<number>>
    pagoCompletado: boolean
    createdBy: Long;
    createdAt: Date;
}