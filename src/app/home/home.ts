import { Component, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardDTO } from '../core/models/dashboard.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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
      months: [],
      profit: [],
      expense: []
    },
    lowStockCount: 0
  };

  constructor() {
    Chart.register(...registerables);
  }



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.chartCanvas) {
        this.initChart();
    }
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
                    label: 'Ingresos',
                    data: this.dashboardData.profitVsExpense.profit,
                    backgroundColor: '#fd8e4a',
                    borderColor: '#974300',
                    borderWidth: 0.5,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Gastos',
                    data: this.dashboardData.profitVsExpense.expense,
                    backgroundColor: 'rgba(45,47,47,0.22)',
                    borderColor: 'rgba(45,47,47,0.35)',
                    borderWidth: 0.5,
                    borderRadius: 6,
                    borderSkipped: false,
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
                        font: { family: "'Manrope', sans-serif", size: 10, weight: 'bold' },
                        color: '#acadad'
                    }
                },
                y: {
                    grid: { color: 'rgba(172,173,173,0.2)', lineWidth: 0.5 },
                    border: { dash: [4, 4], display: false },
                    ticks: {
                        font: { family: "'Manrope', sans-serif", size: 10, weight: 'bold' },
                        color: '#acadad'
                    },
                    beginAtZero: true
                }
            }
        }
    });
  }
}
