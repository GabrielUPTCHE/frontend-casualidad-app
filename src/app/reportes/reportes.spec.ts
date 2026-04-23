import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesComponent } from './reportes';

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate cashPercentage correctly', () => {
    component.incomeReport.totalIncome = 1000;
    component.incomeReport.cashTotal = 250;
    expect(component.cashPercentage).toBe(25);
    
    component.incomeReport.totalIncome = 0;
    expect(component.cashPercentage).toBe(0);
  });

  it('should calculate transferPercentage correctly', () => {
    component.incomeReport.totalIncome = 1000;
    component.incomeReport.transferTotal = 750;
    expect(component.transferPercentage).toBe(75);
    
    component.incomeReport.totalIncome = 0;
    expect(component.transferPercentage).toBe(0);
  });

  it('should handle onPageChange properly', () => {
    component.pendingBalances = [
      { orderId: '1', orderCode: '001', clientName: 'C1', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
      { orderId: '2', orderCode: '002', clientName: 'C2', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
      { orderId: '3', orderCode: '003', clientName: 'C3', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
      { orderId: '4', orderCode: '004', clientName: 'C4', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
      { orderId: '5', orderCode: '005', clientName: 'C5', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
      { orderId: '6', orderCode: '006', clientName: 'C6', deliveryDate: '2026', totalAmount: 100, pendingBalance: 50, daysUntilDelivery: 1 },
    ];
    component.pageSize = 5;
    
    component.onPageChange(1);
    expect(component.paginatedPendingBalances.length).toBe(5);
    expect(component.paginatedPendingBalances[0].orderId).toBe('1');
    
    component.onPageChange(2);
    expect(component.paginatedPendingBalances.length).toBe(1);
    expect(component.paginatedPendingBalances[0].orderId).toBe('6');
  });

  it('should reset pagination on date change', () => {
    component.currentPage = 3;
    component.onDateChange();
    expect(component.currentPage).toBe(1);
  });

  it('should return correct rank color class', () => {
    expect(component.getRankColorClass(1)).toBe('bg-primary text-on-primary');
    expect(component.getRankColorClass(2)).toBe('bg-secondary text-on-secondary');
    expect(component.getRankColorClass(3)).toBe('bg-tertiary-fixed-dim text-on-tertiary');
    expect(component.getRankColorClass(4)).toBe('bg-neutral-200 text-neutral-600');
  });

  it('should return correct rank progress class', () => {
    expect(component.getRankProgressClass(1)).toBe('bg-primary');
    expect(component.getRankProgressClass(2)).toBe('bg-secondary');
    expect(component.getRankProgressClass(3)).toBe('bg-tertiary-fixed-dim');
    expect(component.getRankProgressClass(4)).toBe('bg-neutral-300');
  });
});
