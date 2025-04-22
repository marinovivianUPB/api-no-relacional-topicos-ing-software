import { List } from './../../../node_modules/mongodb/src/utils';
import { Long} from "typeorm";

export interface CreateVentaDTO {
    comprador: Long;
    eventoId: string
    costoTotal: number;
    descuentoAplicado: number;
    listaDeAsientos: List<List<number>>;
    createdBy: Long;
}