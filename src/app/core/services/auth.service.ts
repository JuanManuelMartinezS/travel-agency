// auth.service.ts - CORREGIDO
import { Injectable, inject } from '@angular/core';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  authState,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
    this.setupProviders();
  }

  private setupProviders() {
    // Configurar Google Provider
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');

    // Configurar GitHub Provider
    this.githubProvider.addScope('user:email');

    // Configurar Microsoft Provider
    this.microsoftProvider.setCustomParameters({
      prompt: 'consent',
      tenant: 'common',
    });
  }

  // ✅ Login con email/contraseña - SIN NgZone
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw this.handleAuthError(error);
    }
  }

  // ✅ Login con Google - SIN NgZone
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return result.user;
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      throw this.handleAuthError(error);
    }
  }

  // ✅ Login con GitHub
  async signInWithGitHub(): Promise<User> {
    try {
      const result = await signInWithPopup(this.auth, this.githubProvider);
      return result.user;
    } catch (error: any) {
      console.error('Error al iniciar sesión con GitHub:', error);
      throw this.handleAuthError(error);
    }
  }

  // ✅ Login con Microsoft
  async signInWithMicrosoft(): Promise<User> {
    try {
      const result = await signInWithPopup(this.auth, this.microsoftProvider);
      return result.user;
    } catch (error: any) {
      console.error('Error al iniciar sesión con Microsoft:', error);
      throw this.handleAuthError(error);
    }
  }

  // ✅ Manejo centralizado de errores
  private handleAuthError(error: any): Error {
    switch (error.code) {
      case 'auth/popup-blocked':
        return new Error('El popup fue bloqueado. Por favor, permite popups para este sitio.');
      case 'auth/popup-closed-by-user':
        return new Error('Cerraste la ventana de autenticación demasiado pronto.');
      case 'auth/cancelled-popup-request':
        return new Error('Solicitud de popup cancelada.');
      case 'auth/user-not-found':
        return new Error('Usuario no encontrado.');
      case 'auth/wrong-password':
        return new Error('Contraseña incorrecta.');
      case 'auth/invalid-email':
        return new Error('Email inválido.');
      case 'auth/user-disabled':
        return new Error('Esta cuenta ha sido deshabilitada.');
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos fallidos. Intenta más tarde.');
      case 'auth/network-request-failed':
        return new Error('Error de conexión. Verifica tu internet.');
      default:
        return new Error(error.message || 'Error de autenticación');
    }
  }

  // ✅ Observador de estado de autenticación
  getAuthState() {
    return authState(this.auth);
  }

  // ✅ Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await firstValueFrom(this.getAuthState());
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // ✅ Verificar datos de rol de usuario
  async checkUserRoleData(user: User, role: string): Promise<boolean> {
    if (!user || !role) {
      console.error('Usuario o rol no proporcionado');
      return false;
    }

    try {
      const idToken = await user.getIdToken();

      const response = await fetch(`${this.API_URL}/${role}?email=${encodeURIComponent(user.email!)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
      });

      if (response.status === 404 || response.status === 500) {
        console.log(`Error en el endpoint ${role}:`, response.status);
        return false;
      }

      if (!response.ok) {
        console.error(`Error checking ${role} data:`, response.status);
        return false;
      }

      const users = await response.json();

      if (!Array.isArray(users) || users.length === 0) {
        return false;
      }

      const userData = users.find((u: any) => u.email === user.email);
      return !!userData;
    } catch (error) {
      console.error(`Error checking ${role} data:`, error);
      return false;
    }
  }

  async logOut(): Promise<void> {
    try {
      // Cerrar sesión en Firebase
      await signOut(this.auth);

      // Limpiar todo el localStorage
      localStorage.clear();

      // Opcional: Limpiar sessionStorage si lo usas
      sessionStorage.clear();

      // Redirigir al usuario a la página de login
      await this.router.navigate(['/auth/sign-in'], {
        replaceUrl: true, // Evita que el usuario pueda volver atrás
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  // ✅ Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // ✅ Obtener token del usuario actual
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}
