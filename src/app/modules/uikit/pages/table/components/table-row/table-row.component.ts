import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
  @Input() title: string = ''; // Titulo 
  @Input() item: any = {};  // Cualquier entidad
  @Input() columns: { key: string, label: string, width?: string }[] = []; // Las columnas con sus cosas definidas

  // Emitir el evento
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();


  // Control booleano para la visibilidad del menu de acciones
  showActionsMenu = false;

  // Escuchar por clicks fuera del menu para cerrarlo
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-actions-menu]')) {
      this.showActionsMenu = false;
    }
  }

  // Metodo para alternar la visibilidad del menu de acciones
  toggleActionsMenu(event: Event): void {
    event?.stopPropagation(); // Prevenir que el click se propague y cierre el menu inmediatamente
    this.showActionsMenu = !this.showActionsMenu;
  }

  onDeleteClick(): void {
    // Se emite el item que el usuario quiere eliminar
    this.delete.emit(this.item);
    this.showActionsMenu = false; // Cerrar menu despues de interración
  }

  onViewClick(): void {
    this.view.emit(this.item);
    this.showActionsMenu = false;
  }

  onEditClick(): void {
    this.view.emit(this.item);
    this.showActionsMenu = false;
  }
  
  constructor() {}
}
