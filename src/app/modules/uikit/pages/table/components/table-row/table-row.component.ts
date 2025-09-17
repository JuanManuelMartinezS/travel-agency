import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() item: any = {};  // Cualquier entidad
  @Input() columns: { key: string, label: string, width?: string }[] = []; // Las columnas con sus cosas definidas

  // Emitir el evento
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();


  onDeleteClick(): void {
    // Se emite el item que el usuario quiere eliminar
    this.delete.emit(this.item);
  }

  onViewClick(): void {
    this.view.emit(this.item);
  }

  onEditClick(): void {
    this.view.emit(this.item);
  }
  
  constructor() {}
}
