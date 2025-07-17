import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  isSidebarCollapsed = false;
  backendStatus = 'checking';
  backendMessage = 'Verificando conexión al backend...';
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isSidebarCollapsed = false;
          this.sidenav?.close();
        } else {
          this.isSidebarCollapsed = false; // O el estado que prefieras por defecto en desktop
          this.sidenav?.open();
        }
      });

    this.checkBackend();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  checkBackend(): void {
    this.backendStatus = 'checking';
    this.backendMessage = 'Verificando conexión al backend...';
    this.apiService.checkBackendHealth().subscribe({
      next: (res) => {
        if (res.status === 'ok') {
          this.backendStatus = 'ok';
          this.backendMessage = res.message || 'Backend conectado.';
        } else {
          this.backendStatus = 'error';
          this.backendMessage = res.message || 'Respuesta inesperada del backend.';
        }
      },
      error: (err) => {
        this.backendStatus = 'error';
        this.backendMessage = `Error conectando al backend: ${err.message}`;
        console.error('Backend health check failed:', err);
      }
    });
  }

  // Cierra el menú lateral en móvil después de hacer clic en un enlace
  onSidenavItemClick(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
