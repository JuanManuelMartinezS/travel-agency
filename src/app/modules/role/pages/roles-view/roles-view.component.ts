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
  imports: [
    CommonModule,
    TableComponent,
    TableActionComponent,
    TableFooterComponent
  ],
  templateUrl: './roles-view.component.html',
  styleUrl: './roles-view.component.css'
})
export class RolesViewComponent  implements OnInit{
  // Una señal para tener la lista de roles
  roles = signal<Role[]>([]);

  // Las columnas de la tabla
  columns = ['id', 'name', 'description'];

  constructor(
    private roleService: RoleService
    // Depronto otra cosa
  ) {}

  ngOnInit(): void {
      // Llamamos la lista de roLes cuando el componente se inicializa
      this.roleService.list().subscribe({
        next: (data) => {
          this.roles.set(data);
        },
        error: (error) => {
          console.error('Error fetching roles:', error);
        }
      });
  }
  // Metodo para manejar el view
  onViewRole(role: Role) {
    console.log("Funciono, el rol:", role);
    
    // Implementar
  }

  // Metodo para manejar el edit
  onEditRole(role: Role) {
    console.log("Funciono, el rol:", role);

    // Implementar también con el create
  }
  
  // Metodo para manejar evento de delete de la tabla
  onDeleteRole(role: Role) {
    console.log("Funciono, el rol:", role);
    if(confirm(`Esta seguro de eliminar el rol: ${role.name}?`)) {
      this.roleService.delete(role.id!).subscribe({
        next: () => {
          console.log('Role deleted successfully');
          // Actualizar la lista local 
          this.roles.update(currentRoles => currentRoles.filter(r => r.id !== role.id!));
        },
        error: (err) => console.error('Error deleting role', err)
      });
    }
  }

  // Metodos para logica de filtros y pagination
  onSearchChange(term: string) {}
  onItemsPerPageChange(perPage: number) {}
  onPageChange(page: number) {}

}