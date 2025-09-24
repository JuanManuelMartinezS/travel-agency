import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../models/user-role.model';
import { UserRoleService } from '../services/user-role.service';
import Swal from 'sweetalert2';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { RoleService } from '../../role/services/role.service';
import { Role } from '../../role/models/role.model';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponentUR implements OnInit {
  mode = signal<number>(1); // 1: view, 2: create, 3: update
  roles = signal<Role[]>([]);
  loading = signal<boolean>(true);
  userRoles = signal<UserRole[]>([]);
  userId = signal<string>('');

  theFormGroup: FormGroup;
  trySend = signal<boolean>(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userRoleService: UserRoleService,
    private router: Router,
    private theFormBuilder: FormBuilder,
    private roleService: RoleService,
  ) {
    this.theFormGroup = this.configFormGroup();
  }

  ngOnInit(): void {
    // Obtener el ID del usuario de la ruta
    this.userId.set(this.activatedRoute.snapshot.params['userId']);

    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode.set(1);
    } else if (currentUrl.includes('create')) {
      this.mode.set(2);
    } else if (currentUrl.includes('update')) {
      this.mode.set(3);
    }

    this.loadRoles();

    // Si es modo view o update, cargar los roles actuales del usuario
    if (this.mode() !== 2 && this.userId()) {
      this.loadUserRoles();
    }

    // Update form validators based on mode
    this.updateFormValidators();
  }

  private configFormGroup(): FormGroup {
    return this.theFormBuilder.group({
      userId: [this.userId(), [Validators.required]],
      selectedRoles: this.theFormBuilder.array([], [Validators.required, Validators.minLength(1)]),
    });
  }

  get selectedRolesArray(): FormArray {
    return this.theFormGroup.get('selectedRoles') as FormArray;
  }

  private updateFormValidators(): void {
    const selectedRolesControl = this.theFormGroup.get('selectedRoles');

    if (selectedRolesControl) {
      if (this.mode() === 1) {
        // View mode - disable controls
        selectedRolesControl.disable();
      } else {
        // Create/Update mode - enable controls
        selectedRolesControl.enable();
      }
    }
  }

  getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  // Helper methods for form validation
  get userIdControl(): AbstractControl | null {
    return this.theFormGroup.get('userId');
  }

  get selectedRolesControl(): AbstractControl | null {
    return this.theFormGroup.get('selectedRoles');
  }

  loadRoles(): void {
    this.roleService.list().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.initializeRoleCheckboxes();
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar los roles disponibles.',
          icon: 'error',
        });
      },
    });
  }

  loadUserRoles(): void {
    this.userRoleService.viewByUserId(this.userId()).subscribe({
      next: (response) => {
        this.userRoles.set(response);
        this.updateRoleCheckboxes();
      },
      error: (error) => {
        console.error('Error fetching user roles:', error);
      },
    });
  }

  initializeRoleCheckboxes(): void {
    const rolesArray = this.selectedRolesArray;
    rolesArray.clear();

    this.roles().forEach((role) => {
      rolesArray.push(this.theFormBuilder.control(false));
    });
  }

  updateRoleCheckboxes(): void {
    const rolesArray = this.selectedRolesArray;
    const userRoleIds = this.userRoles().map((userRole) => userRole.role._id);

    this.roles().forEach((role, index) => {
      const isSelected = userRoleIds.includes(role._id);
      rolesArray.at(index).setValue(isSelected);
    });
  }
  getRoleName(roleId: string): string {
    const role = this.roles().find((r) => r._id === roleId);
    return role ? role.name : 'Rol no encontrado';
  }
  getSelectedRoleIds(): string[] {
    const selectedRoles: string[] = [];
    this.selectedRolesArray.controls.forEach((control, index) => {
      if (control.value && this.roles()[index]._id !== undefined) {
        selectedRoles.push(this.roles()[index]._id || '');
      }
    });
    return selectedRoles;
  }

  back(): void {
    this.router.navigate(['/users/table']);
  }

  create(): void {
    this.trySend.set(true);

    const userId = this.userId();

    const selectedRoleIds = this.getSelectedRoleIds();

    // Crear todas las relaciones usuario-rol seleccionadas
    const createPromises = selectedRoleIds.map((roleId) =>
      this.userRoleService.create(String(userId), roleId).toPromise(),
    );

    Promise.all(createPromises)
      .then((results) => {
        console.log('UserRoles created successfully:', results);
        Swal.fire({
          title: 'Creado!',
          text: `Se asignaron ${selectedRoleIds.length} rol(es) al usuario correctamente.`,
          icon: 'success',
        });
        this.router.navigate(['/users/table']);
      })
      .catch((error) => {
        console.error('Error creating userRoles:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al asignar los roles al usuario.',
          icon: 'error',
        });
      });
  }

  update(): void {
    this.trySend.set(true);
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, seleccione al menos un rol.',
        icon: 'error',
      });
      return;
    }

    const userId = this.userId();
    const selectedRoleIds = this.getSelectedRoleIds();
    const currentRoleIds = this.userRoles().map((userRole) => userRole.role._id);

    // Identificar roles a agregar y eliminar
    const rolesToAdd = selectedRoleIds.filter((roleId) => !currentRoleIds.includes(roleId));
    const rolesToRemove = currentRoleIds.filter((roleId) => !selectedRoleIds.includes(roleId || ''));

    // Eliminar relaciones que ya no están seleccionadas
    const removePromises = rolesToRemove.map((roleId) => {
      const userRoleToRemove = this.userRoles().find((ur) => ur.role._id === roleId);
      return userRoleToRemove ? this.userRoleService.delete(userRoleToRemove._id || '').toPromise() : Promise.resolve();
    });

    // Agregar nuevas relaciones
    const addPromises = rolesToAdd.map((roleId) => this.userRoleService.create(userId, roleId).toPromise());

    Promise.all([...removePromises, ...addPromises])
      .then((results) => {
        console.log('UserRoles updated successfully:', results);
        Swal.fire({
          title: 'Actualizado!',
          text: `Roles del usuario actualizados correctamente.`,
          icon: 'success',
        });
        this.router.navigate(['/users/table']);
      })
      .catch((error) => {
        console.error('Error updating userRoles:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar los roles del usuario.',
          icon: 'error',
        });
      });
  }

  // Computed properties for template access
  protected readonly isViewMode = computed(() => this.mode() === 1);
  protected readonly isCreateMode = computed(() => this.mode() === 2);
  protected readonly isUpdateMode = computed(() => this.mode() === 3);
}
