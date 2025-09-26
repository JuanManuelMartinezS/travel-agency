import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { SecurityService } from 'src/app/core/services/security.service';

export const USER_ROLES = {
  CUSTOMER: 'customers',
  RESTAURANT: 'restaurants',
  DRIVER: 'drivers',
};

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgIf, ButtonComponent, NgClass],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType = false;
  loading = false;
  error = '';
  userRoles = USER_ROLES;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _authService: AuthService,
    private securityService: SecurityService,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  async onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // Stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const user = await this._authService.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error('Error en login:', error);
      this.error = error.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin() {
    await this.handleSocialLogin(() => this._authService.signInWithGoogle());
  }

  async onGitHubLogin() {
    await this.handleSocialLogin(() => this._authService.signInWithGitHub());
  }

  async onMicrosoftLogin() {
    await this.handleSocialLogin(() => this._authService.signInWithMicrosoft());
  }

  private async handleSocialLogin(loginFunction: () => Promise<any>) {
    this.loading = true;
    this.error = '';

    try {
      const user = await loginFunction();

      this.securityService.saveSession(user);
      console.log('redirigiendo');
      this._router.navigate([`/dashboard/nfts`]);
    } catch (error: any) {
      console.error('Error en login social:', error);
      this.error = error.message || 'Error en login social';
    } finally {
      this.loading = false;
    }
  }
}
