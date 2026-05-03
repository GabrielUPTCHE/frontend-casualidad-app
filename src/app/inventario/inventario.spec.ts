import { InventoryService } from '../core/services/inventory.service';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jest } from '@jest/globals';

describe('InventarioComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;
  let mockInventoryService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockInventoryService = {
      getAll: jest.fn(() => of([])),
      delete: jest.fn(() => of({})),
      create: jest.fn(() => of(1)),
      update: jest.fn(() => of({})),
      registrarEntrada: jest.fn(() => of({})),
      ajustarInventario: jest.fn(() => of({})),
      addComposicion: jest.fn(() => of({}))
    };
    mockDialog = { open: jest.fn(() => ({ afterClosed: () => of(true) })) };

    await TestBed.configureTestingModule({
      imports: [InventarioComponent, BrowserAnimationsModule],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: MatDialog, useValue: mockDialog }
      ],
    })
    .overrideProvider(MatDialog, { useValue: mockDialog })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate composition in openEditForm', () => {
    const p = {
      id: '1',
      name: 'P',
      type: 'ELABORADO',
      unit: { name: 'U' },
      stock: 10,
      minStock: 1,
      composition: [{ inventoryId: '2', quantity: 5 }]
    };

    component.openEditForm(p as any);
    expect(component.componentsFormArray.length).toBe(1);
    expect(component.componentsFormArray.at(0).get('idInsumo')?.value).toBe('2');
  });

  it('should handle composition helpers', () => {
    component.openAddForm();
    component.addComponent();
    expect(component.componentsFormArray.length).toBe(1);
    component.removeComponent(0);
    expect(component.componentsFormArray.length).toBe(0);
  });
});
