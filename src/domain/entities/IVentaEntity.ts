import { Long, ObjectId} from "typeorm";

export interface IVentaEntity {
    _id?: ObjectId;
    eventoId: string;
    comprador: Long;
    costoTotal: number;
    descuentoAplicado:number;
    listaDeAsientos: Array<Array<number>>;
    pagoCompletado: boolean;
    createdAt: Date;
    createdBy: Long;
}