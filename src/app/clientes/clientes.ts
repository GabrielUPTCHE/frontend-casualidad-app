import { ListHelper } from '../shared/utils/list-helper';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PaginationComponent } from '../shared/pagination/pagination';
import { ClientDTO } from '../core/models/client.dto';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
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

  currentSort = { column: '', direction: 'asc' as 'asc' | 'desc' };

  // Modals state
  showDeleteModal = false;
  showProductsModal = false;
  selectedClient: ClientDTO | null = null;

  // Forms state
  viewMode: 'list' | 'add' | 'edit' = 'list';
  clientForm: FormGroup;
  showFormSuccessModal = false;

  private readonly fb = inject(FormBuilder);

  constructor() {
    this.clientForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      phones: this.fb.array([this.fb.control('', Validators.required)]),
      address: [''],
      isActive: [true]
    });
  }

  get phonesFormArray(): FormArray {
    return this.clientForm.get('phones') as FormArray;
  }

  addPhoneField() {
    this.phonesFormArray.push(this.fb.control(''));
  }

  removePhoneField(index: number) {
    if (this.phonesFormArray.length > 1) {
      this.phonesFormArray.removeAt(index);
    }
  }

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

    // Sort
    ListHelper.sortArray(this.filteredClients, this.currentSort as any);

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

  handleSort(column: string) {
    ListHelper.handleSort(this.currentSort as any, column);
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    return ListHelper.getSortIcon(this.currentSort as any, column);
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

  // --- FORM ACTIONS ---
  openAddForm() {
    this.clientForm.reset({ isActive: true });
    this.phonesFormArray.clear();
    this.phonesFormArray.push(this.fb.control('', Validators.required));
    this.viewMode = 'add';
  }

  openEditForm(client: ClientDTO) {
    this.clientForm.patchValue({
      id: client.id,
      name: client.name,
      address: client.address,
      isActive: client.isActive
    });

    this.phonesFormArray.clear();
    if (client.phones && client.phones.length > 0) {
      client.phones.forEach(p => this.phonesFormArray.push(this.fb.control(p, Validators.required)));
    } else {
      this.phonesFormArray.push(this.fb.control('', Validators.required));
    }

    this.viewMode = 'edit';
  }

  closeForm() {
    this.viewMode = 'list';
  }

  saveClient() {
    if (this.clientForm.valid) {
      this.showFormSuccessModal = true;
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  closeFormSuccessModal(goToList: boolean) {
    this.showFormSuccessModal = false;
    if (goToList) {
      this.viewMode = 'list';
    } else if (this.viewMode === 'add') {
      this.openAddForm();
    }
  }
}
