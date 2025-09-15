import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { User } from '../../models/user.model';
import { TableFilterService } from './services/table-filter.service';
import { UserService } from '../../services/user.service'; 

@Component({
  selector: 'app-table',
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal<boolean>(true); // Señal para manejar el estado de carga

  constructor(
    private userService: UserService, // Inyecta UserService en lugar de HttpClient
    private filterService: TableFilterService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.loading.set(true);
    this.userService.list()
    
      .subscribe({
        next: (data) => {
          this.users.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          // El error ya es manejado por catchError
        }
      });
  }

  public toggleUsers(checked: boolean) {
    this.users.update((users) => {
      return users.map((user) => {
        return { ...user, selected: checked };
      });
    });
  }

  private handleRequestError(error: any) {
    const msg = 'An error occurred while fetching users. Loading dummy data as fallback.';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message,
      action: {
        label: 'Undo',
        onClick: () => console.log('Action!'),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  // Métodos para CRUD (opcional, dependiendo de tu implementación)
  public deleteUser(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.loadUsers(); // Recargar los usuarios después de eliminar
        toast.success('User deleted successfully');
      },
      error: (error) => {
        toast.error('Error deleting user', { description: error.message });
      }
    });
  }

  public updateUser(user: User): void {
    this.userService.update(user).subscribe({
      next: () => {
        this.loadUsers(); // Recargar los usuarios después de actualizar
        toast.success('User updated successfully');
      },
      error: (error) => {
        toast.error('Error updating user', { description: error.message });
      }
    });
  }

  public createUser(user: User): void {
    this.userService.create(user).subscribe({
      next: () => {
        this.loadUsers(); // Recargar los usuarios después de crear
        toast.success('User created successfully');
      },
      error: (error) => {
        toast.error('Error creating user', { description: error.message });
      }
    });
  }

  filteredUsers = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();

    return this.users()
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.password.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) 
      )
      // .filter((user) => {
      //   if (!status) return true;
      //   switch (status) {
      //     case '1':
      //       return user.status === 1;
      //     case '2':
      //       return user.status === 2;
      //     case '3':
      //       return user.status === 3;
      //     default:
      //       return true;
      //   }
      // })
      // .sort((a, b) => {
      //   const defaultNewest = !order || order === '1';
      //   if (defaultNewest) {
      //     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      //   } else if (order === '2') {
      //     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      //   }
      //   return 0;
      // });
  });
}