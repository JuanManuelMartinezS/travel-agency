import { Component, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableRowComponent,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  // Recibir la data para ser mostrada
  @Input({ required: true }) data: any[] = [];

  // Recibir los headers de las columnas
  @Input({required: true}) columns: { key: string, label: string, width?: string}[] = [];

  // Recibir el titulo de tabla
  @Input() title: string = '';

  // Emite un evento cuando se interactue con la tabla para la componente padre
  @Output() toggleAllRows = new EventEmitter<boolean>();

  // La acción de delete
  @Output() deleteRow = new EventEmitter<any>();
  @Output() viewRow = new EventEmitter<any>();
  @Output() editRow = new EventEmitter<any>();

  public toggleUsers(checked: boolean) {
    this.toggleAllRows.emit(checked);
  }
}
