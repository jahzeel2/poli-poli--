import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav; // Reference to the sidenav

  isMobile = false; // Flag for mobile view
  isSidebarCollapsed = false; // Flag for sidebar state
  backendStatus = 'checking'; // checking, ok, error
  backendMessage = 'Verificando conexión al backend...';
  private destroy$ = new Subject<void>(); // To unsubscribe observables

  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService // Inject ApiService
  ) {}

  ngOnInit(): void {
    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isSidebarCollapsed = false; // Ensure sidebar is not collapsed on mobile
          this.sidenav?.close(); // Close sidenav on mobile initially
        } else {
          // Optionally set a default state for desktop (e.g., open and not collapsed)
          // this.isSidebarCollapsed = false;
          // this.sidenav?.open();
        }
      });

    // Check backend status on init
    this.checkBackend();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.sidenav.toggle(); // Toggle sidenav drawer on mobile
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle collapsed state on desktop
      // Optionally toggle the sidenav itself if needed, or just rely on CSS width change
      // this.sidenav.toggle(!this.isSidebarCollapsed);
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

  // Method to close sidenav on mobile after navigation
  onActivate(event: any): void {
    if (this.isMobile && this.sidenav?.opened) {
      this.sidenav.close();
    }
     // Scroll to top on route change
    window.scrollTo(0, 0);
  }
}
