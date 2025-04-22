import { List } from './../../../node_modules/mongodb/src/utils';
import { ObjectId} from "typeorm";
import { IMapaEntity } from "../entities/IMapaEntity.js";

export class Mapa {
    id?: string
    numberOfRows: number
    rows: List<List<number>>
    availableSeats: number
    eventoId?: string
    original: boolean
    constructor(mapa: IMapaEntity) {
        this.id = mapa._id? mapa._id.toString() : "";
        this.numberOfRows = mapa.numberOfRows;
        this.availableSeats = mapa.availableSeats;
        this.rows = mapa.rows;
        this.eventoId = mapa.eventoId;
        this.original = mapa.original;
    }
}