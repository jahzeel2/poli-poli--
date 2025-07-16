import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { IncidentDetailDialogComponent } from '../../incident-detail-dialog/incident-detail-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id_expediente',
    'fechaCreacion',
    'fechaHecho',
    'lugar',
    'tipoHecho',
    'estadoNombre',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  private dataSubscription: Subscription | null = null;

  // Usar '!' para indicar que se inicializarán en ngAfterViewInit
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private router: Router // Inyectar Router
    ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Asignar paginator y sort después de que la vista se inicialice
    // Se reasignarán cuando lleguen los datos asíncronos
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  loadData(): void {
    this.isLoading = true;
    this.dataSubscription = this.apiService.getSiniestros().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        // Reasignar paginator y sort después de cargar datos
        // Es importante hacerlo aquí para que funcionen con datos asíncronos
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
        console.log("Lista de siniestros cargada:", data);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading incidents list:', err);
        Swal.fire('Error', `No se pudo cargar la lista de siniestros: ${err.message}`, 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetails(incidentId: number): void {
     this.isLoading = true; // Mostrar indicador mientras carga
     this.apiService.getSiniestroById(incidentId).subscribe({
       next: (data) => {
         this.isLoading = false;
         // Verificar que data no sea null y tenga id antes de abrir
         if (data && data.id_expediente) {
             this.dialog.open(IncidentDetailDialogComponent, {
                 width: '800px', // Ajustar ancho
                 maxWidth: '95vw', // Máximo ancho en pantallas pequeñas
                 data: data // Pasar los datos completos al diálogo
             });
         } else {
              console.error("Datos inválidos o incompletos recibidos de la API:", data);
              Swal.fire('Error', 'No se pudieron obtener los detalles completos del siniestro.', 'error');
         }
       },
       error: (err) => {
         this.isLoading = false;
         console.error(`Error fetching details for incident ${incidentId}:`, err);
         Swal.fire('Error', `No se pudieron cargar los detalles: ${err.message}`, 'error');
       }
     });
   }

  editIncident(incidentId: number): void {
    console.log(`Navegando para editar siniestro ID: ${incidentId}`);
    // Navegar a la ruta del formulario, pasando el ID como parámetro opcional
    // Asumiendo que reutilizas '/nuevo-siniestro' y le pasas el ID
    this.router.navigate(['/nuevo-siniestro', { id: incidentId }]);
    // Si creaste una ruta específica '/editar-siniestro/:id':
    // this.router.navigate(['/editar-siniestro', incidentId]);
  }

  deleteIncident(incidentId: number): void {
     Swal.fire({
       title: '¿Estás seguro?',
       text: `¿Realmente deseas eliminar (marcar como baja) el siniestro Nº ${incidentId}?`,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#d33',
       cancelButtonColor: '#6c757d',
       confirmButtonText: 'Sí, eliminar',
       cancelButtonText: 'Cancelar',
       reverseButtons: true // Poner botón de confirmar a la derecha
     }).then((result) => {
       if (result.isConfirmed) {
         this.isLoading = true;
         const usuarioActual = 'UsuarioAngular'; // TODO: Usar usuario real logueado
         this.apiService.deleteSiniestro(incidentId, usuarioActual).subscribe({
           next: (response) => {
             this.isLoading = false;
             Swal.fire(
               'Eliminado',
               response?.message || `El siniestro ${incidentId} ha sido marcado como baja.`,
               'success'
             );
             this.loadData(); // Refrescar la lista
           },
           error: (err) => {
             this.isLoading = false;
             console.error(`Error deleting incident ${incidentId}:`, err);
             Swal.fire('Error', `No se pudo eliminar el siniestro: ${err.message}`, 'error');
           }
         });
       }
     });
   }

   // Helper para color del chip de estado
   getChipColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
        const lowerEstado = estado?.toLowerCase();
        // Ajustar colores según el tema de Material o CSS personalizado
        if (lowerEstado === 'completado') return 'primary'; // Asociar con éxito (puede ser verde con CSS)
        if (lowerEstado === 'en progreso') return 'accent'; // Asociar con advertencia/progreso (amarillo/naranja)
        if (lowerEstado === 'pendiente') return 'warn'; // Asociar con peligro/pendiente (rojo)
        return undefined; // Gris por defecto
   }
}
