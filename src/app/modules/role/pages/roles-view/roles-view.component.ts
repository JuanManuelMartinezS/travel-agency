import { Component, OnInit, signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Partes reutilizables de la tabla
import { TableComponent } from 'src/app/modules/uikit/pages/table/table.component';
import { TableActionComponent } from 'src/app/modules/uikit/pages/table/components/table-action/table-action.component';
import { TableFooterComponent } from 'src/app/modules/uikit/pages/table/components/table-footer/table-footer.component';

// Modelo y servicios
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { TableFilterService } from 'src/app/modules/uikit/pages/table/services/table-filter.service';

@Component({
  selector: 'app-roles-view',
  imports: [CommonModule, TableComponent, TableActionComponent, TableFooterComponent],
  templateUrl: './roles-view.component.html',
  styleUrl: './roles-view.component.css',
})
export class RolesViewComponent implements OnInit {
  // Una señal para tener la lista total de roles
  allRoles = signal<Role[]>([]);

  // Variables para las paginas
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  // Las columnas de la tabla
  columns = [
    {key: 'select', label: '', width: '50px'},
    {key: '_id', label: 'Id', width: '300px'},
    {key: 'name', label: 'Name', width: '300px'},
    {key: 'description', label: 'Description', width: '300px'},
    {key: 'actions', label: '', width: '50px'},
  ]; 

  constructor(
    private roleService: RoleService,
    private filterService: TableFilterService
  ) 
  {}

  ngOnInit(): void {
    // Llamamos la lista de roLes cuando el componente se inicializa
    this.roleService.list().subscribe({
      next: (data) => {
        this.allRoles.set(data);
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      },
    });
  }
  // Metodo para manejar el view
  onViewRole(role: Role) {
    console.log('Funciono, el rol:', role);

    // Implementar
  }

  // Metodo para manejar el edit
  onEditRole(role: Role) {
    console.log('Funciono, el rol:', role);
    // Implementar también con el create
  }

  // Metodo para manejar evento de delete de la tabla
  onDeleteRole(role: Role) {
    console.log('Funciono, el rol:', role);
    if (confirm(`Esta seguro de eliminar el rol: ${role.name}?`)) {
      if (role._id) {
        this.roleService.delete(role._id).subscribe({
          next: () => {
            console.log('Role deleted successfully');
            // Actualizar la lista local
            this.allRoles.update((currentRoles) => currentRoles.filter((r) => r._id !== role._id!));
          },
          error: (err) => console.error('Error deleting role', err),
        });
      }
    }
  }
  
  // Utilizar un computed signal para filtrar y paginar paginas
  filteredAndPaginatedRoles = computed(() => {
    // Obtener el termino de busqueda del servicio
    const searchTerm = this.filterService.searchField().toLowerCase();

    // Aplicar filtro completo a la lista de objetos
    const filtered = this.allRoles().filter(role => 
      !searchTerm || role.name.toLowerCase().includes(searchTerm)
      || role.description.toLowerCase().includes(searchTerm)
    );

    // Aplicar paginacion a la lista filtrada
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();

    // SE devuelve un objeto con la lista paginada y el total de elementos filtrados
    return {
      paginated: filtered.slice(startIndex, endIndex),
      totalFiltered: filtered.length
    };
  });


  // Metodo para cambiar de pagina
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // Metodo para cabmiar la cantidad de elementos por pagina
  onItemsPerPageChange(perPage: number): void {
    this.itemsPerPage.set(perPage);
    this.currentPage.set(1);
  }

  // Para cuando se seleccionan todas las filas
  onToggleAllRows(checked: boolean): void {
    this.allRoles.update(roles => roles.map(role => ({ ...role, selected: checked })));
  }
}
