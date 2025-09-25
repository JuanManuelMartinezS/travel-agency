import { CommonModule } from '@angular/common';
import { Component, OnInit, signal,computed } from '@angular/core';

// Partes reutilizables de la tabla
import { TableComponent } from 'src/app/modules/uikit/pages/table/table.component';
import { TableActionComponent } from 'src/app/modules/uikit/pages/table/components/table-action/table-action.component';
import { TableFooterComponent } from 'src/app/modules/uikit/pages/table/components/table-footer/table-footer.component';

// Modelo y servicios
import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../models/permission.model';
import { TableFilterService } from 'src/app/modules/uikit/pages/table/services/table-filter.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableAction } from 'src/app/modules/uikit/pages/table/components/table-row/table-row.component';

@Component({
  selector: 'app-permissions-view',
  imports: [CommonModule, TableComponent, TableActionComponent, TableFooterComponent],
  templateUrl: './permissions-view.component.html',
  styleUrl: './permissions-view.component.css'
})
export class PermissionsViewComponent implements OnInit {
  // Una señal para tener la lista total de roles
  allPermissions = signal<Permission[]>([]);

  // Variables para las paginas
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  // Las columnas de la tabla
  columns = [
    {key: 'select', label: '', width: '50px'},
    {key: '_id', label: 'Id', width: '300px'},
    {key: 'url', label: 'Url', width: '300px'},
    {key: 'method', label: 'Method', width: '150px'},
    {key: 'model', label: 'Model', width: '200px'},
    {key: 'actions', label: '', width: '50px'},
  ]; 

  // Definir las acciones disponibles en la tabla
  actions: TableAction[] = [
    { label: 'Ver', action: 'view' },
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete' }
  ];

  constructor(
    private permissionService: PermissionService,
    private filterService: TableFilterService,
    private router: Router
  ) 
  {}

  ngOnInit(): void {
    // Llamamos la lista de permisos cuando el componente se inicializa
    this.permissionService.list().subscribe({
      next: (data) => {
        this.allPermissions.set(data);
      },
      error: (error) => {
        console.error('Error fetching permissions:', error);
      },
    });
  }

  // Metodo para manejar el create
  onCreatePermission() {
    console.log('Funciono, el permiso para ver');
    this.router.navigate(['/permissions/create']);
  }

  // Cuando le dan click a una acción (botón del table-row)
  onActionClicked(event: { action: string; item: any }): void {
    const { action, item } = event;
    switch (action) {
      case 'view':
        this.onViewPermission(item);
        break;
      case 'edit':
        this.onEditPermission(item);
        break;
      case 'delete':
        this.onDeletePermission(item);
        break;
      default:
        console.warn(`Acción desconocida: ${action}`);
    }
  }

  // Metodo para manejar el view
  onViewPermission(permission: Permission) {
    console.log('Funciono, el permiso para ver');
    this.router.navigate(['/permissions/view', permission._id]);
  }

  // Metodo para manejar el edit
  onEditPermission(permission: Permission) {
    console.log('Funciono, el permiso para editar:', permission);
    this.router.navigate(['/permissions/update', permission._id]);
  }

  // Metodo para manejar evento de delete de la tabla
  onDeletePermission(permission: Permission) {
    Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DC2626',
          cancelButtonColor: '#6B7280',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed && permission._id) {
            this.permissionService.delete(permission._id).subscribe({
              next: () => {
                console.log('Permission deleted successfully');
                // Actualizar la lista local
                this.allPermissions.update((currentPermissions) => currentPermissions.filter((r) => r._id !== permission._id!));
              },
              error: (err) => console.error('Error deleting permission', err),
              });
          }});
  }
  
  // Utilizar un computed signal para filtrar y paginar paginas
  filteredAndPaginatedPermissions = computed(() => {
    // Obtener el termino de busqueda del servicio
    const searchTerm = this.filterService.searchField().toLowerCase();

    // Aplicar filtro completo a la lista de objetos
    const filtered = this.allPermissions().filter(permission => 
      !searchTerm ||
      (permission.url && permission.url.toLowerCase().includes(searchTerm)) ||
      (permission.method && permission.method.toLowerCase().includes(searchTerm)) ||
      (permission.model && permission.model.toLowerCase().includes(searchTerm)) 
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
    this.allPermissions.update(permissions => permissions.map(permission => ({ ...permission, selected: checked })));
  }
}
