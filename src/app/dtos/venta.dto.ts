import { Long} from "typeorm";

export interface VentaDTO {
    id: string;
    comprador: Long;
    costoTotal?: number;
    costoConDescuento: number
    descuentoAplicado?: number;
    listaDeAsientos: Array<Array<number>>
    pagoCompletado: boolean
    createdBy: Long;
    createdAt: Date;
}