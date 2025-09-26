// auth.service.ts - CON REDIRECT
import { Injectable, inject } from '@angular/core';
import {
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from '@angular/fire/auth';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const USER_ROLES = {
  CUSTOMER: 'customers',
  RESTAURANT: 'restaurants',
  DRIVER: 'drivers',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.url_ms_security;
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  // Providers
  private googleProvider = new GoogleAuthProvider();
  private githubProvider = new GithubAuthProvider();
  private microsoftProvider = new OAuthProvider('microsoft.com');

  constructor() {
    // Manejar el resultado del redirect después del login
    this.handleRedirectResult();
  }

  private async handleRedirectResult() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        const userType = localStorage.getItem('pendingUserType');
        if (userType) {
          await this.processSocialLoginSuccess(result.user);
        }
      }
    } catch (error) {
      console.error('Error en redirect result:', error);
    }
  }

  // Función para iniciar sesión con email/contraseña (sin cambios)
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Función para iniciar sesión con Google (REDIRECT)
  async signInWithGoogle(): Promise<void> {
    await signInWithRedirect(this.auth, this.googleProvider);
  }

  // Función para iniciar sesión con GitHub (REDIRECT)
  async signInWithGitHub(): Promise<void> {
    await signInWithRedirect(this.auth, this.githubProvider);
  }

  // Función para iniciar sesión con Microsoft (REDIRECT)
  async signInWithMicrosoft(): Promise<void> {
    await signInWithRedirect(this.auth, this.microsoftProvider);
  }

  private async processSocialLoginSuccess(user: User) {
    try {
      console.log('redirigiendo a das');
      this.router.navigate([`dashboard/nfts`]);
    } catch (error) {
      console.error('Error procesando login social:', error);
      this.router.navigate(['/auth/sign-in'], {
        queryParams: { error: 'Error en el proceso de autenticación' },
      });
    }
  }

  async logOut(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('currentRole');
      localStorage.removeItem('pendingUserType');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  authStateObserver(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
