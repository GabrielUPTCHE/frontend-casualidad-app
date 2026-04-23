import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesComponent } from './clientes';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter clients correctly', () => {
    component.clientsData = [
      { id: '1', name: 'Alpha', email: 'a@a.com', phone: '1', documentId: '1', totalOrders: 0, activeOrders: 0, totalSpent: 0, ordersSummary: {total:0, active:0, cancelled:0, pendingBalance:0} },
      { id: '2', name: 'Beta', email: 'b@b.com', phone: '2', documentId: '2', totalOrders: 0, activeOrders: 0, totalSpent: 0, ordersSummary: {total:0, active:0, cancelled:0, pendingBalance:0} },
    ];
    
    component.searchTerm = 'Alpha';
    component.onSearchChange();
    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].name).toBe('Alpha');
  });

  it('should handle pagination', () => {
    component.clientsData = Array(10).fill({ id: '1', name: 'Alpha', email: 'a@a.com', phone: '1', documentId: '1', totalOrders: 0, activeOrders: 0, totalSpent: 0, ordersSummary: {total:0, active:0, cancelled:0, pendingBalance:0} });
    component.pageSize = 3;
    component.searchTerm = '';
    component.onSearchChange();
    
    component.onPageChange(2);
    expect(component.paginatedClients.length).toBe(3);
  });

  it('should handle products modal', () => {
    const c = component.clientsData[0];
    component.openProductsModal(c);
    expect(component.showProductsModal).toBe(true);
    component.closeProductsModal();
    expect(component.showProductsModal).toBe(false);
  });

  it('should handle delete modal and confirm', () => {
    component.clientsData = [
      { id: '1', name: 'Alpha', email: 'a@a.com', phone: '1', documentId: '1', totalOrders: 0, activeOrders: 0, totalSpent: 0, ordersSummary: {total:0, active:0, cancelled:0, pendingBalance:0} }
    ];
    const c = component.clientsData[0];
    
    component.openDeleteModal(c);
    expect(component.showDeleteModal).toBe(true);
    
    component.confirmDelete();
    expect(component.clientsData.length).toBe(0);
    expect(component.showDeleteModal).toBe(false);
  });
});
