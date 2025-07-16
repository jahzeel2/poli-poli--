import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserProfile } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
currentUser: UserProfile | null = null;
  private userSubscription: Subscription | null = null;

  notificationCount = 3; // Placeholder

  constructor(private authService: AuthService) { } // Inyectar AuthService

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario actual
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe(); // Limpiar suscripción
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  // Usar el nombre del usuario logueado
  get userNameDisplay(): string {
      return this.currentUser ? `${this.currentUser.nombre || ''} ${this.currentUser.apellido || ''}`.trim() : 'Usuario';
  }

  viewProfile(): void { /* ... (lógica futura) ... */ }
  viewSettings(): void { /* ... (lógica futura) ... */ }

  logout(): void {
    this.authService.logout(); // Llamar al logout del servicio
  }
}
