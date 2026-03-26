import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { SpinnerComponent } from '../../../../shared/components/spinner/pages/spinner.component';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { Cotizaciones } from '../../models/cotizaciones.model';
import { Router, RouterLink } from '@angular/router';
import { ClpPipe } from '../../../../shared/pipes/moneda.pipe';

@Component({
  selector: 'app-cotizaciones-list',
  templateUrl: './cotizaciones-list.component.html',
  styleUrls: ['./cotizaciones-list.component.scss'],
  imports: [
    Button,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    SpinnerComponent,
    TagModule,
    TableModule,
    TextareaModule,
    ToastModule,
    TooltipModule,
    RouterLink,
    ClpPipe,
  ],
  providers: [MessageService, ConfirmationService],
  standalone: true,
})
export class CotizacionesListComponent implements OnInit {
  private cotizacionService = inject(CotizacionesService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  cotizaciones: Cotizaciones[] = [];
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  mensaje: string = '';
  loading: boolean = false;
  loadingMessage: string = '';
  shorFormulario: boolean = false;
  showForm: boolean = false;

  ngOnInit(): void {
    this.cargarCotizaciones();

    const mensaje = history.state?.mensaje;

    if (mensaje) {
      this.messageService.add({
        severity: mensaje.severity,
        summary: mensaje.summary,
        detail: mensaje.detail,
      });
    }
  }

  cargarCotizaciones() {
    this.loading = true;
    this.cotizacionService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.cotizaciones = res.datos || [];
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones:', err);
        this.loading = false;
      },
    });
  }

  getSeverity(estado: string) {
    switch (estado) {
      case 'ENVIADA':
        return 'info';
      case 'ACEPTADA':
        return 'success';
      case 'RECHAZADA':
        return 'danger';
      case 'VENCIDA':
        return 'warn';
      case 'CANCELADA':
        return 'contrast';
      default:
        return 'secondary';
    }
  }
}
