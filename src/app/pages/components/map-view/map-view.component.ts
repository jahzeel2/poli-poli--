import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
// Fix Leaflet's default icon path issue with webpack
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;



@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent  implements OnInit, AfterViewInit, OnDestroy {
  map!: L.Map; // Leaflet Map instance
  filterForm: FormGroup; // Form group for date filters
  isLoading = false;
  private hotspotsSubscription: Subscription | null = null;
  private markerFeatureGroup: L.FeatureGroup = L.featureGroup(); // Use FeatureGroup

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
    ) {
    // Initialize the form
    this.filterForm = this.fb.group({
      // Store Date objects from datepicker
      fechaInicioObj: [null, Validators.required],
      fechaFinObj: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Patch the form with Date objects
    this.filterForm.patchValue({
        fechaInicioObj: thirtyDaysAgo,
        fechaFinObj: today
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.hotspotsSubscription?.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

   // Helper to format Date to 'YYYY-MM-DD' for API calls
   private formatDateToAPI(date: Date | null): string | null {
      if (!date || !(date instanceof Date)) {
          return null; // Return null if input is not a valid Date
      }
      try {
          const d = new Date(date); // Create a new Date object to avoid potential issues
          let month = '' + (d.getMonth() + 1);
          let day = '' + d.getDate();
          const year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [year, month, day].join('-');
      } catch (e) {
          console.error("Error formatting date:", e);
          return null; // Return null if formatting fails
      }
  }


  private initializeMap(): void {
    const mapContainer = document.getElementById('map-full');
    if (!mapContainer) {
        console.error('Map container element "map-full" not found!');
        return;
    }
    if (this.map) { // Avoid re-initializing
        this.map.invalidateSize();
        return;
    }
    try {
        this.map = L.map('map-full', { center: [-27.454, -58.984], zoom: 12 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18, minZoom: 5, attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
        this.markerFeatureGroup.addTo(this.map); // Add FeatureGroup
        console.log("Mapa completo inicializado.");
    } catch (error) {
        console.error("Error inicializando el mapa completo:", error);
        mapContainer.innerHTML = '<div class="alert alert-danger m-3">Error al cargar mapa.</div>';
    }
  }

  applyFilters(): void {
    if (this.filterForm.invalid) {
      Swal.fire('Fechas Inválidas', 'Por favor, seleccione una fecha de inicio y fin válidas.', 'warning');
      this.filterForm.markAllAsTouched();
      return;
    }

    // --- CORRECCIÓN: Formatear las fechas ANTES de enviarlas ---
    const fechaInicioObj = this.filterForm.value.fechaInicioObj;
    const fechaFinObj = this.filterForm.value.fechaFinObj;

    const fechaInicioAPI = this.formatDateToAPI(fechaInicioObj);
    const fechaFinAPI = this.formatDateToAPI(fechaFinObj);

    if (!fechaInicioAPI || !fechaFinAPI) {
         Swal.fire('Error de Formato', 'No se pudieron formatear las fechas correctamente.', 'error');
         return;
    }
    // --- FIN CORRECCIÓN ---

    console.log(`Aplicando filtros de mapa: ${fechaInicioAPI} a ${fechaFinAPI}`); // Log formato correcto
    this.isLoading = true;
    this.clearMapMarkers();

    this.hotspotsSubscription = this.apiService.getSiniestroHotspots(fechaInicioAPI, fechaFinAPI).subscribe({ // Enviar fechas formateadas
      next: (hotspots) => {
        this.isLoading = false;
        this.updateMapMarkers(hotspots);
        console.log(`Hotspots recibidos: ${hotspots.length}`);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching hotspots:', err);
        Swal.fire('Error', `No se pudieron cargar los puntos del mapa: ${err.message}`, 'error');
      }
    });
  }

  private clearMapMarkers(): void {
     this.markerFeatureGroup.clearLayers();
     console.log("Marcadores del mapa limpiados.");
  }

  private updateMapMarkers(hotspots: any[]): void {
    if (!this.map) { console.error("Mapa no inicializado."); return; }
    if (!hotspots || hotspots.length === 0) {
      Swal.fire('Sin Resultados', 'No se encontraron incidentes para las fechas seleccionadas.', 'info');
      return;
    }

    const markers: L.Marker[] = [];
    hotspots.forEach(hotspot => {
      const lat = parseFloat(hotspot.lat);
      const lng = parseFloat(hotspot.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .bindPopup(`<b>Incidentes: ${hotspot.incidentes || 1}</b><br>Coord: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        markers.push(marker);
      } else { console.warn("Hotspot inválido omitido:", hotspot); }
    });

    if (markers.length > 0) {
       markers.forEach(marker => this.markerFeatureGroup.addLayer(marker));
       const groupBounds = this.markerFeatureGroup.getBounds();
       if (groupBounds.isValid()) {
         this.map.fitBounds(groupBounds.pad(0.1));
       } else if (markers.length === 1) {
         this.map.setView(markers[0].getLatLng(), 15);
       }
       console.log(`Mapa actualizado con ${markers.length} marcadores.`);
    } else {
       console.log("No se añadieron marcadores válidos.");
       Swal.fire('Sin Resultados', 'No se encontraron incidentes con coordenadas válidas.', 'info');
    }
  }
}
