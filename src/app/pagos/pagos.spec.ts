import { PaymentService } from '../core/services/payment.service';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagosComponent } from './pagos';
import { jest } from '@jest/globals';

const mockPayment = {
  id: '1', idPedido: 1, orderId: 'P001', clientName: 'Alpha',
  amount: 100, type: 'CASH', status: 'PENDING',
  createdAt: '2026-01-01', voucherUrl: null,
  registeredBy: { id: '1', name: 'Admin' }, exceptionalAuth: false
} as any;

describe('PagosComponent', () => {
  let component: PagosComponent;
  let fixture: ComponentFixture<PagosComponent>;
  let mockPaymentService: any;

  beforeEach(async () => {
    mockPaymentService = {
      getSaldosPendientes: jest.fn(() => of({ data: { content: [mockPayment] } })),
      registrarAbono: jest.fn(() => of({ id: 1 })),
      getHistorialPagos: jest.fn(() => of({ data: { content: [] } })),
      getPayments: jest.fn(() => of({
        pageNumber: 1,
        pageSize: 5,
        totalElements: 1,
        totalPages: 1,
        data: []
      })),
      eliminarAbono: jest.fn(() => of({}))
    };

    await TestBed.configureTestingModule({
      providers: [{ provide: PaymentService, useValue: mockPaymentService }],
      imports: [PagosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should compute totalMonthlyBalance correctly', () => {
    component.paymentsListed = [
      { ...mockPayment, monto: 100, estadoPedido: 'PENDIENTE' },
      { ...mockPayment, monto: 50,  estadoPedido: 'TERMINADO' },
      { ...mockPayment, monto: 20,  estadoPedido: 'CANCELADO' },
      { ...mockPayment, monto: 20,  estadoPedido: 'EN_PRODUCCION' }


    ];
    expect(component.totalMonthlyBalance).toBe(100);
  });

  it('should handle sorting all directions', () => {
    component.handleSort('amount');
    expect(component.currentSort.direction).toBe('asc');
    component.handleSort('amount');
    expect(component.currentSort.direction).toBe('desc');
    component.handleSort('clientName');
    expect(component.currentSort.column).toBe('clientName');
    expect(component.currentSort.direction).toBe('asc');
  });

 /*  it('should handle applyFilters branches', () => {
    component.paymentsData = [
      { ...mockPayment, clientName: 'Alpha', status: 'TERMINADO', orderId: 'P1' },
      { ...mockPayment, clientName: 'Beta',  status: 'PENDIENTE',   orderId: 'P2' }
    ];

    // 1. All filter
    component.currentFilter = 'ALL';
    component.searchTerm = 'beta';
    component.applyFilters();
    expect(component.paymentsListed.length).toBe(1);

    // 2. Status filter
    component.currentFilter = 'TERMINADO';
    component.searchTerm = '';
    component.applyFilters();
    expect(component.paymentsListed.length).toBe(1);
    expect(component.paymentsListed[0].nombreCliente).toBe('Alpha');
  }); */

  it('should handle savePayment branches', () => {
    // 1. Invalid form
    component.openAddForm();
    component.paymentForm.get('amount')?.setValue(null);
    component.savePayment();
    expect(mockPaymentService.registrarAbono).not.toHaveBeenCalled();

    // 2. Success with reference
    component.paymentForm.patchValue({ idPedido: 1, amount: 50, type: 'TRANSFERENCIA', referenciaComprobante: 'REF123' });
    component.savePayment();
    expect(mockPaymentService.registrarAbono).toHaveBeenCalled();
    expect(component.showFormSuccessModal).toBe(true);

    // 3. Error case
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockPaymentService.registrarAbono.mockReturnValueOnce(throwError(() => new Error('Err')));
    component.savePayment();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should handle closeFormSuccessModal branches', () => {
    component.showFormSuccessModal = true;
    component.viewMode = 'add';

    // 1. goToList = true
    component.closeFormSuccessModal(true);
    expect(component.showFormSuccessModal).toBe(false);
    expect(component.viewMode).toBe('list');

    // 2. goToList = false, viewMode = add
    component.showFormSuccessModal = true;
    component.viewMode = 'add';
    component.closeFormSuccessModal(false);
    expect(component.viewMode).toBe('add');
    // It should have reset form (triggered openAddForm)
  });

  it('should handle mapPaymentType branches', () => {
    expect((component as any).mapPaymentType('CASH')).toBe('EFECTIVO');
    expect((component as any).mapPaymentType('TRANSFER')).toBe('TRANSFERENCIA');
    expect((component as any).mapPaymentType('OTHER')).toBe('OTHER');
  });

  it('should handle delete confirmation', () => {
    component.openDeleteModal(mockPayment);
    expect(component.showDeleteModal).toBe(true);
    component.confirmDelete();
    expect(component.showSuccessModal).toBe(true);
    component.closeSuccessModal();
    expect(component.showSuccessModal).toBe(false);
  });

 /*  it('should handle pagination edge cases', () => {
    component.paymentsData = Array(12).fill(mockPayment);
    component.pageSize = 5;
    component.applyFilters();
    expect(component.paginatedPayments.length).toBe(5);
    component.onPageChange(3); // Last page (2 items)
    expect(component.paginatedPayments.length).toBe(2);
  }); */

  it('should handle view modal lifecycle', () => {
    component.openViewModal(mockPayment);
    expect(component.showViewModal).toBe(true);
    component.closeViewModal();
    expect(component.showViewModal).toBe(false);
  });
});
