import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';

export interface TableAction {
  label: string;
  action: 'view' | 'edit' | 'delete' | 'custom' | 'permissions';
}

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() title: string = ''; // Titulo
  @Input() item: any = {}; // Cualquier entidad
  @Input() columns: { key: string; label: string; width?: string }[] = []; // Las columnas con sus cosas definidas

  // Nuevo input para los botones dinamicos
  @Input() actions: TableAction[] = [];

  // Emitir el evento
  @Output() actionClicked = new EventEmitter<{ action: string; item: any }>();

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

  onActionClick(actionType: string): void {
    this.actionClicked.emit({ action: actionType, item: this.item });
    this.showActionsMenu = false; // Cerrar menu despues de interración
  }

  // Función para obtener valores anidados de un objeto usando una ruta de claves (ej: 'user.name')
  getNestedValue(obj: any, path: string): any {
    if (!obj || !path) {
      return null;
    }
    return path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : null), obj);
  }
  constructor() {}
}
