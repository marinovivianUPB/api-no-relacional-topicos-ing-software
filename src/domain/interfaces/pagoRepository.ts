import { Pago } from "../models/pago.js";

export interface PagoRepository {
    createPago(pago: Pago): Promise<Pago>;
    findByVentaId(id: string): Promise<Pago[] | null>;
    deletePago(id: string): Promise<void>;
}