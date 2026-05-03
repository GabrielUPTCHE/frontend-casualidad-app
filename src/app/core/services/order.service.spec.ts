import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OrderService } from './order.service';

const mockPedido = {
  idPedido: 1, codigoUnico: 'PED-001', nombreCliente: 'Juan',
  estadoPedido: 'PENDIENTE', fechaEntrega: '2026-06-01',
  total: 500, saldoPendiente: 200
};

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAll and map data', () => {
    let result: any[] = [];
    service.getAll().subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/pedidos'));
    req.flush({ data: [mockPedido] });
    expect(result[0].clientName).toBe('Juan');
    expect(result[0].paymentStatus).toBe('PARTIAL');
    expect(result[0].id).toBe('1');
  });

  it('should getAll with saldoPendiente=0 -> PAID', () => {
    let result: any[] = [];
    service.getAll().subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/pedidos'));
    req.flush({ data: [{ ...mockPedido, saldoPendiente: 0 }] });
    expect(result[0].paymentStatus).toBe('PAID');
  });

  it('should getAll using content fallback', () => {
    let result: any[] = [];
    service.getAll().subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/pedidos'));
    req.flush({ content: [mockPedido] });
    expect(result[0].code).toBe('PED-001');
  });

  it('should getAll with filters', () => {
    service.getAll({ idCliente: 1, estado: 'PENDIENTE', fechaInicio: '2026-01-01', fechaFin: '2026-12-31' }).subscribe();
    const req = httpMock.expectOne(r =>
      r.url.includes('/pedidos') &&
      r.params.has('idCliente') &&
      r.params.has('estado')
    );
    expect(req.request.params.get('estado')).toBe('PENDIENTE');
    req.flush({ data: [] });
  });

  it('should getById', () => {
    let result: any;
    service.getById(1).subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/pedidos/1'));
    req.flush(mockPedido);
    expect(result.idPedido).toBe(1);
  });

  it('should create an order', () => {
    service.create({
      clientId: 2, deliveryDate: '2026-06-01',
      items: [{ productId: 1, quantity: 2, customization: 'Test' }]
    }).subscribe();
    const req = httpMock.expectOne(r => r.method === 'POST' && r.url.endsWith('/pedidos'));
    expect(req.request.body.idCliente).toBe(2);
    expect(req.request.body.detalles[0].cantidad).toBe(2);
    req.flush({});
  });

  it('should activarProduccion', () => {
    let result: any;
    service.activarProduccion(1).subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('activar-produccion'));
    req.flush({ codigoUnico: 'PED-001', estado: 'EN_PRODUCCION' });
    expect(result.estado).toBe('EN_PRODUCCION');
  });

  it('should update an order with deliveryDate', () => {
    service.update(1, {
      deliveryDate: '2026-07-01',
      items: [{ idDetalle: 1, productId: 2, quantity: 3, observaciones: '' }]
    }).subscribe();
    const req = httpMock.expectOne(r => r.method === 'PUT');
    expect(req.request.body.fechaEntrega).toBe('2026-07-01');
    req.flush({});
  });

  it('should update an order without deliveryDate', () => {
    service.update(1, { items: [] }).subscribe();
    const req = httpMock.expectOne(r => r.method === 'PUT');
    expect(req.request.body.fechaEntrega).toBeUndefined();
    req.flush({});
  });

  it('should cancelar an order', () => {
    let result: any;
    service.cancelar(1, true).subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/cancelar'));
    expect(req.request.params.get('reintegrarMateriales')).toBe('true');
    req.flush({ materialesReintegrados: true });
    expect(result.materialesReintegrados).toBe(true);
  });

  it('should delete (delegates to cancelar)', () => {
    let called = false;
    service.delete(1).subscribe(() => called = true);
    const req = httpMock.expectOne(r => r.url.includes('/cancelar'));
    req.flush({});
    expect(called).toBe(true);
  });
});
