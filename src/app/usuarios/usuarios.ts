import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../shared/pagination/pagination';

import { UserDTO } from '../core/models/auth.dto';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usersData: UserDTO[] = [];

  filteredUsers: UserDTO[] = [];
  paginatedUsers: UserDTO[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 3;

  // Modals state
  showDeleteModal = false;
  showSuccessModal = false;
  userToDelete: UserDTO | null = null;

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
      this.filteredUsers = [...this.usersData];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.usersData.filter(user => 
        user.firstName.toLowerCase().includes(term) || 
        user.lastName.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }

    // 2. Paginate
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);

    // Failsafe if we are on a page that doesn't exist anymore after filtering
    if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage = 1;
        this.applyFilters();
    }
  }

  openDeleteModal(user: UserDTO) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.usersData = this.usersData.filter(u => u.id !== this.userToDelete!.id);
      this.applyFilters();
      this.closeDeleteModal();
      this.showSuccessModal = true;
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
