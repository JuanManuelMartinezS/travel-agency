import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Permission } from '../permission/models/permission.model';
import { Role } from '../role/models/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../permission/services/permission.service';
import { RoleService } from '../role/services/role.service';
import { RolePermissionService } from './services/role-permission.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ButtonComponent } from "src/app/shared/components/button/button.component";

@Component({
  selector: 'app-role-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyValuePipe, ButtonComponent],
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent implements OnInit{
  roleId = signal<string | null>(null);
  currentRole = signal<Role | null>(null);
  allPermissions = signal<Permission[]>([]);
  
  permissionsByModel = computed(() => {
    const grouped = new Map<string, { [method: string]: Permission }>();
    this.allPermissions().forEach(p => {
      const model = p.model || 'Sin modelo';
      const friendlyName = p.friendly_name || 'Sin nombre';
      
      if (!grouped.has(model)) {
        grouped.set(model, {});
      }
      // Asignamos el permiso a la clave de su método
      grouped.get(model)![friendlyName] = p;
    });
    return grouped;
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private rolePermissionService: RolePermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const roleId = this.activatedRoute.snapshot.params['id'];
    this.roleId.set(roleId);

    if (roleId) {
      // Usamos forkJoin para cargar el rol y los permisos en paralelo
      forkJoin({
        role: this.roleService.view(roleId),
        allPerms: this.permissionService.list(),
        rolePerms: this.rolePermissionService.getByRole(roleId)
      }).subscribe({
        next: ({ role, allPerms, rolePerms }) => {
          console.log('Role:', role);
          console.log('All Permissions:', allPerms);
          console.log('Role Permissions:', rolePerms);

          // Filtrar rolepermissions invalidos cuando el permiso es null
          const validRolePerms = rolePerms.filter(rp => rp.permission?._id);
          this.currentRole.set(role);

          // Mapeamos los permisos para marcar los que ya están asignados
          const permissionsWithStatus = allPerms.map(perm => ({
            ...perm,
            has_permission: validRolePerms.some(rp => rp.permission?._id === perm._id),
            // Añadimos un nombre amigable en el metodo y la URL
            friendly_name: this.getFriendlyName(perm)
          }));
          this.allPermissions.set(permissionsWithStatus);
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          Swal.fire('Error', 'No se pudieron cargar los datos del rol y permisos.', 'error');
        }
      });
    }
  }

  getFriendlyName(permission: Permission): string {
    if (permission.method === 'GET') {
      if (permission.url?.includes('/?')) {
        return 'View';
      } else {
      return 'List';
      }
    } 
    if (permission.method === 'POST') {
      return 'Create';
    } 
    if (permission.method === 'PUT') { 
      return 'Update';
    }
    if (permission.method === 'DELETE') {
      return 'Delete';
    }
    return 'Unknown';
  }

  // Metodo para manejar cambios en los checkboxes
  onPermissionChange(permission: Permission): void {
    if (!this.roleId()) return;

    if (permission.has_permission) {
      // El checkbox se marcó, creamos la relación
      const newRolePermission = {
        role: { _id: this.roleId() },
        permission: { _id: permission._id },
        has_permission: true
      };
      this.rolePermissionService.create(this.roleId()!, permission._id!).subscribe({
        next: (response) => {
          console.log('Permiso asignado correctamente:', response);
        },
        error: (error) => {
          console.error('Error al asignar permiso:', error);
          // Opcional: Revertir el estado del checkbox si la operación falla
          permission.has_permission = false;
          Swal.fire('Error', 'No se pudo asignar el permiso.', 'error');
        }
      });
    } else {
      // El checkbox se desmarcó, eliminamos la relación
      this.rolePermissionService.delete(this.roleId()!, permission._id!).subscribe({
        next: (response) => {
          console.log('Permiso revocado correctamente:', response);
        },
        error: (error) => {
          console.error('Error al revocar permiso:', error);
          // Opcional: Revertir el estado del checkbox si la operación falla
          permission.has_permission = true;
          Swal.fire('Error', 'No se pudo revocar el permiso.', 'error');
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['/roles/table']);
  }

}
