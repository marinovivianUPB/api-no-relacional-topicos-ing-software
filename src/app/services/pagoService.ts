import { ObjectId } from "mongodb";
import { PagoRepository } from "../../domain/interfaces/pagoRepository.js";
import { Pago } from "../../domain/models/pago.js";
import { PagoEntity } from "../../infrastructure/entities/pagoEntity.js";
import { CreatePagoDTO } from "../dtos/create.pago.dto.js";
import { PagoDTO } from "../dtos/pago.dto.js";

export class PagoService {
  constructor(private pagoRepository: PagoRepository) {}

  async createPago(createPagoDTO: CreatePagoDTO): Promise<PagoDTO> {
    const pagoEntity : PagoEntity = {
      ventaId: createPagoDTO.ventaId,
      comprador: createPagoDTO.comprador,
      monto: createPagoDTO.monto,
      createdAt: new Date(),
      createdBy: createPagoDTO.createdBy
    }

    const pago = new Pago(pagoEntity);
    const newPago = await this.pagoRepository.createPago(pago);
    const pagoDTO: PagoDTO = {
      id: newPago.id,
      comprador: newPago.comprador,
      monto: newPago.monto,
      createdAt: newPago.createdAt,
      createdBy: newPago.createdBy
    };
    return pagoDTO;
  }

  async getPagosByVentaId(id: string): Promise<PagoDTO[] | null> {
    const pago = await this.pagoRepository.findByVentaId(id);
    const pagosResponse: PagoDTO[] = pago.map((pago: Pago) => {
      const pagoDTO: PagoDTO = {
        id: pago.id,
        comprador: pago.comprador,
        monto: pago.monto,
        createdAt: pago.createdAt,
        createdBy: pago.createdBy
      };
      return pagoDTO;
    });
    return pagosResponse;
  }

  async delete(id: string): Promise<void> {
    return this.pagoRepository.deletePago(id);
  }
}