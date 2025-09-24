import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableFilterService {
  // Signal para el termino de busqueda
  searchField = signal<string>('');

  // Estas señales son para los otros filtros (Falta mirar si lo ponemos asi o que)
  statusField = signal<string>('');
  orderField = signal<string>('');

  constructor() {}

  // Metodo para actualizar el metodo de busqueda
  onSearchChange(searchItem: string): void {
    this.searchField.set(searchItem);
  }
}
