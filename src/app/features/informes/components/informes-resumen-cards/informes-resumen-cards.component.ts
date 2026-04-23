import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-informes-resumen-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes-resumen-cards.component.html',
  styleUrl: './informes-resumen-cards.component.scss',
})
export class InformesResumenCardsComponent {
  @Input() resumenGeneral: any;
}