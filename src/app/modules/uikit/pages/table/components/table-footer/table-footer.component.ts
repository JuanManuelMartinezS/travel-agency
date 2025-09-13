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

  // Metodo para manejar el evento de cambio de pagina
  goToPage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages()) {
      this.pageChange.emit(pageNumber);
    }
  }

  // Calcular el numero total de paginas
  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Calcular el rango de los items mostrados
  get currentRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end} of ${this.totalItems}`
  }
}
