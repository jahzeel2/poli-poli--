import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Obtener roles permitidos desde la data de la ruta
    const allowedRoles = route.data?.['allowedRoles'] as Array<string>;

    if (!allowedRoles || allowedRoles.length === 0) {
      // Si no se definen roles, permitir acceso (o denegar por defecto si se prefiere)
      console.warn("RoleGuard: No se definieron roles permitidos para esta ruta.");
      return true;
    }

    const hasPermission = this.authService.hasRole(allowedRoles);

    if (hasPermission) {
      // El usuario tiene uno de los roles permitidos
      return true;
    } else {
      // El usuario no tiene permiso
      console.warn(`RoleGuard: Acceso denegado. Rol actual: ${this.authService.getUserRole()}. Roles permitidos: ${allowedRoles.join(', ')}`);
      this.snackBar.open('No tiene permiso para acceder a esta sección.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      // Redirigir al dashboard o a una página de "acceso denegado"
      return this.router.createUrlTree(['/dashboard']);
    }
  }

}
