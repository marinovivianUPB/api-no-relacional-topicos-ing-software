import { Long} from "typeorm";

export interface CreateVentaDTO {
    comprador: Long;
    eventoId: string
    costoTotal: number;
    descuentoAplicado: number;
    listaDeAsientos: Array<Array<number>>;
    createdBy: Long;
}