import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosComponent } from './usuarios';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users and paginate', () => {
    component.usersData = [
      { id: '1', nombre: 'Alpha X', email: 'a@a.com', rol: 'ADMINISTRADOR' },
      { id: '2', nombre: 'Beta Y', email: 'b@b.com', rol: 'WORKER' }
    ];
    
    component.searchTerm = 'Alpha';
    component.onSearchChange();
    expect(component.filteredUsers.length).toBe(1);
  });

  it('should handle delete modal and confirm', () => {
    component.usersData = [
      { id: '1', nombre: 'Alpha X', email: 'a@a.com', rol: 'ADMINISTRADOR' }
    ];
    const u = component.usersData[0];
    component.openDeleteModal(u);
    expect(component.showDeleteModal).toBe(true);
    
    component.confirmDelete();
    expect(component.usersData.length).toBe(0);
    expect(component.showSuccessModal).toBe(true);
    
    component.closeSuccessModal();
    expect(component.showSuccessModal).toBe(false);
  });

  it('should handle form operations', () => {
    component.openAddForm();
    expect(component.viewMode).toBe('add');
    component.closeForm();
    expect(component.viewMode).toBe('list');

    component.openEditForm({ id: '1', nombre: 'A B', email: 'a@b', rol: 'ADMIN', lastLogin: '', status: 'ACTIVE' } as any);
    expect(component.viewMode).toBe('edit');

    Object.defineProperty(component.userForm, 'valid', {get: () => true});
    component.saveUser();
    expect(component.showFormSuccessModal).toBe(true);

    component.closeFormSuccessModal(true);
    expect(component.viewMode).toBe('list');
    
    component.viewMode = 'edit';
    component.showFormSuccessModal = true;
    component.closeFormSuccessModal(false);
    expect(component.viewMode).toBe('edit');
  });

});
