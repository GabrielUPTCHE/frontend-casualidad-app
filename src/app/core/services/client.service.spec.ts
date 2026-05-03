import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAll and map response correctly', () => {
    let result: any[] = [];
    service.getAll().subscribe(r => result = r);

    const req = httpMock.expectOne(r => r.url.includes('/clientes'));
    expect(req.request.method).toBe('GET');
    req.flush({
      data: {
        data: [
          { idCliente: 1, nombre: 'Juan', direccion: 'Calle 1', telefonos: ['111'] }
        ]
      }
    });

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Juan');
    expect(result[0].id).toBe('1');
    expect(result[0].phones).toEqual(['111']);
    expect(result[0].isActive).toBe(true);
    expect(result[0].ordersSummary.total).toBe(0);
  });

  it('should getAll with search term', () => {
    service.getAll('Test').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/clientes') && r.params.has('filtro'));
    expect(req.request.params.get('filtro')).toBe('Test');
    req.flush({ data: { data: [] } });
  });

  it('should getAll using content fallback', () => {
    let result: any[] = [];
    service.getAll().subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.url.includes('/clientes'));
    req.flush({ data: { content: [{ idCliente: 2, nombre: 'Maria', telefonos: [] }] } });
    expect(result[0].nombre).toBe('Maria');
  });

  it('should create a client', () => {
    let result: any;
    service.create({ name: 'Pedro', phones: ['999'], address: 'Av. 1' }).subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.method === 'POST');
    expect(req.request.body.nombre).toBe('Pedro');
    req.flush({ data: { idCliente: 3 } });
    expect(result.idCliente).toBe(3);
  });

  it('should update a client', () => {
    let result: any;
    service.update(1, { name: 'Pedro Updated', phones: ['888'], address: 'Av. 2' }).subscribe(r => result = r);
    const req = httpMock.expectOne(r => r.method === 'PUT');
    req.flush({ data: { idCliente: 1 } });
    expect(result.idCliente).toBe(1);
  });

  it('should delete a client', () => {
    let called = false;
    service.delete(1).subscribe(() => called = true);
    const req = httpMock.expectOne(r => r.method === 'DELETE');
    req.flush({ data: null });
    expect(called).toBe(true);
  });
});
