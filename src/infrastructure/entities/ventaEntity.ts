import {
    Entity,
    ObjectIdColumn,
    Column,
    ObjectId,
    Long
  } from "typeorm";

import { IVentaEntity } from "../../domain/entities/IVentaEntity.js";

  @Entity()
  export class VentaEntity implements IVentaEntity {
    @ObjectIdColumn()
    _id?: ObjectId
    @Column({ type: "string" })
    eventoId: string
    @Column({type: "long"})
    comprador: Long
    @Column({type: "double"})
    descuentoAplicado: number
    @Column({type: "double"})
    costoTotal: number
    @Column({type: "array"})
    listaDeAsientos: Array<Array<number>>
    @Column({type: "boolean"})
    pagoCompletado: boolean
    @Column({type: "date"})
    createdAt: Date
    @Column({type: "long"})
    createdBy: Long
  }