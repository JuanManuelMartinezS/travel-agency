import { Component, computed, OnInit, signal } from '@angular/core';
import { Role } from '../models/role.model';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import Swal from 'sweetalert2';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  mode = signal<number>(1); // 1: view, 2: create, 3: update
  role = signal<Role>({ _id: "" });
  theFormGroup: FormGroup;
  trySend = signal<boolean>(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.theFormGroup = this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/'); // Allows to check full path and set mode accordingly
    
    if (currentUrl.includes('view')) {
      this.mode.set(1);
    } else if (currentUrl.includes('create')) {
      this.mode.set(2);
    } else if (currentUrl.includes('update')) {
      this.mode.set(3);
    }

    if (this.activatedRoute.snapshot.params['id']) {
      console.log('Route has ID parameter', this.activatedRoute.snapshot.params['id']);
      const roleId = this.activatedRoute.snapshot.params['id'];
      this.role.update(role => ({ ...role, _id: roleId }));
      this.getRole(roleId);
      console.log('Role ID from route:', roleId);
      console.log('Current mode:', this.mode());
      console.log('Role:', this.role());
    }
  }

  private configFormGroup(): FormGroup {
    return this.theFormBuilder.group({
      _id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],  
    });
  }

  getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  // Helper methods for form validation
  get nameControl(): AbstractControl | null {
    return this.theFormGroup.get('name');
  }

  get descriptionControl(): AbstractControl | null {
    return this.theFormGroup.get('description');
  }

  getRole(_id: string): void {
    this.roleService.view(_id).subscribe({
      next: (response) => {
        this.role.set(response);
        
        this.theFormGroup.patchValue({
          _id: response._id,
          name: response.name || '',
          description: response.description || ''
        });
        
        console.log('Role fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching role:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar la información del rol.',
          icon: 'error',
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/roles/table']);
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

    const roleData = { ...this.theFormGroup.value };
    delete roleData._id; // Remove ID for creation

    this.roleService.create(roleData).subscribe({
      next: (role) => {
        console.log('Role created successfully:', role);
        Swal.fire({
          title: 'Creado!',
          text: 'Rol creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/roles/table']);
      },
      error: (error) => {
        console.error('Error creating role:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear el rol.',
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

    const roleData = { ...this.theFormGroup.value };

    this.roleService.update(roleData).subscribe({
      next: (role) => {
        console.log('Role updated successfully:', role);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Rol actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/roles/table']);
      },
      error: (error) => {
        console.error('Error updating roles:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el rol.',
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
