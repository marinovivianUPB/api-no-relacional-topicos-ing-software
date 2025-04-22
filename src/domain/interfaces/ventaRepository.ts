import { Venta } from "../models/venta.js";

export interface VentaRepository {
    createVenta(venta: Venta): Promise<Venta>
    findByEventoId(id: string): Promise<Venta[]>
    findById(id: string): Promise<Venta>
    updateVenta(venta: Partial<Venta>): Promise<Venta>
    deleteVenta(id: string): Promise<void>
}