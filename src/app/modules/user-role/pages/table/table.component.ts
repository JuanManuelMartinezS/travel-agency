import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { UserRole } from '../../models/user-role.model';
import { TableFilterService } from './services/table-filter.service';

import { UserRoleService } from '../../services/user-role.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Role } from 'src/app/modules/role/models/role.model';
import { UserService } from 'src/app/modules/user/services/user.service';
import { RoleService } from 'src/app/modules/role/services/role.service';
import { User } from 'src/app/modules/user/models/user.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
    ButtonComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableUserRoleComponent implements OnInit {
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  userRoles = signal<UserRole[]>([]);
  loading = signal<boolean>(true);
  
  // Configuración de la tabla
  tableType = signal<'users' | 'roles' | 'users-by-role' | 'roles-by-user'>('users');
  currentRoleId = signal<string>("");
  currentUserId = signal<string>("");
  pageTitle = signal<string>('Usuarios');

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
    private filterService: TableFilterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Determinar el tipo de tabla desde la ruta
    this.route.data.subscribe(data => {
      this.tableType.set(data['type'] || 'users');
      this.updatePageTitle();
    });

    // Obtener parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['roleId']) {
        this.currentRoleId.set(params['roleId']);
      }
      if (params['userId']) {
        this.currentUserId.set(params['userId']);
      }
    });

    this.loadData();
  }

  private updatePageTitle(): void {
    const titles = {
      'users': 'Usuarios',
      'roles': 'Roles',
      'users-by-role': 'Usuarios por Rol',
      'roles-by-user': 'Roles del Usuario'
    };
    this.pageTitle.set(titles[this.tableType()]);
  }

  public loadData(): void {
    this.loading.set(true);
    
    switch (this.tableType()) {
      case 'users':
        this.loadUsers();
        break;
      case 'roles':
        this.loadRoles();
        break;
      case 'users-by-role':
        this.loadUsersByRole();
        break;
      case 'roles-by-user':
        this.loadRolesByUser();
        break;
    }
  }

  private loadUsers(): void {
    this.userService.list().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.handleRequestError(error, 'Error al cargar los usuarios.');
      }
    });
  }

  private loadRoles(): void {
    this.roleService.list().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.handleRequestError(error, 'Error al cargar los roles.');
      }
    });
  }

  private loadUsersByRole(): void {
    const roleId = this.currentRoleId();
    if (!roleId) return;

    this.userRoleService.viewByRoleId(roleId).subscribe({
      next: (userRoles) => {
        // Extraer usuarios de las relaciones user-role
        const userIds = userRoles.map(ur => ur._id);
        this.loadUsersFromIds(userIds);
      },
      error: (error) => {
        this.loading.set(false);
        this.handleRequestError(error, 'Error al cargar usuarios del rol.');
      }
    });
  }

