import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cifrado } from 'src/app/utils/cifrado';
import { Utils } from 'src/app/utils/utils';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  private userSubscription: Subscription | null = null;

  notificationCount = 3; // Placeholder

  constructor(private route: Router) {
     this.usuario = '';
    this.rol = '';
  } // Inyectar AuthService
 usuario: string;
  rol: string;

  ngOnInit(): void {
     this.rol = JSON.parse(
      Cifrado.descifrar('' + Utils.getSession('personal'), 5)
    ).rol;
    //let persona = JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5))
    this.usuario = JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .apellido +
      ' ' +
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .nombre;
    // console.log('persona', this.usuario);
    }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe(); // Limpiar suscripción
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  // Usar el nombre del usuario logueado


  viewProfile(): void { /* ... (lógica futura) ... */ }
  viewSettings(): void { /* ... (lógica futura) ... */ }

  cerrar() {
    Utils.clearSession();
    this.route.navigate(['']);
  }
}


