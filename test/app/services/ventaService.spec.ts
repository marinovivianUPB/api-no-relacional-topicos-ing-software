import { expect } from "chai";
import sinon from "sinon";
import { VentaService } from "../../../src/app/services/ventaService.js";
import { VentaRepository } from "../../../src/domain/interfaces/ventaRepository.js";
import { Venta } from "../../../src/domain/models/venta.js";
import { CreateVentaDTO } from "../../../src/app/dtos/create.venta.dto.js";
import { UpdateVentaDTO } from "../../../src/app/dtos/update.venta.dto.js";
import { Long } from "typeorm";
import { ObjectId } from "mongodb";

describe("VentaService", () => {
  let ventaRepositoryMock: sinon.SinonStubbedInstance<VentaRepository>;
  let ventaService: VentaService;

  beforeEach(() => {
    ventaRepositoryMock = {
      createVenta: sinon.stub(),
      findByEventoId: sinon.stub(),
      findById: sinon.stub(),
      updateVenta: sinon.stub(),
      deleteVenta: sinon.stub()
    } as any;

    ventaService = new VentaService(ventaRepositoryMock);
  });

  afterEach(() => sinon.restore());

  describe("createVenta", () => {
    it("create a new venta and return VentaDTO", async () => {
      const asientos = [[1, 2], [3, 4]];
      const asientosList = asientos as unknown as Array<Array<number>>;
      const dto: CreateVentaDTO = {
        eventoId: "evento123",
        comprador: 2 as unknown as Long,
        costoTotal: 300,
        descuentoAplicado: 50,
        listaDeAsientos: asientosList,
        createdBy: 1 as unknown as Long
      };

      const createdVenta = new Venta({
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        eventoId: dto.eventoId,
        comprador: dto.comprador,
        costoTotal: dto.costoTotal,
        descuentoAplicado: dto.descuentoAplicado,
        listaDeAsientos: dto.listaDeAsientos,
        pagoCompletado: false,
        createdAt: new Date(),
        createdBy: dto.createdBy
      });

      ventaRepositoryMock.createVenta.resolves(createdVenta);

      const result = await ventaService.createVenta(dto);

      expect(result).to.include({
        id: "507f1f77bcf86cd799439011",
        comprador: 2 as unknown as Long,
        costoTotal: 300,
        descuentoAplicado: 50,
        pagoCompletado: false,
        createdBy: 1 as unknown as Long
      });
      expect(result.listaDeAsientos).to.deep.equal(asientos);
      expect(result.createdAt).to.be.instanceOf(Date);
    });
  });

  describe("getVentasByEventoId", () => {
    it("return an array of VentaDTO", async () => {
      const asientos = [[1, 2], [3, 4]];
      const asientosList = asientos as unknown as Array<Array<number>>;
      const asientos2 = [[0, 2], [2, 4]];
      const asientosList2 = asientos2 as unknown as Array<Array<number>>;
      const ventasMock = [
        new Venta({
          _id: new ObjectId("507f1f77bcf86cd799439011"),
          eventoId: "507f1f77bcf86cd799439211",
          comprador: 2 as unknown as Long,
          costoTotal: 100,
          descuentoAplicado: 10,
          listaDeAsientos: asientosList,
          pagoCompletado: false,
          createdAt: new Date(),
          createdBy: 1 as unknown as Long
        }),
        new Venta({
          _id: new ObjectId("507f1f77bcf86cd799439021"),
          eventoId: "507f1f77bcf86cd799439211",
          comprador: 3 as unknown as Long,
          costoTotal: 100,
          descuentoAplicado: 10,
          listaDeAsientos: asientosList2,
          pagoCompletado: false,
          createdAt: new Date(),
          createdBy: 1 as unknown as Long
        })
      ];

      ventaRepositoryMock.findByEventoId.resolves(ventasMock);

      const result = await ventaService.getVentasByEventoId("507f1f77bcf86cd799439211");

      expect(result).to.be.an("array").with.lengthOf(2);
      expect(result[0]).to.include({ id: "507f1f77bcf86cd799439011", comprador: 2, costoConDescuento: 90, pagoCompletado: false, createdBy: 1});
      expect(result[1]).to.include({ id: "507f1f77bcf86cd799439021", comprador: 3, costoConDescuento: 90, pagoCompletado: false, createdBy: 1 });
      expect(result[0].listaDeAsientos).to.deep.equal(asientos);
      expect(result[1].listaDeAsientos).to.deep.equal(asientos2);
      expect(result[0].createdAt).to.be.instanceOf(Date);
      expect(result[1].createdAt).to.be.instanceOf(Date);
      expect(result[0].createdAt.getTime()).to.be.lessThanOrEqual(new Date().getTime());
      expect(result[1].createdAt.getTime()).to.be.lessThanOrEqual(new Date().getTime());


    });
  });

  describe("getVentaById", () => {
    it("return a VentaDTO by id", async () => {
      const asientos = [[1, 2], [3, 4]];
      const asientosList = asientos as unknown as Array<Array<number>>;
      const venta = new Venta({
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        eventoId: "507f1f77bcf86cd799439211",
        comprador: 2 as unknown as Long,
        costoTotal: 500,
        descuentoAplicado: 10,
        listaDeAsientos: asientosList,
        pagoCompletado: true,
        createdAt: new Date(),
        createdBy: 1 as unknown as Long
      });

      ventaRepositoryMock.findById.resolves(venta);

      const result = await ventaService.getVentaById("507f1f77bcf86cd799439011");

      expect(result).to.include({
        id: "507f1f77bcf86cd799439011",
        comprador: 2 as unknown as Long,
        costoTotal: 500,
        descuentoAplicado: 10,
        costoConDescuento: 450,
        pagoCompletado: true,
        createdBy: 1 as unknown as Long
      });
      expect(result.listaDeAsientos).to.deep.equal(asientos);
      expect(result.createdAt.getTime()).to.be.lessThanOrEqual(new Date().getTime());
    });
  });

  describe("updateVenta", () => {
    it("update venta to mark as paid and return VentaDTO", async () => {
      const updateDto: UpdateVentaDTO = {
        id: "507f1f77bcf86cd799439011"
      };
      const asientos = [[1, 2], [3, 4]];
      const asientosList = asientos as unknown as Array<Array<number>>;

      const updatedVenta = new Venta({
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        eventoId: "507f1f77bcf86cd799439211",
        comprador: 2 as unknown as Long,
        costoTotal: 200,
        descuentoAplicado: 20,
        listaDeAsientos: asientosList,
        pagoCompletado: true,
        createdAt: new Date(),
        createdBy: 1 as unknown as Long
      });

      ventaRepositoryMock.updateVenta.resolves(updatedVenta);

      const result = await ventaService.updateVenta(updateDto);

      expect(ventaRepositoryMock.updateVenta.calledOnce).to.be.true;
      expect(result).to.include({
        id: "507f1f77bcf86cd799439011",
        comprador: 2,
        costoTotal: 200,
        descuentoAplicado: 20,
        costoConDescuento: 160,
        pagoCompletado: true,
        createdBy: 1
      });
      expect(result.listaDeAsientos).to.deep.equal(asientos);
      expect(result.createdAt.getTime()).to.be.lessThanOrEqual(new Date().getTime());

    });
  });

  describe("delete", () => {
    it("call deleteVenta with correct ID", async () => {
      await ventaService.delete("ventaToDelete");

      expect(ventaRepositoryMock.deleteVenta.calledOnceWith("ventaToDelete")).to.be.true;
    });
  });
});
