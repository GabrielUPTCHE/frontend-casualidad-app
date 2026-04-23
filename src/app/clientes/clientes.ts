import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../shared/pagination/pagination';
import { ClientDTO } from '../core/models/client.dto';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientsData: ClientDTO[] = [];

  filteredClients: ClientDTO[] = [];
  paginatedClients: ClientDTO[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 3;

  // Modals state
  showDeleteModal = false;
  showProductsModal = false;
  selectedClient: ClientDTO | null = null;

  ngOnInit() {
    this.applyFilters();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  private applyFilters() {
    // 1. Filter
    if (this.searchTerm.trim() === '') {
      this.filteredClients = [...this.clientsData];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clientsData.filter(client => 
        client.name.toLowerCase().includes(term) || client.id.toLowerCase().includes(term)
      );
    }

    // 2. Paginate
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClients = this.filteredClients.slice(start, end);

    // Failsafe
    if (this.paginatedClients.length === 0 && this.currentPage > 1) {
        this.currentPage = 1;
        this.applyFilters();
    }
  }

  openProductsModal(client: ClientDTO) {
    this.selectedClient = client;
    this.showProductsModal = true;
  }

  closeProductsModal() {
    this.showProductsModal = false;
    this.selectedClient = null;
  }

  openDeleteModal(client: ClientDTO) {
    if (client.ordersSummary.total > 0) return; // Preventative check
    this.selectedClient = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedClient = null;
  }

  confirmDelete() {
    if (this.selectedClient) {
      this.clientsData = this.clientsData.filter(c => c.id !== this.selectedClient!.id);
      this.applyFilters();
      this.closeDeleteModal();
    }
  }
}
