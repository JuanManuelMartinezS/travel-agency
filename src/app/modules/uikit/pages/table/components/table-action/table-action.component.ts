import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-table-action',
  imports: [AngularSvgIconModule, CommonModule, FormsModule],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.css',
})
export class TableActionComponent {
  // Recibe las opciones de los select y placeholders
  @Input() searchPlaceholder: string = '';
  @Input() statusOptions: { value: string; label: string}[] = [];
  @Input() orderOptions: { value: string; label: string}[] = [];

  // Emite los eventos de cambio
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() orderChange = new EventEmitter<string>();

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value)
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.statusChange.emit(value);
  }

  onOrderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.orderChange.emit(value);
  }
}
