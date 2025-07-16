import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Obtiene el rol requerido desde la ruta
    const requiredRole = route.data['rol'];

    // Obtiene el rol del usuario desde el localStorage (o desde un servicio)
    const userRole = localStorage.getItem('role');

    // Verifica si el usuario tiene el rol necesario
    if (userRole === requiredRole) {
      return true; // Permite el acceso
    } else {
      // Redirige a una página de acceso denegado o al login
      this.router.navigate(['/acceso-denegado']);
      return false;
    }
  }
}
