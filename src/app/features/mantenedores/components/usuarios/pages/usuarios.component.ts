import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';

import { SpinnerComponent } from '../../../../../shared/components/spinner/pages/spinner.component';
import { Usuario } from '../models/usuarios.model';
import { UsuarioService } from '../services/usuario.service';
import { passwordsMatchValidator } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Button,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    InputNumberModule,
    TooltipModule,
    CardModule,
    TextareaModule,
    SpinnerComponent,
    PasswordModule,
  ],
  providers: [MessageService, ConfirmationService],
  standalone: true,
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  modo: 'crear' | 'editar' = 'crear';
  idSeleccionado: number | null = null;
  usuarios: Usuario[] = [];
  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,10}$/,
          ),
        ],
      ],
      repeatPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordsMatchValidator],
    },
  );

  mensaje: string = '';
  loading: boolean = true;
  shorFormulario: boolean = false;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.usuarios = res.datos || [];
          this.loading = false;
          return;
        }

        if (res.idEstado === 1) {
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showFormulario(id?: number) {
    this.shorFormulario = true;
    if (id) {
      this.modo = 'editar';
      this.idSeleccionado = id;

      const usuario = this.usuarios.find((u) => u.id === id);

      if (usuario) {
        this.form.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          password: '',
          repeatPassword: '',
        });
      }

      this.form.get('password')?.clearValidators();
      this.form.get('repeatPassword')?.clearValidators();
    } else {
      this.modo = 'crear';
      this.idSeleccionado = null;
      this.form.reset();

      this.form
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,10}$/,
          ),
        ]);

      this.form.get('repeatPassword')?.setValidators([Validators.required]);
    }

    this.form.get('password')?.updateValueAndValidity();
    this.form.get('repeatPassword')?.updateValueAndValidity();
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modo === 'crear') {
      this.crear();
    } else if (this.modo === 'editar' && this.idSeleccionado) {
      this.editar(this.idSeleccionado);
    }
  }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = {
      nombre: this.form.value.nombre || '',
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    this.usuarioService.post(payload as Partial<Usuario>).subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.form.reset();
          this.shorFormulario = false;
          this.cargarUsuarios();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Registro creado correctamente',
          });
        } else {
          this.loading = false;
          this.shorFormulario = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el registro',
          });
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.shorFormulario = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el registro',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  editar(id: number) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload: any = {
      nombre: this.form.value.nombre,
      email: this.form.value.email,
    };

    if (this.form.value.password) {
      payload.password = this.form.value.password;
    }

    this.usuarioService
      .patch(id, payload as Partial<Usuario>)
      .subscribe({
        next: (res) => {
          if (res.idEstado === 0) {
            this.form.reset();
            this.shorFormulario = false;
            this.cargarUsuarios();
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmado',
              detail: 'Registro editado correctamente',
            });
          } else {
            this.loading = false;
            this.shorFormulario = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al editar el registro',
            });
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.shorFormulario = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar el registro',
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  eliminar(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea eliminar el registro?',
      header: 'Atención',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this.loading = true;
        this.usuarioService.delete(id).subscribe({
          next: (res) => {
            if (res.idEstado === 0) {
              this.loading = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Registro eliminado correctamente',
              });
              this.cargarUsuarios();
            } else {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el registro',
              });
            }
          },
          error: (err: any) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el registro',
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
      },
      reject: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Operación cancelada',
        });
      },
    });
  }

  onClose() {
    this.form.reset();
    this.modo = 'crear';
    this.idSeleccionado = null;
  }
}
