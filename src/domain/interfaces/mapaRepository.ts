import { Mapa } from "../models/mapa.js";

export interface MapaRepository {
    saveMapa(mapa: Mapa): Promise<Mapa>;
    findByEventoId(id: string): Promise<Mapa | null>;
    findOriginal(): Promise<Mapa | null>;
    updateMapa(mapa: Partial<Mapa>): Promise<Mapa>;
    deleteMapa(id: string): Promise<void>;
}