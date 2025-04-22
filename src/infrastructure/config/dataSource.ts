import "reflect-metadata";
import { DataSource } from "typeorm";
import { PagoEntity } from "../entities/pagoEntity.js";
import { VentaEntity } from "../entities/ventaEntity.js";
import { EventoEntity } from "../entities/eventoEntity.js";
import { MapaEntity } from "../entities/mapaEntity.js";
import { db } from "../../infrastructure/config/config.js";


export const AppDataSource = new DataSource({
  type: db.type as "mongodb",
  host: db.host,
  port: db.port as number,
  username: db.username,
  password: db.password,
  database: db.database,
  synchronize: true,
  logging: true,
  entities: [PagoEntity, VentaEntity, EventoEntity, MapaEntity],
  subscribers: [],
  migrations: [],
  extra: {
    authSource: "admin",
  },
});