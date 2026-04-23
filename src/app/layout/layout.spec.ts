import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { jest } from '@jest/globals';
import { LayoutComponent } from './layout';
import { ActivatedRoute } from '@angular/router';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Mock whatever is needed from ActivatedRoute
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle dropdowns and modals', () => {
    const mockEvent = new Event('click');
    
    component.toggleProfileDropdown(mockEvent);
    expect(component.showProfileDropdown).toBe(true);
    
    component.closeProfileDropdown();
    expect(component.showProfileDropdown).toBe(false);

    component.openConfigModal(mockEvent);
    expect(component.showConfigModal).toBe(true);

    component.closeConfigModal();
    expect(component.showConfigModal).toBe(false);

    component.openDeleteModal(mockEvent);
    expect(component.showDeleteModal).toBe(true);
    
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.confirmDelete();
    expect(component.showDeleteModal).toBe(false);
  });
  
  it('should handle document click', () => {
    component.showProfileDropdown = true;
    component.onDocumentClick(new Event('click'));
    expect(component.showProfileDropdown).toBe(false);
  });
});
