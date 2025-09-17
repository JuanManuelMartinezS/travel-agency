import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../models/user-role.model';
import { UserRoleService } from '../services/user-role.service';
import Swal from 'sweetalert2';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  mode = signal<number>(1); // 1: view, 2: create, 3: update
  userRole = signal<UserRole>({ 
    _id: '', 
    user: { _id: "", name: "", email: "" }, 
    role: { _id: "", name: "", description: "" } 
  });
  theFormGroup: FormGroup;
  trySend = signal<boolean>(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userRoleService: UserRoleService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.theFormGroup = this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    
    if (currentUrl.includes('view')) {
      this.mode.set(1);
    } else if (currentUrl.includes('create')) {
      this.mode.set(2);
    } else if (currentUrl.includes('update')) {
      this.mode.set(3);
    }

    // Update form validators based on mode
    this.updateFormValidators();

    if (this.activatedRoute.snapshot.params['id']) {
      const userRoleId = this.activatedRoute.snapshot.params['id'];
      this.getUserRole(userRoleId);
    }
  }

  private configFormGroup(): FormGroup {
    return this.theFormBuilder.group({
      userId: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    });
  }

  private updateFormValidators(): void {
    // Para UserRole, las validaciones son las mismas en todos los modos
    const userIdControl = this.theFormGroup.get('userId');
    const roleIdControl = this.theFormGroup.get('roleId');
    
    if (userIdControl && roleIdControl) {
      if (this.mode() === 1) { // View mode - disable controls
        userIdControl.disable();
        roleIdControl.disable();
      } else { // Create/Update mode - enable controls
        userIdControl.enable();
        roleIdControl.enable();
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

  get roleIdControl(): AbstractControl | null {
    return this.theFormGroup.get('roleId');
  }
    // Helper methods for form validation
  get nameControl(): AbstractControl | null {
    return this.theFormGroup.get('name');
  }

  get emailControl(): AbstractControl | null {
    return this.theFormGroup.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.theFormGroup.get('password');
  }


  getUserRole(id: string): void {
    this.userRoleService.viewById(id).subscribe({
      next: (response) => {
        this.userRole.set(response);
        
        this.theFormGroup.patchValue({
          userId: response.user._id,
          roleId: response.role._id
        });
        
        console.log('UserRole fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching userRole:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar la información de la relación usuario-rol.',
          icon: 'error',
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/user-roles/table']);
  }

  create(): void {
    this.trySend.set(true);
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const { userId, roleId } = this.theFormGroup.value;

    this.userRoleService.create(userId, roleId).subscribe({
      next: (userRole) => {
        console.log('UserRole created successfully:', userRole);
        Swal.fire({
          title: 'Creado!',
          text: 'Relación usuario-rol creada correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/user-roles/table']);
      },
      error: (error) => {
        console.error('Error creating userRole:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear la relación usuario-rol.',
          icon: 'error',
        });
      }
    });
  }

  update(): void {
    this.trySend.set(true);
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const { userId, roleId } = this.theFormGroup.value;
    const currentId = this.userRole()._id;

    // Primero eliminar la relación existente y luego crear la nueva
    this.userRoleService.delete(currentId || '').subscribe({
      next: () => {
        this.userRoleService.create(userId, roleId).subscribe({
          next: (userRole) => {
            console.log('UserRole updated successfully:', userRole);
            Swal.fire({
              title: 'Actualizado!',
              text: 'Relación usuario-rol actualizada correctamente.',
              icon: 'success',
            });
            this.router.navigate(['/user-roles/table']);
          },
          error: (error) => {
            console.error('Error updating userRole:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Error al actualizar la relación usuario-rol.',
              icon: 'error',
            });
          }
        });
      },
      error: (error) => {
        console.error('Error deleting old userRole:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar la relación usuario-rol.',
          icon: 'error',
        });
      }
    });
  }

  // Computed properties for template access
  protected readonly isViewMode = computed(() => this.mode() === 1);
  protected readonly isCreateMode = computed(() => this.mode() === 2);
  protected readonly isUpdateMode = computed(() => this.mode() === 3);
}