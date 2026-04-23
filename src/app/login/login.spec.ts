import { ComponentFixture, TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';
import { LoginComponent } from './login';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle login logic', () => {
    jest.useFakeTimers();
    component.loginForm.controls['email'].setValue('admin@casualidad.com');
    component.loginForm.controls['password'].setValue('admin123');
    
    component.onSubmit();
    
    expect(component.isLoading).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.isLoading).toBe(false);
    jest.useRealTimers();
  });

  it('should show error on bad login', () => {
    component.loginForm.controls['email'].setValue('bad@bad.com');
    component.loginForm.controls['password'].setValue('bad');
    
    component.onSubmit();
    
    expect(component.showErrorModal).toBe(true);
    
    component.closeErrorModal();
    expect(component.showErrorModal).toBe(false);
  });

  it('should toggle help modal', () => {
    component.toggleHelpModal();
    expect(component.showHelpModal).toBe(true);
  });
});
