import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [
    ButtonModule,
    DividerModule,
    InputTextModule,
    Button,
    ReactiveFormsModule,
  ],
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;

  ngOnInit(): void {
    if (this.authService.estaLogueado()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (resp) => {
        this.authService.guardarToken(resp.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Login correcto',
          detail: 'Bienvenido 👋',
        });

        this.router.navigate(['/home']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
