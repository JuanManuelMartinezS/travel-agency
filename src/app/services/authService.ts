// // src/app/services/firebase-auth.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { User } from '../models/user.model';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Router } from '@angular/router';
// import * as firebase from 'firebase/auth';
// import { OAuthProvider } from 'firebase/auth';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirebaseAuthService {
//   theUser = new BehaviorSubject<User>(new User());

//   constructor(
//     private afAuth: AngularFireAuth,
//     private router: Router
//   ) { 
//     this.verifyActualSession();
//   }

//   /**
//    * Iniciar sesión con Microsoft
//    */
//   async loginWithMicrosoft(): Promise<void> {
//     try {
//       const provider = new OAuthProvider('microsoft.com');
//       provider.setCustomParameters({
//         prompt: 'select_account',
//         tenant: 'common'
//       });

//       const result = await this.afAuth.signInWithPopup(provider);
//       this.saveFirebaseSession(result);
//     } catch (error) {
//       console.error('Error en autenticación con Microsoft:', error);
//       throw error;
//     }
//   }

//   /**
//    * Guardar la sesión de Firebase en nuestro formato
//    */
//   private async saveFirebaseSession(firebaseUser: any): Promise<void> {
//     const userData: User = {
//       id: firebaseUser.user?.uid,
//       name: firebaseUser.user?.displayName || '',
//       email: firebaseUser.user?.email || '',
//       password: '',
//       token: await firebaseUser.user?.getIdToken()
//     };

//     this.saveSession({
//       user: userData,
//       token: userData.token
//     });
//   }

//   /**
//    * Guardar información de sesión en localStorage
//    */
//   saveSession(dataSesion: any): void {
//     let data: User = {
//       id: dataSesion.user.id,
//       name: dataSesion.user.name,
//       email: dataSesion.user.email,
//       password: "",
//       token: dataSesion.token
//     };
    
//     localStorage.setItem('sesion', JSON.stringify(data));
//     this.setUser(data);
//   }

//   /**
//    * Actualizar el usuario actual
//    */
//   setUser(user: User): void {
//     this.theUser.next(user);
//   }

//   /**
//    * Obtener observable del usuario
//    */
//   getUser(): Observable<User> {
//     return this.theUser.asObservable();
//   }

//   /**
//    * Obtener usuario actual (valor sincrónico)
//    */
//   public get activeUserSession(): User {
//     return this.theUser.value;
//   }

//   /**
//    * Cerrar sesión
//    */
//   async logout(): Promise<void> {
//     await this.afAuth.signOut();
//     localStorage.removeItem('sesion');
//     this.setUser(new User());
//     this.router.navigate(['/login']);
//   }

//   /**
//    * Verificar sesión existente
//    */
//   verifyActualSession(): void {
//     const session = this.getSessionData();
//     if (session) {
//       this.setUser(JSON.parse(session));
//     }
//   }

//   /**
//    * Comprobar si existe sesión
//    */
//   existSession(): boolean {
//     return !!this.getSessionData();
//   }

//   /**
//    * Obtener datos de sesión
//    */
//   getSessionData(): string | null {
//     return localStorage.getItem('sesion');
//   }
// }