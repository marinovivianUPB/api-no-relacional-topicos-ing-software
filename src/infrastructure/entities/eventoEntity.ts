import {
    Entity,
    ObjectIdColumn,
    Column,
    ObjectId,
    Long
  } from "typeorm";

import { IEventoEntity } from "../../domain/entities/IEventoEntity.js";

@Entity()
export class EventoEntity implements IEventoEntity {
  @ObjectIdColumn()
  _id?: ObjectId;
  @Column({type: "string"})
  nombre: string;
  @Column({type: "double"})
  costoAsiento: number;
  @Column({type: "double"})
  descuentoDisponible: number;
  @Column({type: "date"})
  fechaRealizacion: Date;
  @Column({type: "date"})
  createdAt: Date;
  @Column({type: "long"})
  createdBy: Long;
}