import { Long } from "typeorm";

export interface CreateEventoDTO {
    nombre: string;
    costoAsiento: number;
    descuentoDisponible: number;
    fechaRealizacion: Date;
    createdBy: Long;
}