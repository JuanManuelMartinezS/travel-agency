import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common'; // Asegúrate de importar esto


@Component({
  selector: '[app-table-header]',
  imports: [AngularSvgIconModule, CommonModule],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css',
})
export class TableHeaderComponent {
  // Recibir array con nombres de las columnas
  @Input() columns: string[] = [];

  // Emite el evento de selección al padre
  @Output() onCheck = new EventEmitter<boolean>();

  public toggle(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.onCheck.emit(value);
  }
}
