import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InformeFiltros } from '../../services/informes.service';

interface ReoDropdownOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-informes-filtros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './informes-filtros.component.html',
  styleUrls: ['./informes-filtros.component.scss']
})
export class InformesFiltrosComponent implements OnChanges {
  @Input() reos: ReoDropdownOption[] = [];
  @Input() loadingReos = false;
  @Input() filtrosIniciales: InformeFiltros | null = null;

  @Output() filtrar = new EventEmitter<InformeFiltros>();
  @Output() limpiar = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      reoId: [null],
      fechaDesde: [null],
      fechaHasta: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtrosIniciales'] && this.filtrosIniciales) {
      this.form.patchValue({
        reoId: this.filtrosIniciales.reoId ?? null,
        fechaDesde: this.filtrosIniciales.fechaDesde ?? null,
        fechaHasta: this.filtrosIniciales.fechaHasta ?? null
      }, { emitEvent: false });
    }
  }

  onSubmit(): void {
    this.filtrar.emit({
      reoId: this.form.value.reoId ?? null,
      fechaDesde: this.form.value.fechaDesde ?? null,
      fechaHasta: this.form.value.fechaHasta ?? null
    });
  }

  onLimpiar(): void {
    this.form.reset({
      reoId: null,
      fechaDesde: null,
      fechaHasta: null
    });

    this.limpiar.emit();
  }
}