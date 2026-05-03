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
      getHistorialPagos: jest.fn(() => of({ data: { content: [] } }))
    };

    await TestBed.configureTestingModule({
      providers: [{ provide: PaymentService, useValue: mockPaymentService }],
      imports: [PagosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should load data on init', () => {
    expect(mockPaymentService.getSaldosPendientes).toHaveBeenCalled();
    // In pagos.ts, data is mapped from content
  });

  it('should compute totalMonthlyBalance correctly', () => {
    component.paymentsData = [
      { ...mockPayment, amount: 100, status: 'PENDING' },
      { ...mockPayment, amount: 50,  status: 'COMPLETED' }
    ];
    expect(component.totalMonthlyBalance).toBe(100);
  });

  it('should save payment successfully', () => {
    component.openAddForm();
    component.paymentForm.patchValue({ idPedido: 1, amount: 50, type: 'EFECTIVO' });
    component.savePayment();
    expect(mockPaymentService.registrarAbono).toHaveBeenCalled();
    expect(component.showFormSuccessModal).toBeTruthy();
  });

  it('should handle error when saving payment', () => {
    mockPaymentService.registrarAbono.mockReturnValueOnce(throwError(() => new Error('Err')));
    component.openAddForm();
    component.paymentForm.patchValue({ idPedido: 1, amount: 50, type: 'EFECTIVO' });
    component.savePayment();
    expect(mockPaymentService.registrarAbono).toHaveBeenCalled();
  });

  it('should handle sorting', () => {
    component.handleSort('amount');
    expect(component.currentSort.column).toBe('amount');
    component.handleSort('amount');
    expect(component.currentSort.direction).toBe('desc');
  });

  it('should filter payments by search and status', () => {
    component.paymentsData = [
      { ...mockPayment, id: '1', status: 'COMPLETED', clientName: 'Alpha' },
      { ...mockPayment, id: '2', status: 'PENDING',   clientName: 'Beta' }
    ];
    component.searchTerm = 'beta';
    component.currentFilter = 'PENDING';
    component.applyFilters();
    expect(component.filteredPayments.length).toBe(1);
    expect(component.filteredPayments[0].clientName).toBe('Beta');
  });

  it('should handle pagination', () => {
    component.paymentsData = Array(10).fill(0).map((_, i) => ({ ...mockPayment, id: String(i) }));
    component.pageSize = 5;
    component.applyFilters();
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginatedPayments.length).toBe(5);
  });

  it('should open view and delete modals', () => {
    component.openViewModal(mockPayment);
    expect(component.showViewModal).toBeTruthy();
    component.closeViewModal();
    expect(component.showViewModal).toBeFalsy();
    
    component.openDeleteModal(mockPayment);
    expect(component.showDeleteModal).toBeTruthy();
    component.confirmDelete();
    expect(component.showSuccessModal).toBeTruthy();
  });

  it('should close form success modal and navigate', () => {
    component.viewMode = 'add';
    component.closeFormSuccessModal(true);
    expect(component.viewMode).toBe('list');
    
    component.viewMode = 'add';
    component.closeFormSuccessModal(false);
    expect(component.viewMode).toBe('add');
  });
});
