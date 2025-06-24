import { Long, ObjectId } from "typeorm";

export interface IMapaEntity {
    _id?: ObjectId;
    numberOfRows: number;
    rows: Array<Array<number>>;
    eventoId?: string;
    original: boolean;
    availableSeats?: number;
    createdAt: Date;
    createdBy?: Long;
}