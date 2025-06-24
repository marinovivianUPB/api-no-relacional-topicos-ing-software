import { Long} from "typeorm";
import { IVentaEntity } from "../entities/IVentaEntity.js";

export class Venta {
    id?: string
    eventoId: string
    comprador: Long
    costoTotal: number
    descuentoAplicado: number
    costoConDescuento: number
    listaDeAsientos: Array<Array<number>>
    pagoCompletado: boolean
    createdAt: Date
    createdBy: Long
    constructor(venta: IVentaEntity) {
        this.id = venta._id? venta._id.toString() : "";
        this.eventoId = venta.eventoId? venta.eventoId : "";
        this.comprador = venta.comprador;
        this.costoTotal = venta.costoTotal;
        this.descuentoAplicado = venta.descuentoAplicado;
        this.costoConDescuento = venta.costoTotal - venta.costoTotal * (venta.descuentoAplicado / 100);
        this.listaDeAsientos = venta.listaDeAsientos;
        this.pagoCompletado = venta.pagoCompletado;
        this.createdAt = venta.createdAt;
        this.createdBy = venta.createdBy;
    }
}