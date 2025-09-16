import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
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
  user = signal<User>({ _id: 0 });
  theFormGroup: FormGroup;
  trySend = signal<boolean>(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
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
      console.log('Route has ID parameter', this.activatedRoute.snapshot.params['id']);
      const userId = this.activatedRoute.snapshot.params['id'];
      this.user.update(user => ({ ...user, _id: userId }));
      this.getUser(userId);
      console.log('User ID from route:', userId);
      console.log('Current mode:', this.mode());
      console.log('User:', this.user());
    }
  }

  private configFormGroup(): FormGroup {
    return this.theFormBuilder.group({
      _id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
  
    });
  }

  private getPasswordValidators() {
    if (this.mode() === 2) { // Create mode - password required
      return [Validators.required, Validators.minLength(6)];
    } else if (this.mode() === 3) { // Update mode - password optional
      return [Validators.minLength(6)];
    }
    return []; // View mode - no validation
  }

  getTheFormGroup() {
    return this.theFormGroup.controls;
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

  getUser(_id: number): void {
    this.userService.view(_id).subscribe({
      next: (response) => {
        this.user.set(response);
        
        this.theFormGroup.patchValue({
          _id: response._id,
          name: response.name || '',
          email: response.email || '',
          password: response.password || '', 
        });
        
        console.log('User fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar la información del usuario.',
          icon: 'error',
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/users/table']);
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

    const userData = { ...this.theFormGroup.value };
    delete userData._id; // Remove ID for creation

    this.userService.create(userData).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        Swal.fire({
          title: 'Creado!',
          text: 'Usuario creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/users/table']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear el usuario.',
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

    const userData = { ...this.theFormGroup.value };
    
    // If password is empty in update mode, remove it from the data
    if (!userData.password || userData.password.trim() === '') {
      delete userData.password;
    }

    this.userService.update(userData).subscribe({
      next: (user) => {
        console.log('User updated successfully:', user);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Usuario actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/users/table']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el usuario.',
          icon: 'error',
        });
      }
    });
  }

  // Method to update form validators when mode changes
  private updateFormValidators(): void {
    const passwordControl = this.theFormGroup.get('password');
    if (passwordControl) {
      passwordControl.setValidators(this.getPasswordValidators());
      passwordControl.updateValueAndValidity();
    }
  }

  // Computed properties for template access
  protected readonly isViewMode = computed(() => this.mode() === 1);
  protected readonly isCreateMode = computed(() => this.mode() === 2);
  protected readonly isUpdateMode = computed(() => this.mode() === 3);
}