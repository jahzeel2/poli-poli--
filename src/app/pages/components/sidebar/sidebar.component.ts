import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserProfile } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
 @Input() isCollapsed = false;

  currentUser: UserProfile | null = null;
  private userSubscription: Subscription | null = null;

  // Definir roles para usar en el template
  ROLES = { MANAGER: 'Manager', ADMIN: 'Administrador', CARGADOR: 'Cargador', FOTOGRAFO: 'Fotografo', VISTA: 'Vista' };

  constructor(public authService: AuthService) { } // Hacer público para usar en template o inyectar directamente

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
      this.userSubscription?.unsubscribe();
  }

  // Getters para simplificar template (opcional)
  get userName(): string { return this.currentUser?.nombre || 'Usuario'; }
  get userRole(): string { return this.currentUser?.rol?.nombre || 'N/A'; }
  get userImageUrl(): string { return 'https://via.placeholder.com/80/007bff/ffffff?text=SP'; } // Placeholder

}
