import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Partes reutilizables de la tabla
import { TableComponent } from 'src/app/modules/uikit/pages/table/table.component';
import { TableActionComponent } from 'src/app/modules/uikit/pages/table/components/table-action/table-action.component';
import { TableFooterComponent } from 'src/app/modules/uikit/pages/table/components/table-footer/table-footer.component';

// Modelo y servicios
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-roles-view',
  imports: [CommonModule, TableComponent, TableActionComponent, TableFooterComponent],
  templateUrl: './roles-view.component.html',
  styleUrl: './roles-view.component.css',
})
export class RolesViewComponent implements OnInit {
  // Una señal para tener la lista total de roles
  allRoles = signal<Role[]>([]);

  // La lista de roles que se mostraran en la tabla
  filteredRoles = signal<Role[]>([]);

  // La lista de roles que se muestra en la pagina actual
  paginatedRoles = signal<Role[]>([]);

  // Variables para las paginas
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  // Las columnas de la tabla
  columns = [
    {key: '_id', label: 'Id', width: '35%'},
    {key: 'name', label: 'Name', width: '20%'},
    {key: 'description', label: 'Description', width: '25%'},
  ]; 

  constructor(private roleService: RoleService) // Depronto otra cosa
  {}

  ngOnInit(): void {
    // Llamamos la lista de roLes cuando el componente se inicializa
    this.roleService.list().subscribe({
      next: (data) => {
        this.allRoles.set(data);
        console.log(this.allRoles());
        // La lista filtrada también empieza con todos los roles
        this.filteredRoles.set(data);
        this.paginateRoles(); // Se llama a la paginación inicial
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
            this.filteredRoles.set(this.allRoles())
            this.paginatedRoles.set(this.filteredRoles());
          },
          error: (err) => console.error('Error deleting role', err),
        });
      }
    }
  }

  // Metodos para logica de filtros y pagination
  onSearchChange(searchTerm: string): void {
    // Si el termino de busca es vacio, mostramos todo
    if (!searchTerm) {
      this.filteredRoles.set(this.allRoles());
      return;
    } else {
      // Convertimos a minusucla para evitar problemas
      const term = searchTerm.toLowerCase();

      // Filtramos la lista completa 
      const filtered = this.allRoles().filter(role => 
        // Buscamos en propiedades name y description
        role.name.toLowerCase().includes(term) || role.description.toLowerCase().includes(term)
      );

      // Se actualiza lo que mostramos en la tabla
      this.filteredRoles.set(filtered);
    }
    // Siempre se pone la primera pagina al filtrar
    this.currentPage.set(1);
    this.paginateRoles();
    
  }

  // Metodo para paginar
  paginateRoles(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    this.paginatedRoles.set(this.filteredRoles().slice(startIndex, endIndex)); // Aqui se hace el corte
  }

  // Metodo para cambiar de pagina
  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.paginateRoles();
  }

  // Metodo para cabmiar la cantidad de elementos por pagina
  onItemsPerPageChange(perPage: number): void {
    this.itemsPerPage.set(perPage);
    this.currentPage.set(1);
    this.paginateRoles();
  }
}
