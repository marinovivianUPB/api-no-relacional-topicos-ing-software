import {
  ObjectIdColumn,
    Entity,
    Column,
    ObjectId
  } from "typeorm";
import {Long} from "mongodb"

import { IPagoEntity } from "../../domain/entities/IPagoEntity.js";

@Entity()
export class PagoEntity implements IPagoEntity {
    @ObjectIdColumn()
    id?: ObjectId
    @Column({type: "string"})
    ventaId: string
    @Column({type: "long"})
    comprador: Long
    @Column({type: "double"})
    monto: number
    @Column({type: "date"})
    createdAt: Date
    @Column({type: "long"})
    createdBy: Long
}