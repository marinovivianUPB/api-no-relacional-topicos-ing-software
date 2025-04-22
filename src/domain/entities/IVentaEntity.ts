import { List } from './../../../node_modules/mongodb/src/utils';
import { Long, ObjectId} from "typeorm";

export interface IVentaEntity {
    _id?: ObjectId;
    eventoId: string;
    comprador: Long;
    costoTotal: number;
    descuentoAplicado:number;
    listaDeAsientos: List<List<number>>;
    pagoCompletado: boolean;
    createdAt: Date;
    createdBy: Long;
}