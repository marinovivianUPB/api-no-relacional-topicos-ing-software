import { ObjectId } from "mongodb";
import { VentaRepository } from "../../domain/interfaces/ventaRepository.js";
import { VentaEntity } from "../../infrastructure/entities/ventaEntity.js";
import { CreateVentaDTO } from "../dtos/create.venta.dto.js";
import { UpdateVentaDTO } from "../dtos/update.venta.dto.js";
import { VentaDTO } from "../dtos/venta.dto.js";
import { Venta } from "../../domain/models/venta.js";

export class VentaService {
    constructor(private ventaRepository: VentaRepository) {}

    async createVenta(createVentaDTO: CreateVentaDTO): Promise<VentaDTO> {
        const ventaEntity : VentaEntity = {
            eventoId: createVentaDTO.eventoId,
            comprador: createVentaDTO.comprador,
            costoTotal: createVentaDTO.costoTotal,
            descuentoAplicado: createVentaDTO.descuentoAplicado,
            listaDeAsientos: createVentaDTO.listaDeAsientos,
            pagoCompletado: false,
            createdAt: new Date(),
            createdBy: createVentaDTO.createdBy,
        }

        const venta = new Venta(ventaEntity);
        const newVenta = await this.ventaRepository.createVenta(venta);
        const ventaResponse : VentaDTO = {
            id: newVenta.id,
            comprador: newVenta.comprador,
            costoTotal: newVenta.costoTotal,
            descuentoAplicado: newVenta.descuentoAplicado,
            costoConDescuento: newVenta.costoConDescuento,
            listaDeAsientos: newVenta.listaDeAsientos,
            pagoCompletado: newVenta.pagoCompletado,
            createdAt: newVenta.createdAt,
            createdBy: newVenta.createdBy,
        }

        return ventaResponse;

    }

    async getVentasByEventoId(id: string): Promise<VentaDTO[]> {
        const venta = await this.ventaRepository.findByEventoId(id);
        const ventasResponse : VentaDTO[] = venta.map((venta : Venta) => {
            const ventaDTO : VentaDTO = {
                id: venta.id,
                comprador: venta.comprador,
                //costoTotal: venta.costoTotal,
                //descuentoAplicado: venta.descuentoAplicado,
                costoConDescuento: venta.costoConDescuento,
                listaDeAsientos: venta.listaDeAsientos,
                pagoCompletado: venta.pagoCompletado,
                createdAt: venta.createdAt,
                createdBy: venta.createdBy,
            };
            return ventaDTO;
        });
        return ventasResponse;
    }

    async getVentaById(id: string): Promise<VentaDTO> {
        const venta = await this.ventaRepository.findById(id);
        const ventaResponse : VentaDTO = {
            id: venta.id,
            comprador: venta.comprador,
            costoTotal: venta.costoTotal,
            descuentoAplicado: venta.descuentoAplicado,
            costoConDescuento: venta.costoConDescuento,
            listaDeAsientos: venta.listaDeAsientos,
            pagoCompletado: venta.pagoCompletado,
            createdAt: venta.createdAt,
            createdBy: venta.createdBy,
        };
        return ventaResponse;
    }

    async updateVenta(venta: UpdateVentaDTO): Promise<VentaDTO> {
        const partialVenta : Partial<Venta> = {
            id: venta.id,
            pagoCompletado: true
        }
        const ventaUpdated = await this.ventaRepository.updateVenta(partialVenta);
        const ventaResponse : VentaDTO = {
            id: ventaUpdated.id,
            comprador: ventaUpdated.comprador,
            costoTotal: ventaUpdated.costoTotal,
            descuentoAplicado: ventaUpdated.descuentoAplicado,
            costoConDescuento: ventaUpdated.costoConDescuento,
            listaDeAsientos: ventaUpdated.listaDeAsientos,
            pagoCompletado: ventaUpdated.pagoCompletado,
            createdAt: ventaUpdated.createdAt,
            createdBy: ventaUpdated.createdBy,
        };
        return ventaResponse
    }

    async delete(id: string): Promise<void> {
        return this.ventaRepository.deleteVenta(id);
    }
}