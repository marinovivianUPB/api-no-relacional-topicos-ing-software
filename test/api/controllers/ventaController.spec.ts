import { expect } from "chai";
import sinon from "sinon";
import { VentaController } from '../../../src/api/controllers/ventaController';
import { VentaService } from '../../../src/app/services/ventaService';
import { Request, Response } from 'express';
import { VentaDTO } from '../../../src/app/dtos/venta.dto';
import { CreateVentaDTO } from '../../../src/app/dtos/create.venta.dto';
import { UpdateVentaDTO } from '../../../src/app/dtos/update.venta.dto';
import { Long } from "typeorm";

describe('VentaController', () => {
  let ventaServiceStub: sinon.SinonStubbedInstance<VentaService>;
  let controller: VentaController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;

  beforeEach(() => {
    ventaServiceStub = sinon.createStubInstance(VentaService);
    controller = new VentaController(ventaServiceStub as unknown as VentaService);

    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub as any});

    req = {};
    res = {
      status: statusStub,
    };
  });

    afterEach(() => {
      sinon.restore();
    });

  it('should return ventas by evento ID', async () => {
    const ventas: VentaDTO[] = [{ id: '507f1f77bcf86cd799439211', eventoId: '507f1f77bcf86cd799439311', comprador : 1 as unknown as Long, pagoCompletado : true
        , costoConDescuento : 1, createdAt : new Date(), createdBy : 1 as unknown as Long
        , listaDeAsientos : [[1, 2], [3, 4]]
     } as VentaDTO];
    ventaServiceStub.getVentasByEventoId.resolves(ventas);

    req = { params: { id: '123' } };

    await controller.getByEventoId(req as Request, res as Response);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith(ventas)).to.be.true;
  });

  it('should return 404 if ventas not found', async () => {
    ventaServiceStub.getVentasByEventoId.resolves(undefined as any);
    req = { params: { id: '999' } };

    await controller.getByEventoId(req as Request, res as Response);

    expect(statusStub.calledWith(404)).to.be.true;
    expect(jsonStub.calledWithMatch({ message: sinon.match.string })).to.be.true;
  });

  it('should return venta by ID', async () => {
    const venta: VentaDTO = { id: '507f1f77bcf86cd799439211', eventoId: '507f1f77bcf86cd799439311', comprador : 1 as unknown as Long, pagoCompletado : true
        , costoConDescuento : 1, createdAt : new Date(), createdBy : 1 as unknown as Long
        , listaDeAsientos : [[1, 2], [3, 4]]
     } as VentaDTO;
    ventaServiceStub.getVentaById.resolves(venta);

    req = { params: { id: '5' } };

    await controller.getVentaById(req as Request, res as Response);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith(venta)).to.be.true;
  });

  it('should return 404 if venta not found', async () => {
    req.params = { id: "1" };
    ventaServiceStub.getVentaById.resolves(undefined);

    await controller.getVentaById(req as Request, res as Response);

    expect(statusStub.calledWith(404)).to.be.true;
  });

  it('should create a venta', async () => {
    const dto: CreateVentaDTO = {eventoId: '507f1f77bcf86cd799439311', comprador : 1 as unknown as Long, pagoCompletado : true
        , costoConDescuento : 1
        , listaDeAsientos : [[1, 2], [3, 4]]
        , costoTotal : 300, descuentoAplicado : 50
        , createdBy : 1 as unknown as Long
     } as CreateVentaDTO;
    const created = { ...dto, id: '507f1f77bcf86cd799439211', costoConDescuento : 1, createdAt : new Date(), pagoCompletado : false} as VentaDTO;
    ventaServiceStub.createVenta.resolves(created);

    req = { body: dto };

    await controller.createVenta(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith(created)).to.be.true;
  });

  it('should handle creation error', async () => {
    ventaServiceStub.createVenta.rejects(new Error('Error creating'));
    req = { body: {} };

    await controller.createVenta(req as Request, res as Response);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWithMatch({ message: 'Error creating' })).to.be.true;
  });

  it('should update a venta', async () => {
    const dto: UpdateVentaDTO = { id: '507f1f77bcf86cd799439211'} as UpdateVentaDTO;
    const completa: VentaDTO = {
      ...dto, id: '507f1f77bcf86cd799439211', costoConDescuento : 1, createdAt : new Date(), pagoCompletado : true
      , comprador : 1 as unknown as Long
      , costoTotal : 300, descuentoAplicado : 50
      , listaDeAsientos : [[1, 2], [3, 4]]
      , createdBy : 1 as unknown as Long
    }
    ventaServiceStub.updateVenta.resolves(completa);

    req = { body: dto };

    await controller.updateVenta(req as Request, res as Response);

    expect(statusStub.calledWith(201)).to.be.true;
    expect(jsonStub.calledWith(completa)).to.be.true;
  });

  it('should handle update error', async () => {
    ventaServiceStub.updateVenta.rejects(new Error('Update error'));

    req = { body: {} };

    await controller.updateVenta(req as Request, res as Response);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWithMatch({ message: 'Update error' })).to.be.true;
  });

  it('should delete a venta', async () => {
    ventaServiceStub.delete.resolves();

    req = { params: { id: '1' } };

    await controller.deleteVenta(req as Request, res as Response);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWithMatch({ message: 'Venta eliminada con éxito' })).to.be.true;
  });

      it("return 500 on delete failure", async () => {
      req.params = { id: "1" };
      ventaServiceStub.delete.rejects(new Error("delete failed"));

      await controller.deleteVenta(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.called).to.be.true;
    });
});
