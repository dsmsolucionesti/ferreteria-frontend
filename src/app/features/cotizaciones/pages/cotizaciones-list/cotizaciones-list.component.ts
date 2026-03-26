import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
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
import { EstadoCotizacion } from '../../cotizaciones.enum';
import { CotizacionesFormComponent } from "../cotizaciones-form/cotizaciones-form.component";
import { RouterLink } from "@angular/router";

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
    InputNumber,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    SpinnerComponent,
    TagModule,
    TableModule,
    TextareaModule,
    ToastModule,
    TooltipModule,
    CotizacionesFormComponent,
    RouterLink
],
  providers: [MessageService, ConfirmationService],
  standalone: true,
})
export class CotizacionesListComponent implements OnInit {
  private cotizacionService = inject(CotizacionesService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

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
  }

  cargarCotizaciones() {
    this.cotizacionService.findAll().subscribe({
      next: (res) => {
        if (res.idEstado === 0) {
          this.cotizaciones = res.datos || [];
        }
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones:', err);
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
