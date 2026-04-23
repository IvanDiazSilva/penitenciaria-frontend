import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-informes-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes-tabla.component.html',
  styleUrl: './informes-tabla.component.scss',
})
export class InformesTablaComponent {
  @Input() datos: { campo: string; valor: string | number }[] = [];
}