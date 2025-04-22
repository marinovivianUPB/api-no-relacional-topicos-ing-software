import { List } from './../../../node_modules/mongodb/src/utils';
import {
    Entity,
    ObjectIdColumn,
    Column,
    ObjectId,
    Long
  } from "typeorm";

import { IMapaEntity } from "../../domain/entities/IMapaEntity.js";

@Entity()
export class MapaEntity implements IMapaEntity {
    @ObjectIdColumn()
    _id?: ObjectId;
    @Column({type: "number"})
    numberOfRows: number;
    @Column({type: "number"})
    availableSeats: number;
    @Column({type: "array"})
    rows: List<List<number>>;
    @Column({type: "string"})
    eventoId?: string;
    @Column({type: "boolean"})
    original: boolean;
    @Column({type: "date"})
    createdAt: Date;
    @Column({type: "long"})
    createdBy: Long;
}