import { InventoryService } from '../core/services/inventory.service';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jest } from '@jest/globals';

const mockProduct = {
  idProducto: 1, name: 'Test', type: 'INSUMO', unit: 'U',
  stock: 10, minStock: 5, purchasePrice: 100, isLowStock: false
} as any;

describe('InventarioComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;
  let mockInventoryService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockInventoryService = {
      getAll: jest.fn(() => of([mockProduct])),
      delete: jest.fn(() => of({})),
      create: jest.fn(() => of(1)),
      update: jest.fn(() => of({})),
      registrarEntrada: jest.fn(() => of({})),
      ajustarInventario: jest.fn(() => of({}))
    };

    mockDialog = {
      open: jest.fn(() => ({
        afterClosed: () => of({ action: 'primary' })
      }))
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: MatDialog, useValue: mockDialog }
      ],
      imports: [InventarioComponent, BrowserAnimationsModule],
    })
    .overrideProvider(MatDialog, { useValue: mockDialog })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should save product (create)', () => {
    component.openAddForm();
    component.inventoryForm.get('name')?.setValue('N');
    component.inventoryForm.get('type')?.setValue('INSUMO');
    component.inventoryForm.get('unit')?.setValue('U');
    component.inventoryForm.get('minStock')?.setValue(1);
    component.saveProduct();
    expect(mockInventoryService.create).toHaveBeenCalled();
  });

  it('should save product (update)', () => {
    component.openEditForm(mockProduct);
    component.inventoryForm.get('name')?.setValue('U');
    component.inventoryForm.get('type')?.setValue('INSUMO');
    component.inventoryForm.get('unit')?.setValue('U');
    component.inventoryForm.get('minStock')?.setValue(1);
    component.saveProduct();
    expect(mockInventoryService.update).toHaveBeenCalled();
  });

  it('should handle error (create)', () => {
    mockInventoryService.create.mockReturnValueOnce(throwError(() => new Error()));
    component.openAddForm();
    component.inventoryForm.get('name')?.setValue('N');
    component.inventoryForm.get('type')?.setValue('INSUMO');
    component.inventoryForm.get('unit')?.setValue('U');
    component.inventoryForm.get('minStock')?.setValue(1);
    component.saveProduct();
    expect(mockInventoryService.create).toHaveBeenCalled();
  });

  it('should handle error (update)', () => {
    mockInventoryService.update.mockReturnValueOnce(throwError(() => new Error()));
    component.openEditForm(mockProduct);
    component.inventoryForm.get('name')?.setValue('U');
    component.inventoryForm.get('type')?.setValue('INSUMO');
    component.inventoryForm.get('unit')?.setValue('U');
    component.inventoryForm.get('minStock')?.setValue(1);
    component.saveProduct();
    expect(mockInventoryService.update).toHaveBeenCalled();
  });
});