private loadRolesByUser(): void {
  const userId = this.currentUserId();
  if (!userId) return;

  this.userRoleService.viewByUserId(userId).subscribe({
    next: (userRoles) => {
      // La API retorna un array de UserRole, no un solo objeto
      this.userRoles.set(userRoles);
      this.loading.set(false);
      console.log('Roles del usuario:', this.userRoles());
    },
    error: (error) => {
      this.loading.set(false);
      this.handleRequestError(error, 'Error al cargar roles del usuario.');
    }
  });
}

  private loadUsersFromIds(userIds: (string | undefined)[]): void {
    // Implementar método para cargar usuarios específicos por IDs
    // Esto depende de si tu API soporta consultas por múltiples IDs
    this.userService.list().subscribe({
      next: (allUsers) => {
        const filteredUsers = allUsers.filter(user => userIds.includes(user._id!));
        this.users.set(filteredUsers);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.handleRequestError(error, 'Error al cargar usuarios.');
      }
    });
  }

  // MÉTODOS DE NAVEGACIÓN ENTRE TABLAS
  public navigateToUsers(): void {
    this.router.navigate(['/users/table/users']);
  }

  public navigateToRoles(): void {
    this.router.navigate(['/users/table/roles']);
  }

  public viewUsersByRole(roleId: string): void {
    this.router.navigate(['/users/table/users/by-role', roleId]);
  }

  public viewRolesByUser(userId: string): void {
    this.router.navigate(['/users/table/roles/by-user', userId]);
  }

  // MÉTODOS EXISTENTES ACTUALIZADOS
  public toggleItems(checked: boolean): void {
    if (this.tableType() === 'users' || this.tableType() === 'users-by-role') {
      this.users.update((users) => {
        return users.map((user) => ({ ...user, selected: checked }));
      });
    } else if (this.tableType() === 'roles') {
      this.roles.update((roles) => {
        return roles.map((role) => ({ ...role, selected: checked }));
      });
    }
  }

  private handleRequestError(error: any, message: string): void {
    toast.error(message, {
      position: 'bottom-right',
      description: error.message || 'Error desconocido',
      action: {
        label: 'Reintentar',
        onClick: () => this.loadData(),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  

  // MÉTODOS PARA GESTIÓN DE RELACIONES USER-ROLE
  public assignRoleToUser(userId: WritableSignal<string>, roleId: WritableSignal<string>): void {
    this.userRoleService.create(userId, roleId).subscribe({
      next: () => {
        toast.success('Rol asignado correctamente');
        this.loadData();
      },
      error: (error) => {
        toast.error('Error al asignar rol', { description: error.message });
      }
    });
  }

  public removeRoleFromUser(userId: string, roleId: string): void {
    Swal.fire({
      title: '¿Remover rol?',
      text: 'Se quitará este rol del usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userRoleService.deleteByUserAndRole(userId, roleId).subscribe({
          next: () => {
            toast.success('Rol removido correctamente');
            this.loadData();
          },
          error: (error) => {
            toast.error('Error al remover rol', { description: error.message });
          }
        });
      }
    });
  }

  // Propiedades computadas
  filteredUsers = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    return this.users().filter((user) => {
      if (!search) return true;
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    });
  });

  filteredRoles = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    return this.roles().filter((role) => {
      if (!search) return true;
      return role.name?.toLowerCase().includes(search);
    });
  });

  // Getters para el template
  get selectedUsersCount(): number {
    return this.users().filter(user => user.selected).length;
  }

  get selectedRolesCount(): number {
    return this.roles().filter(role => role.selected).length;
  }

  get hasSelectedUsers(): boolean {
    return this.selectedUsersCount > 0;
  }

  get hasSelectedRoles(): boolean {
    return this.selectedRolesCount > 0;
  }

  // Otros métodos existentes...
  public importCSV(): void {
    toast.info('Función de importación CSV en desarrollo');
  }

  public exportCSV(): void {
    const csvData = this.tableType() === 'users' || this.tableType() === 'users-by-role' 
      ? this.convertUsersToCSV(this.users())
      : this.convertRolesToCSV(this.roles());
    
    const filename = this.tableType() === 'users' || this.tableType() === 'users-by-role' 
      ? 'usuarios.csv' 
      : 'roles.csv';
    
    this.downloadCSV(csvData, filename);
    toast.success('Datos exportados correctamente');
  }

  private convertUsersToCSV(users: User[]): string {
    const headers = ['ID', 'Nombre', 'Email'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user._id || '',
        user.name || '',
        user.email || ''
      ].join(','))
    ];
    return csvContent.join('\n');
  }

  private convertRolesToCSV(roles: Role[]): string {
    const headers = ['ID', 'Nombre', 'Descripción'];
    const csvContent = [
      headers.join(','),
      ...roles.map(role => [
        role._id || '',
        role.name || '',
        role.description || ''
      ].join(','))
    ];
    return csvContent.join('\n');
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}