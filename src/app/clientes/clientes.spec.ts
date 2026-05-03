import { ClientService } from '../core/services/client.service';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesComponent } from './clientes';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jest } from '@jest/globals';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let mockClientService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockClientService = {
      getAll: jest.fn(() => of([])),
      delete: jest.fn(() => of({})),
      create: jest.fn(() => of({ id: 1 })),
      update: jest.fn(() => of({}))
    };

    mockDialog = {
      open: jest.fn(() => ({
        afterClosed: () => of({ action: 'primary' })
      }))
    };

    await TestBed.configureTestingModule({
      imports: [ClientesComponent, BrowserAnimationsModule],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: MatDialog, useValue: mockDialog }
      ],
    })
    .overrideProvider(MatDialog, { useValue: mockDialog })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should save client (create)', () => {
    component.openAddForm();
    component.clientForm.get('name')?.setValue('N');
    component.phonesFormArray.at(0).setValue('1');
    component.saveClient();
    expect(mockClientService.create).toHaveBeenCalled();
  });

  it('should save client (update)', () => {
    component.openEditForm({ idCliente: 1, nombre: 'A', telefonos: ['1'] } as any);
    component.clientForm.get('name')?.setValue('U');
    component.phonesFormArray.at(0).setValue('1');
    component.saveClient();
    expect(mockClientService.update).toHaveBeenCalled();
  });

  it('should handle error (create)', () => {
    mockClientService.create.mockReturnValueOnce(throwError(() => new Error()));
    component.openAddForm();
    component.clientForm.get('name')?.setValue('N');
    component.phonesFormArray.at(0).setValue('1');
    component.saveClient();
    expect(mockClientService.create).toHaveBeenCalled();
  });
});
