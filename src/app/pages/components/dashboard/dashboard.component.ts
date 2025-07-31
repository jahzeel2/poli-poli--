import { Component, OnInit, ViewChild, OnDestroy, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, Subscription, switchMap, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { IncidentDetailDialogComponent } from '../incident-detail-dialog/incident-detail-dialog.component';
import { UploadEvidenceDialogComponent } from '../upload-evidence-dialog/upload-evidence-dialog.component';

import { Cifrado } from 'src/app/utils/cifrado';
import { Utils } from 'src/app/utils/utils';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
@Input() isCollapsed = false;


@ViewChild('close')
  cerrar!: ElementRef;

 exportar: boolean = false;
  items: UsuariosCriminalistica[];
  item: UsuariosCriminalistica;

dtCriminalistica!: UsuariosCriminalistica;
 proceso: Boolean;
  //tipoPersona: string;
  rol: number;
  crit: any;
  procesando!: Boolean;
  public load!: boolean;

  public nombre: string = 'Central Comunicaciones';
  public url: string = 'https://10.125.31.214/central/';
  public activoSistema: boolean = false;

  TipoUsuario!: string;

  entidad = 'lst-usuarios';
  nombreUsu = '';


  stats = { total: 0, completed: 0, inProgress: 0, pending: 0 };


  displayedColumns: string[] = ['id_expediente', 'lugar', 'fechaHecho', 'estadoNombre', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  isLoadingSiniestros = false;


  notifications: any[] = [];
  isLoadingNotifications = false;
usuario: string;
  private subscriptions = new Subscription();


  @ViewChild('recentPaginator') paginator!: MatPaginator;
  @ViewChild('recentSort') sort!: MatSort;

  constructor(
    private wsdl: UsuarioCriminalisticaService,
    private wsdlRegistro:RegistroUsuarioService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
    ) {
    this.load = false;
    this.item = new UsuariosCriminalistica();
    this.items = [];
    this.proceso = false;
this.rol = 0;
this.usuario = '';
    }

  ngOnInit(): void {
this.rol = JSON.parse(
      Cifrado.descifrar('' + Utils.getSession('personal'), 5)
    ).rol;
    //let persona = JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5))
    this.nombreUsu =
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .apellido +
      ' ' +
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .nombre,
    this.loadInitialData();
    this.setupPolling();
    console.log(this.nombreUsu, this.rol);
  }

  ngOnDestroy(): void {

  }

  loadInitialData(): void {
    this.loadRecentSiniestros();
    this.loadRecentActivity();

  }

  loadRecentSiniestros(): void {
    this.isLoadingSiniestros = true;
    const sub = this.apiService.getSiniestros(1000).subscribe({
      next: (data) => {

        this.dataSource.data = Array.isArray(data) ? data : [];

        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
        this.isLoadingSiniestros = false;
        this.updateStats(this.dataSource.data);
        console.log("Siniestros recientes cargados:", this.dataSource.data);
      },
      error: (err) => {
        this.isLoadingSiniestros = false;
        this.dataSource.data = [];
        console.error('Error loading recent incidents:', err);

      }
    });
    this.subscriptions.add(sub);
  }

  loadRecentActivity(): void {

      this.isLoadingNotifications = true;
     const sub = this.apiService.getRecentActivity(10).subscribe({
        next: (data) => {
            this.notifications = Array.isArray(data) ? data : [];
            this.isLoadingNotifications = false;
            console.log("Actividad reciente cargada:", this.notifications);
        },
        error: (err) => {
            this.isLoadingNotifications = false;
             this.notifications = [];
            console.error("Error loading recent activity:", err);

        }
      });
      this.subscriptions.add(sub);
  }

  setupPolling(): void {

      const pollInterval = 60000;
      const pollSub = timer(pollInterval, pollInterval).pipe(
          switchMap(() => {
              console.log("Polling for new notifications...");

              return this.apiService.getRecentActivity(10).pipe(
                  catchError(err => {

                      console.error("Error during notification polling:", err);
                      return of([]);
                  })
              );
          })
      ).subscribe({
          next: (data) => {
              this.notifications = Array.isArray(data) ? data : [];

          }

      });
      this.subscriptions.add(pollSub);
  }


  updateStats(data: any[]): void {

      this.stats.total = data.length;
      this.stats.completed = data.filter(s => s.estadoNombre?.toLowerCase() === 'completado').length;
      this.stats.inProgress = data.filter(s => s.estadoNombre?.toLowerCase() === 'en progreso').length;
      this.stats.pending = data.filter(s => s.estadoNombre?.toLowerCase() === 'pendiente').length;
  }


  navigateToNewIncident(): void { this.router.navigate(['/nuevo-siniestro']); }
  navigateToIncidentList(): void { this.router.navigate(['/siniestros']); }

  viewDetails(incidentId: number): void {
     this.isLoadingSiniestros = true;
    this.apiService.getSiniestroById(incidentId).subscribe({
      next: (data) => {
        this.isLoadingSiniestros = false;
        if (data && data.id_expediente) {
            this.dialog.open(IncidentDetailDialogComponent, {
                width: '800px', maxWidth: '95vw', data: data
            });
        } else {
              console.error("Datos inválidos recibidos para detalles:", data);
              Swal.fire('Error', 'No se pudieron obtener los detalles completos.', 'error');
        }
      },
      error: (err) => {
        this.isLoadingSiniestros = false;
        console.error(`Error fetching details for incident ${incidentId}:`, err);
        Swal.fire('Error', `No se pudieron cargar los detalles: ${err.message}`, 'error');
      }
    });
  }

  editIncident(incidentId: number): void {
    this.router.navigate(['/nuevo-siniestro', { id: incidentId }]);
  }

  deleteIncident(incidentId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar (marcar como baja) el siniestro Nº ${incidentId}?`,
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d', confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar', reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoadingSiniestros = true;
        const usuarioActual = this.nombreUsu;
        this.apiService.deleteSiniestro(incidentId, usuarioActual).subscribe({
          next: (response) => {
            this.isLoadingSiniestros = false;
            Swal.fire('Eliminado', response?.message || `Siniestro ${incidentId} marcado como baja.`, 'success');
            this.loadRecentSiniestros();
            this.loadRecentActivity();
          },
          error: (err) => {
            this.isLoadingSiniestros = false;
            console.error(`Error deleting incident ${incidentId}:`, err);
            Swal.fire('Error', `No se pudo eliminar: ${err.message}`, 'error');
          }
        });
      }
    });
}


  getChipColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
        const lowerEstado = estado?.toLowerCase();
        if (lowerEstado === 'completado') return 'primary';
        if (lowerEstado === 'en progreso') return 'accent';
        if (lowerEstado === 'pendiente') return 'warn';
        return undefined;
  }


  getNotificationIcon(action: string, table: string): string {
      const lowerAction = action?.toLowerCase();
      const lowerTable = table?.toLowerCase();

      if (lowerAction === 'crear') return 'add_circle_outline';
      if (lowerAction === 'actualizar') return 'sync_alt';
      if (lowerAction === 'eliminar') return 'delete_outline';
      if (lowerAction === 'subir_fotos') return 'cloud_upload';

      if (lowerTable === 'siniestro') return 'gavel';
      if (lowerTable === 'usuariocriminalistica') return 'person_outline';
      if (lowerTable === 'perito') return 'assignment_ind';
      if (lowerTable === 'fotografo') return 'photo_camera';
      return 'info_outline';
  }


  formatNotificationDescription(notification: any): string {
      let desc = notification.descripcion || `${notification.accion || 'Acción'} en ${notification.tabla_afectada || 'tabla'}`;
      if (notification.id_registro_afectado) {
          desc += ` (ID: ${notification.id_registro_afectado})`;
      }
      return desc;
  }


    formatTimeAgo(dateString: string): string {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.round(Math.abs((now.getTime() - date.getTime()) / 1000));
            const minutes = Math.round(seconds / 60);
            const hours = Math.round(minutes / 60);
            const days = Math.round(hours / 24);
            const months = Math.round(days / 30);
            const years = Math.round(days / 365);

            if (seconds < 60) return `hace ${seconds} seg.`;
            if (minutes < 60) return `hace ${minutes} min.`;
            if (hours < 24) return `hace ${hours} hr.`;
            if (days < 30) return `hace ${days} días`;
            if (months < 12) return `hace ${months} meses`;
            return `hace ${years} años`;
        } catch (e) {
            return dateString;
        }
    }


    openUploadEvidenceDialog(): void {
        const dialogRef = this.dialog.open(UploadEvidenceDialogComponent, {
          width: '600px',
           disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {

              this.loadRecentActivity();
          }
        });
    }
}

