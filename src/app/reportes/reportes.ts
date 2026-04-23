import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../shared/pagination/pagination';
import { IncomeReportDTO, PendingBalanceDTO, TopProductDTO } from '../core/models/report.dto';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent implements OnInit {
  // Estado Limpio (Clean UI)
  incomeReport: IncomeReportDTO = {
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    totalIncome: 0,
    cashTotal: 0,
    transferTotal: 0,
    breakdown: []
  };

  pendingBalances: PendingBalanceDTO[] = [];
  paginatedPendingBalances: PendingBalanceDTO[] = [];
  
  topProducts: TopProductDTO[] = [];

  // Paginación para tabla de saldos
  currentPage = 1;
  pageSize = 5;

  ngOnInit() {
    this.updatePaginatedBalances();
  }

  // Helper para el porcentaje de métodos de pago
  get cashPercentage(): number {
    if (this.incomeReport.totalIncome === 0) return 0;
    return (this.incomeReport.cashTotal / this.incomeReport.totalIncome) * 100;
  }

  get transferPercentage(): number {
    if (this.incomeReport.totalIncome === 0) return 0;
    return (this.incomeReport.transferTotal / this.incomeReport.totalIncome) * 100;
  }

  // Paginación
  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedBalances();
  }

  private updatePaginatedBalances() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPendingBalances = this.pendingBalances.slice(start, end);
  }

  // Simulación de actualización al cambiar fechas
  onDateChange() {
    // Aquí se llamaría al servicio HTTP para traer los nuevos datos según el rango de fechas.
    // Por ahora, solo reiniciamos la paginación.
    this.currentPage = 1;
    this.updatePaginatedBalances();
  }

  // Ranking colors
  getRankColorClass(rank: number): string {
    switch (rank) {
      case 1: return 'bg-primary text-on-primary';
      case 2: return 'bg-secondary text-on-secondary';
      case 3: return 'bg-tertiary-fixed-dim text-on-tertiary';
      default: return 'bg-neutral-200 text-neutral-600';
    }
  }

  getRankProgressClass(rank: number): string {
    switch (rank) {
      case 1: return 'bg-primary';
      case 2: return 'bg-secondary';
      case 3: return 'bg-tertiary-fixed-dim';
      default: return 'bg-neutral-300';
    }
  }
}
