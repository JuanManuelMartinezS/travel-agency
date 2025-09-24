import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-footer',
  imports: [AngularSvgIconModule, CommonModule, FormsModule],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.css',
})
export class TableFooterComponent {
  // Inputs para recibir data del padre
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  // Outputs para notificar al padre de cambios
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();


  // Array para generar las opciones del select
  perPageOptions = [5, 10, 20, 30, 50];

  // Variables para la lógica interna
  totalPages: number = 0;

  ngOnChanges(): void {
    // Recalcula las páginas cuando cambian los inputs
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Método para cambiar de página
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
  // Método para cambiar la cantidad de elementos por página
  onItemsPerPageChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.itemsPerPageChange.emit(value);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getPages(): number[] {
    const pages: number[] = [];   // Muestra 1,2,3,...,n
    // Muestra siempre la primera página
    pages.push(1);
    
    // Muestra páginas alrededor de la actual si hay muchas
    if (this.totalPages > 1) {
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      if (this.currentPage > 3) {
        pages.push(0); // Representa "..."
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (this.currentPage < this.totalPages - 2) {
        pages.push(0); // Representa "..."
      }
      // Muestra siempre la última página si no es la primera
      if (this.totalPages !== 1) {
        pages.push(this.totalPages);
      }
    }
    return pages;
  }
}

