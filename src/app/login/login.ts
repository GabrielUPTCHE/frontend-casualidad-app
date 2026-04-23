import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponseDTO } from '../core/models/auth.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  // Estado de UI
  showHelpModal = false;
  showErrorModal = false;
  isLoading = false;

  // Credenciales simuladas (del prototipo)
  private readonly VALID_EMAIL = 'admin@casualidad.com';
  private readonly VALID_PASSWORD = 'admin123';

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      this.isLoading = true;
      // Simulando delay de red y respuesta de la API
      setTimeout(() => {
        const simulatedResponse: LoginResponseDTO = {
            access_token: 'fake-jwt-token',
            refresh_token: 'fake-refresh-token',
            user: {
                id: 'admin-uuid',
                firstName: 'Administrador',
                lastName: '',
                email: this.VALID_EMAIL,
                phone: '0000000000'
            }
        };
        console.log('Login exitoso:', simulatedResponse);
        this.router.navigate(['/']);
        this.isLoading = false;
      }, 800);
    } else {
      this.showErrorModal = true;
      this.loginForm.reset({ email: '', password: '', remember: false });
    }
  }

  toggleHelpModal() {
    this.showHelpModal = !this.showHelpModal;
    document.body.style.overflow = this.showHelpModal ? 'hidden' : '';
  }

  closeErrorModal() {
    this.showErrorModal = false;
    document.body.style.overflow = '';
  }
}
