import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario';

describe('InventarioComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate totalInventoryValue and getLowStockCount', () => {
    component.productsData = [
      { id: '1', name: 'A', description: '', purchasePrice: 10, stock: 5, categoryId: '1', imageUrl: '', createdAt: '', updatedAt: '', isLowStock: true, type: 'MATERIAL', unit: 'U' },
      { id: '2', name: 'B', description: '', purchasePrice: 20, stock: 2, categoryId: '1', imageUrl: '', createdAt: '', updatedAt: '', isLowStock: false, type: 'MATERIAL', unit: 'U' }
    ];
    
    expect(component.getLowStockCount()).toBe(1);
    expect(component.totalInventoryValue).toBe(90); // 10*5 + 20*2
  });

  it('should handle filters and pagination', () => {
    component.productsData = [
      { id: '1', name: 'A', description: '', purchasePrice: 10, stock: 5, categoryId: '1', imageUrl: '', createdAt: '', updatedAt: '', isLowStock: true, type: 'MATERIAL', unit: 'U' },
      { id: '2', name: 'B', description: '', purchasePrice: 20, stock: 2, categoryId: '1', imageUrl: '', createdAt: '', updatedAt: '', isLowStock: false, type: 'MATERIAL', unit: 'U' }
    ];
    component.setFilter('lowstock');
    expect(component.filteredProducts.length).toBe(1);
    
    component.setFilter('all');
    component.searchTerm = 'B';
    component.onSearchChange();
    expect(component.filteredProducts[0].name).toBe('B');
  });

  it('should handle delete modal and confirm', () => {
    component.productsData = [
      { id: '1', name: 'A', description: '', purchasePrice: 10, stock: 5, categoryId: '1', imageUrl: '', createdAt: '', updatedAt: '', isLowStock: true, type: 'MATERIAL', unit: 'U' }
    ];
    const p = component.productsData[0];
    component.openDeleteModal(p);
    expect(component.showDeleteModal).toBe(true);
    
    component.confirmDelete();
    expect(component.productsData.length).toBe(0);
    expect(component.showSuccessModal).toBe(true);
    
    component.closeSuccessModal();
    expect(component.showSuccessModal).toBe(false);
  });
});
