import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserDTO } from '../core/models/auth.dto';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  showProfileDropdown = false;
  showConfigModal = false;
  showDeleteModal = false;

  currentUser: UserDTO = {
    id: 'admin',
    firstName: 'Administrador',
    lastName: '',
    email: 'admin@casualidad.com',
    phone: ''
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.closeProfileDropdown();
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  openConfigModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showConfigModal = true;
    this.showProfileDropdown = false;
  }

  closeConfigModal() {
    this.showConfigModal = false;
  }

  openDeleteModal(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showDeleteModal = true;
    this.showConfigModal = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    console.log('Usuario eliminado permanentemente');
    alert('Usuario eliminado correctamente');
    this.closeDeleteModal();
  }
}
