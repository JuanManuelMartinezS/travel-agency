import { Component, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent, TableAction } from './components/table-row/table-row.component';
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

  // Recibir las acciones dinamicas
  @Input() actions: TableAction[] = [];

  // Emite un evento cuando se interactue con la tabla para la componente padre
  @Output() toggleAllRows = new EventEmitter<boolean>();

  // Emite un evento cuando se interactue con los botones del row
  @Output() actionClicked = new EventEmitter<{ action: string; item: any }>();

  public toggleUsers(checked: boolean) {
    this.toggleAllRows.emit(checked);
  }

  public onRowAction(event: { action: string; item: any }) {
    this.actionClicked.emit(event);
  }

}
