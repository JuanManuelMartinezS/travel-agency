import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Partes reutilizables de la tabla
import { TableComponent } from 'src/app/modules/uikit/pages/table/table.component';
import { TableActionComponent } from 'src/app/modules/uikit/pages/table/components/table-action/table-action.component';
import { TableFooterComponent } from 'src/app/modules/uikit/pages/table/components/table-footer/table-footer.component';

// Modelo y servicios
import { SessionService } from '../../services/session-service.service';
import { Session } from '../../models/session.model';
import { TableFilterService } from 'src/app/modules/uikit/pages/table/services/table-filter.service';

@Component({
  selector: 'app-sessions-view',
  imports: [CommonModule, TableComponent, TableActionComponent, TableFooterComponent],
  templateUrl: './sessions-view.component.html',
  styleUrl: './sessions-view.component.css',
})
export class SessionsViewComponent implements OnInit {
  // Una señal para tener la lista total de sesiones
  allSessions = signal<Session[]>([]);

  // Variables para las páginas
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  // Las columnas de la tabla adaptadas para sesiones
  columns = [
    { key: 'select', label: '', width: '50px' },
    { key: '_id', label: 'Id', width: '300px' },
    { key: 'token', label: 'Token', width: '300px' },
    { key: 'expiration', label: 'Expiration', width: '300px' },
    { key: 'code2FA', label: '2FA Code', width: '300px' },
    { key: 'user.name', label: 'User Name', width: '300px' }, // Mostrar el nombre del usuario
    { key: 'user.email', label: 'User Email', width: '300px' }, // Mostrar el email del usuario
    { key: 'actions', label: '', width: '50px' },
  ];

  constructor(private sessionService: SessionService, private filterService: TableFilterService) {}

  ngOnInit(): void {
    // Llamamos la lista de sesiones cuando el componente se inicializa
    this.sessionService.list().subscribe({
      next: (data) => {
        this.allSessions.set(data);
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
      },
    });
  }

  // Método para manejar el view
  onViewSession(session: Session) {
    console.log('Funcionó, la sesión:', session);
    // Implementar lógica de visualización
  }

  // Método para manejar el edit
  onEditSession(session: Session) {
    console.log('Funcionó, la sesión:', session);
    // Implementar lógica de edición
  }

  // Método para manejar evento de delete de la tabla
  onDeleteSession(session: Session) {
    console.log('Funcionó, la sesión:', session);
    if (confirm(`¿Está seguro de eliminar la sesión del usuario: ${session.user.name}?`)) {
      if (session._id) {
        this.sessionService.delete(session._id).subscribe({
          next: () => {
            console.log('Session deleted successfully');
            // Actualizar la lista local
            this.allSessions.update((currentSessions) => currentSessions.filter((s) => s._id !== session._id!));
          },
          error: (err) => console.error('Error deleting session', err),
        });
      }
    }
  }

  // Utilizar un computed signal para filtrar y paginar páginas
  filteredAndPaginatedSessions = computed(() => {
    // Obtener el término de búsqueda del servicio
    const searchTerm = this.filterService.searchField().toLowerCase();

    // Aplicar filtro completo a la lista de objetos
    const filtered = this.allSessions().filter(
      (session) =>
        !searchTerm ||
        session.token.toLowerCase().includes(searchTerm) ||
        session.expiration.toLowerCase().includes(searchTerm) ||
        session.code2FA.toLowerCase().includes(searchTerm) ||
        session.user?.name?.toLowerCase().includes(searchTerm) ||
        session.user?.email?.toLowerCase().includes(searchTerm),
    );

    // Aplicar paginación a la lista filtrada
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();

    console.log('Filtered', filtered);
    // Se devuelve un objeto con la lista paginada y el total de elementos filtrados
    return {
      paginated: filtered.slice(startIndex, endIndex),
      totalFiltered: filtered.length,
    };
  });

  // Método para cambiar de página
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // Método para cambiar la cantidad de elementos por página
  onItemsPerPageChange(perPage: number): void {
    this.itemsPerPage.set(perPage);
    this.currentPage.set(1);
  }

  // Para cuando se seleccionan todas las filas
  onToggleAllRows(checked: boolean): void {
    this.allSessions.update((sessions) => sessions.map((session) => ({ ...session, selected: checked })));
  }
}
