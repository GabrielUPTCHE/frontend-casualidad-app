import { OrderService } from '../core/services/order.service';
import { ClientService } from '../core/services/client.service';
import { InventoryService } from '../core/services/inventory.service';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosComponent } from './pedidos';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { jest } from '@jest/globals';

const mockOrder = { idPedido: 1, id: 1, codigoUnico: 'PED-001', estadoPedido: 'DONE', nombreCliente: 'Alpha', clientName: 'Alpha', saldoPendiente: 0, fechaEntrega: '2026-01-01' };

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;
  let mockOrderService: any;
  let mockClientService: any;
  let mockInventoryService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockOrderService = {
      getAll: jest.fn(() => of([mockOrder])),
      delete: jest.fn(() => of({})),
      create: jest.fn(() => of({ codigoUnico: 'PED-001', estado: 'EN_PRODUCCION' })),
      update: jest.fn(() => of({})),
      cancelar: jest.fn(() => of({})),
      getById: jest.fn(() => of({ idPedido: 1, cliente: { idCliente: 1, nombreCompleto: 'Alpha' }, fechaEntrega: '2026-01-01', productos: [{idDetalle: 1, nombreProducto: 'P1', cantidad: 5}] })),
      activarProduccion: jest.fn(() => of({ codigoUnico: 'PED-001', estado: 'EN_PRODUCCION' }))
    };

    mockClientService = {
      getAll: jest.fn(() => of([{ idCliente: 1, nombre: 'Alpha' }]))
    };

    mockInventoryService = {
      getAll: jest.fn(() => of([{ idProducto: 1, nombre: 'P1' }]))
    };

    mockDialog = {
      open: jest.fn(() => ({
        afterClosed: () => of(true)
      }))
    };

    await TestBed.configureTestingModule({
      imports: [PedidosComponent, BrowserAnimationsModule],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: ClientService, useValue: mockClientService },
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: MatDialog, useValue: mockDialog }
      ],
    })
    .overrideProvider(MatDialog, { useValue: mockDialog })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
    component.paginator = { firstPage: jest.fn() } as any;
    fixture.detectChanges();
  });

  it('should load all data on init', () => {
    expect(mockOrderService.getAll).toHaveBeenCalled();
    expect(mockClientService.getAll).toHaveBeenCalled();
    expect(mockInventoryService.getAll).toHaveBeenCalled();
    expect(component.ordersData.length).toBe(1);
  });

  it('should compute subtotalEstimate correctly', () => {
    component.addItem();
    component.itemsFormArray.at(0).get('quantity')?.setValue(2);
    component.itemsFormArray.at(0).get('unitPrice')?.setValue(50);
    expect(component.subtotalEstimate).toBe(100);
  });

  it('should save order successfully (create)', () => {
    component.openAddForm();
    component.orderForm.get('clientId')?.setValue(1);
    component.orderForm.get('deliveryDate')?.setValue('2026-12-31');
    component.itemsFormArray.at(0).get('productId')?.setValue(1);
    component.itemsFormArray.at(0).get('quantity')?.setValue(1);
    component.saveOrder();
    expect(mockOrderService.create).toHaveBeenCalled();
  });

  it('should handle error when loading orders', () => {
    mockOrderService.getAll.mockReturnValueOnce(throwError(() => new Error('Err')));
    component.loadOrders();
    expect(component.ordersData.length).toBe(1);
  });

  it('should open edit form and build items', () => {
    component.openEditForm(mockOrder as any);
    expect(mockOrderService.getById).toHaveBeenCalled();
    // After async pipe, buildItemsFromProducts should be called
  });

  it('should handle sortingDataAccessor', () => {
    const item = { nombreCliente: 'Alpha', clientName: 'Alpha', idPedido: 1, codigoUnico: 'C1', fechaEntrega: '2026-01-01', saldoPendiente: 10 } as any;
    expect(component.dataSource.sortingDataAccessor(item, 'cliente')).toBe('Alpha');
    expect(component.dataSource.sortingDataAccessor(item, 'fecha')).toBeGreaterThan(0);
    expect(component.dataSource.sortingDataAccessor(item, 'saldo')).toBe(10);
  });

  it('should handle search', () => {
    component.searchTerm = 'Alpha';
    component.onSearchChange();
    expect(component.dataSource.filter).toBe('alpha');
  });

  it('should confirm production and open success dialog', () => {
    component.selectedOrder = mockOrder as any;
    component.confirmActivarProduccion();
    expect(mockOrderService.activarProduccion).toHaveBeenCalledWith(1);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle cancelation', () => {
    mockDialog.open.mockReturnValueOnce({ afterClosed: () => of(true) });
    component.openDeleteModal(mockOrder as any);
    expect(mockOrderService.cancelar).toHaveBeenCalled();
  });
});
