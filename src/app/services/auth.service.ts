import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { UsuarioCriminalisticaService } from './usuario-criminalistica.service';
import { Router } from '@angular/router';
export interface UserProfile {
  id: number;
  nombre: string; // Usado como username?
  apellido: string;
  rol: { id: number; nombre: string };
  // Añadir otros campos relevantes que devuelva la API
  sistema?: { id: number; nombre: string };
  norDni?: number;
  // externalUserId?: string; // Si guardas el ID de la API externa
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'currentUserSiniestrosPol'; // Usar una clave única
  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  public currentUser$: Observable<UserProfile | null>;

  constructor(
    private usuarioCriminalisticaService: UsuarioCriminalisticaService,
    private router: Router
  ) {
    // Cargar usuario del storage al iniciar el servicio
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(this.loadUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
    console.log('AuthService initialized. Initial user from storage:', this.currentUserSubject.value);
  }

  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    const loggedIn = !!this.currentUserValue;
    console.log('AuthService isLoggedIn check:', loggedIn, 'User:', this.currentUserValue);
    return loggedIn;
  }

  public getUserRole(): string | null {
    return this.currentUserValue?.rol?.nombre || null;
  }

  public hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase());
  }

  async login(identifier: string): Promise<boolean> {
    console.log(`AuthService: Intentando login con identifier: ${identifier}`);
    try {
      // tu UsuarioCriminalisticaService.doLoginId devuelve una Promesa
      const response: any = await this.usuarioCriminalisticaService.doLoginId(identifier);

      console.log("AuthService: Respuesta del login API externa:", response);

      // Validar la respuesta de la API externa
      // Ajusta esta condición según cómo tu API indica éxito y devuelve datos
      // El servicio original devuelve un objeto con 'code: 500' en caso de error HTTP
      if (response && response.id && response.rol && response.rol.nombre && response.code !== 500) {
        const userProfile: UserProfile = {
          id: response.id,
          nombre: response.nombre, // Asumiendo que 'nombre' es el username/identificador
          apellido: response.apellido,
          rol: { id: response.rol.id, nombre: response.rol.nombre },
          sistema: response.sistema, // Asegúrate que estos campos existan en la respuesta
          norDni: response.norDni
          // externalUserId: response.cifrado, // Si 'cifrado' es el ID externo
        };
        this.saveUserToStorage(userProfile);
        this.currentUserSubject.next(userProfile);
        console.log("AuthService: Login exitoso, usuario guardado:", userProfile);
        return true;
      } else {
        // Manejar respuesta no exitosa o inesperada de la API
        let errorMessage = "Respuesta de API inválida o usuario no encontrado.";
        if (response && response.msg) {
            errorMessage = response.msg; // Usar mensaje de error de la API si existe
        }
        console.error("AuthService: Login fallido -", errorMessage, "Respuesta completa:", response);
        this.clearUserStorageAndNotify(); // Limpiar storage y notificar
        return false;
      }
    } catch (error: any) {
      // Capturar errores de la promesa (ej. si la API está caída y no se maneja en el servicio hijo)
      console.error("AuthService: Error catastrófico durante el login:", error);
      this.clearUserStorageAndNotify();
      return false;
    }
  }

  logout(): void {
    this.clearUserStorageAndNotify();
    this.router.navigate(['/login']);
    console.log("AuthService: Logout realizado.");
  }

  private saveUserToStorage(user: UserProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      console.log("AuthService: Usuario guardado en localStorage.");
    } catch (e) {
      console.error("AuthService: Error guardando usuario en localStorage", e);
    }
  }

  private loadUserFromStorage(): UserProfile | null {
    try {
      const userJson = localStorage.getItem(this.STORAGE_KEY);
      if (userJson) {
        const user: UserProfile = JSON.parse(userJson);
        // Podrías añadir validación adicional aquí (ej. que tenga rol)
        if (user && user.id && user.rol && user.rol.nombre) {
          console.log("AuthService: Usuario cargado desde localStorage:", user);
          return user;
        } else {
          console.warn("AuthService: Datos de usuario en localStorage inválidos, limpiando.");
          localStorage.removeItem(this.STORAGE_KEY);
          return null;
        }
      }
      console.log("AuthService: No se encontró usuario en localStorage.");
      return null;
    } catch (e) {
      console.error("AuthService: Error cargando usuario desde localStorage", e);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private clearUserStorageAndNotify(): void {
    try {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log("AuthService: Usuario eliminado de localStorage.");
    } catch(e) {
        console.error("AuthService: Error eliminando usuario de localStorage", e);
    }
    this.currentUserSubject.next(null);
  }
}
