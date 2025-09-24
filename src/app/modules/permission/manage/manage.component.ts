import { Component, computed, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Permission } from '../models/permission.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  mode = signal<number>(1); // 1: view, 2: create, 3: update
  permission = signal<Permission>({ _id: "" });
  theFormGroup: FormGroup;
  trySend = signal<boolean>(false);
  methods = ['GET', 'POST', 'PUT', 'DELETE'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
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
      const permissionId = this.activatedRoute.snapshot.params['id'];
      this.permission.update(permission => ({ ...permission, _id: permissionId }));
      this.getPermission(permissionId);
      console.log('Permission ID from route:', permissionId);
      console.log('Current mode:', this.mode());
      console.log('Permission:', this.permission());
    }
  }

  private configFormGroup(): FormGroup {
    return this.theFormBuilder.group({
      _id: [0],
      url: ['', [Validators.required, Validators.minLength(3)]],
      method: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(3)]],  
    });
  }

  getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  // Helper methods for form validation
  get urlControl(): AbstractControl | null {
    return this.theFormGroup.get('url');
  }

  get methodControl(): AbstractControl | null {
    return this.theFormGroup.get('method');
  }

  get modelControl(): AbstractControl | null {
    return this.theFormGroup.get('model');
  }

  getPermission(_id: string): void {
    this.permissionService.view(_id).subscribe({
      next: (response) => {
        this.permission.set(response);
        
        this.theFormGroup.patchValue({
          _id: response._id,
          url: response.url || '',
          method: response.method || '',
          model: response.model || ''
        });
        
        console.log('Permission fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching permission:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar la información del permiso.',
          icon: 'error',
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/permissions/table']);
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

    const permissionData = { ...this.theFormGroup.value };
    delete permissionData._id; // Remove ID for creation

    this.permissionService.create(permissionData).subscribe({
      next: (permission) => {
        console.log('Permission created successfully:', permission);
        Swal.fire({
          title: 'Creado!',
          text: 'Permiso creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/permissions/table']);
      },
      error: (error) => {
        console.error('Error creating permission:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear el permiso.',
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

    const permissionData = { ...this.theFormGroup.value };

    this.permissionService.update(permissionData).subscribe({
      next: (permission) => {
        console.log('Permission updated successfully:', permission);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Permiso actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/permissions/table']);
      },
      error: (error) => {
        console.error('Error updating permissions:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el permiso.',
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
