import { List } from './../../../node_modules/mongodb/src/utils';
import { Long, Timestamp, ObjectId } from "typeorm";

export interface IMapaEntity {
    _id?: ObjectId;
    numberOfRows: number;
    rows: List<List<number>>;
    eventoId?: string;
    original: boolean;
    availableSeats?: number;
    createdAt: Date;
    createdBy?: Long;
}