import { Long} from "typeorm";

export interface PagoDTO {
    id: string;
    comprador: Long;
    monto: number;
    createdBy: Long;
    createdAt: Date;
}