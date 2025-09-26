import { Injectable } from '@angular/core';
import {
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

import { environment } from '../../../environments/environment'; // Ajusta la ruta
import { auth, githubProvider, googleProvider, microsoftProvider } from 'src/firebase/firebaseconfig';

const USER_ROLES = {
  CUSTOMER: 'customers',
  RESTAURANT: 'restaurants',
  DRIVER: 'drivers',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.url_ms_security; // Usa la URL de tu environment

  constructor() {}

  // Función para iniciar sesión con email/contraseña
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const result = await firebaseSignIn(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Función para iniciar sesión con Google
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  // Función para iniciar sesión con GitHub
  async signInWithGitHub(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión con GitHub:', error);
      throw error;
    }
  }

  // Función para iniciar sesión con Microsoft
  async signInWithMicrosoft(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      return result.user;
    } catch (error) {
      console.error('Error al iniciar sesión con Microsoft:', error);
      throw error;
    }
  }

  // Función para verificar si un usuario tiene datos para un rol específico
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

  // Función para cerrar sesión
  async logOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Observer para cambios en autenticación
  authStateObserver(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}
