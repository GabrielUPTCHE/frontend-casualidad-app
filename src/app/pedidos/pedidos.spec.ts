import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosComponent } from './pedidos';

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter orders', () => {
    component.ordersData = [
      { id: '1', code: '001', clientName: 'Alpha', totalAmount: 100, pendingBalance: 0, status: 'DONE', createdAt: '2026', deliveryDate: '2026', clientId: '1' }
    ];
    component.searchTerm = 'Alpha';
    component.onSearchChange();
    expect(component.filteredOrders.length).toBe(1);
  });

  it('should handle pagination', () => {
    component.ordersData = Array(10).fill({ id: '1', code: '001', clientName: 'Alpha', totalAmount: 100, pendingBalance: 0, status: 'DONE', createdAt: '2026', deliveryDate: '2026', clientId: '1' });
    component.pageSize = 5;
    component.onSearchChange();
    
    component.onPageChange(2);
    expect(component.paginatedOrders.length).toBe(5);
  });

  it('should sort correctly', () => {
    component.ordersData = [
      { id: '1', code: '001', clientName: 'Z', totalAmount: 100, pendingBalance: 50, status: 'DONE', createdAt: '2026', deliveryDate: '2026-01-01', clientId: '1' },
      { id: '2', code: '002', clientName: 'A', totalAmount: 100, pendingBalance: 0, status: 'DONE', createdAt: '2026', deliveryDate: '2026-02-01', clientId: '2' }
    ];
    component.handleSort('cliente');
    expect(component.filteredOrders[0].clientName).toBe('A');
    component.handleSort('cliente');
    expect(component.filteredOrders[0].clientName).toBe('Z');
    
    component.handleSort('id');
    component.handleSort('estado');
    component.handleSort('fecha');
    component.handleSort('saldo');
    component.handleSort('unknown');
    
    expect(component.getSortIcon('unknown')).toBe('expand_less');
  });

  it('should handle delete modal and confirm', () => {
    component.ordersData = [
      { id: '1', code: '001', clientName: 'Z', totalAmount: 100, pendingBalance: 50, status: 'DONE', createdAt: '2026', deliveryDate: '2026', clientId: '1' },
    ];
    const o = component.ordersData[0];
    component.openDeleteModal(o);
    expect(component.showDeleteModal).toBe(true);
    
    component.confirmDelete();
    expect(component.ordersData.length).toBe(0);
    expect(component.showSuccessModal).toBe(true);
    
    component.closeSuccessModal();
    expect(component.showSuccessModal).toBe(false);
  });
});
