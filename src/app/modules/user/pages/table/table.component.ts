import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';

import { TableFilterService } from './services/table-filter.service';
import { UserService } from '../../services/user.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { User } from '../../models/user.model';


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
export class TableComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private userService: UserService,
    private filterService: TableFilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.loading.set(true);
    this.userService.list().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.handleRequestError(error);
      }
    });
  }

  public toggleUsers(checked: boolean): void {
    this.users.update((users) => {
      return users.map((user) => ({ ...user, selected: checked }));
    });
  }

  private handleRequestError(error: any): void {
    const msg = 'Error al cargar los usuarios.';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Error desconocido',
      action: {
        label: 'Reintentar',
        onClick: () => this.loadUsers(),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  // Navigation methods
  public createUser(): void {
    this.router.navigate(['/users/create']);
  }

  public viewUser(userId: string): void {
    this.router.navigate(['/users/view', userId]);
  }

  public editUser(userId: string): void {
    this.router.navigate(['/users/update', userId]);
  }


  // CRUD operations
  public deleteUser(userId: string): void {
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
      if (result.isConfirmed) {
        this.userService.delete(userId).subscribe({
          next: () => {
            this.loadUsers();
            toast.success('Usuario eliminado correctamente');
          },
          error: (error) => {
            toast.error('Error al eliminar usuario', { 
              description: error.message 
            });
          }
        });
      }
    });
  }

  // public deleteSelectedUsers(): void {
  //   const selectedUsers = this.users().filter(user => user.selected);
    
  //   if (selectedUsers.length === 0) {
  //     toast.warning('No hay usuarios seleccionados');
  //     return;
  //   }

  //   Swal.fire({
  //     title: `¿Eliminar ${selectedUsers.length} usuario(s)?`,
  //     text: 'Esta acción no se puede deshacer',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#DC2626',
  //     cancelButtonColor: '#6B7280',
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const userIds = selectedUsers.map(user => user.id!);
        
  //       this.userService.deleteMultiple(userIds).subscribe({
  //         next: () => {
  //           this.loadUsers();
  //           toast.success(`${selectedUsers.length} usuario(s) eliminado(s) correctamente`);
  //         },
  //         error: (error) => {
  //           toast.error('Error al eliminar usuarios', { 
  //             description: error.message 
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  public importCSV(): void {
    // Implementar lógica de importación CSV
    toast.info('Función de importación CSV en desarrollo');
  }

  public onUserSelectionChange(event: {user: User, selected: boolean}): void {
    this.users.update((users) => {
      return users.map((user) => 
        user._id === event.user._id 
          ? { ...user, selected: event.selected }
          : user
      );
    });
  }
  public exportCSV(): void {
    const csvData = this.convertToCSV(this.users());
    this.downloadCSV(csvData, 'usuarios.csv');
    toast.success('Usuarios exportados correctamente');
  }

  private convertToCSV(users: User[]): string {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha Nacimiento'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user._id || '',
        user.name || '',
        user.email || '',
        user.password || '',
       
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

  // Computed property for filtered users
  filteredUsers = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();

    return this.users()
      .filter((user) => {
        if (!search) return true;
        return (
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.password?.toLowerCase().includes(search)
        );
      })
      .filter((user) => {
        if (!status) return true;
        // Agregar lógica de filtrado por estado si es necesario
        return true;
      })
     
  });

  // Computed properties for template
  get selectedUsersCount(): number {
    return this.users().filter(user => user.selected).length;
  }

  get hasSelectedUsers(): boolean {
    return this.selectedUsersCount > 0;
  }
}