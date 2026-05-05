import { Component, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, inject, DestroyRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardDTO } from '../core/models/dashboard.dto';
import { PaymentService } from '../core/services/payment.service';
import { InventoryService } from '../core/services/inventory.service';
import { OrderService } from '../core/services/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('casualChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  chartInstance: Chart | undefined;

  dashboardData: DashboardDTO = {
    pendingOrders: 0,
    ordersWithDebt: 0,
    profitVsExpense: {
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      profit: [0, 0, 0, 0, 0, 0],
      expense: [0, 0, 0, 0, 0, 0]
    },
    lowStockCount: 0
  };

  private readonly paymentService = inject(PaymentService);
  private readonly inventoryService = inject(InventoryService);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  get dashboardCards() {
    return [
      {
        title: 'Ingresos de este Mes',
        value: this.totalProfit,
        isCurrency: true,
        icon: 'trending_up',
        iconClass: 'text-orange-600',
        trend: '14.5%',
        trendText: 'vs mes pasado',
        link: null
      },
      {
        title: 'Por Entregar',
        value: this.dashboardData.pendingOrders,
        isCurrency: false,
        icon: 'pending_actions',
        iconClass: 'text-blue-500',
        link: '/pedidos',
        footer: 'Pedidos en estado pendiente'
      },
      {
        title: 'Con Deuda',
        value: this.dashboardData.ordersWithDebt,
        isCurrency: false,
        icon: 'money_off',
        iconClass: 'text-orange-500',
        link: '/pedidos',
        footer: 'Requieren gestión de cobro'
      },
      {
        title: 'Stock Crítico',
        value: this.dashboardData.lowStockCount,
        isCurrency: false,
        icon: 'inventory_2',
        iconClass: 'text-red-500',
        link: '/inventario',
        footer: 'Insumos bajo el mínimo'
      }
    ];
  }

  constructor() {
    Chart.register(...registerables);
    this.loadData();
  }

  private loadData(): void {
    // 1. Fetch Saldos Pendientes & Debt Orders
    this.paymentService.getSaldosPendientes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.dashboardData.ordersWithDebt = res.cantidadPedidosPendientes || 0;
      }
    });

    // 2. Fetch Low Stock Count
    this.inventoryService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (products) => {
        this.dashboardData.lowStockCount = products.filter(p => p.isLowStock).length;
      }
    });

    // 3. Fetch Pending Orders
    this.orderService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (orders) => {
        this.dashboardData.pendingOrders = orders.filter(o => o.status === 'PENDIENTE').length;
      }
    });

    // 4. Fetch Income Data for Chart (Current Month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = now.toISOString().split('T')[0];
    
    this.paymentService.getReporteIngresos(firstDay, lastDay).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        // We only have one month's data from this call, so we'll put it in the last month index
        const monthIndex = 5; // June in our default labels
        this.dashboardData.profitVsExpense.profit[monthIndex] = res.totalGeneral || 0;
        this.dashboardData.profitVsExpense.expense[monthIndex] = (res.totalGeneral || 0) * 0.4; // Mock expense as 40%
        
        if (this.chartInstance) {
          this.chartInstance.data.datasets[0].data = this.dashboardData.profitVsExpense.profit;
          this.chartInstance.data.datasets[1].data = this.dashboardData.profitVsExpense.expense;
          this.chartInstance.update();
        }
      }
    });
  }



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.chartCanvas) {
      this.initChart();
    }
  }

  get totalProfit(): number {
    return this.dashboardData.profitVsExpense.profit.reduce((a, b) => a + b, 0);
  }

  get totalExpense(): number {
    return this.dashboardData.profitVsExpense.expense.reduce((a, b) => a + b, 0);
  }

  get netBalance(): number {
    return this.totalProfit - this.totalExpense;
  }

  private initChart(): void {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dashboardData.profitVsExpense.months,
        datasets: [
          {
            label: 'Ganancias',
            data: this.dashboardData.profitVsExpense.profit,
            backgroundColor: '#fd8e4a',
            borderColor: '#974300',
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          },
          {
            label: 'Gastos',
            data: this.dashboardData.profitVsExpense.expense,
            backgroundColor: '#d6d3d1',
            borderColor: '#a8a29e',
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' },
              color: '#a8a29e'
            },
            border: { display: false }
          },
          y: {
            grid: { color: '#f5f5f4', lineWidth: 1 },
            border: { display: false },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' },
              color: '#a8a29e',
              callback: function (value) {
                return '$' + (Number(value) / 1000) + 'k';
              }
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}
