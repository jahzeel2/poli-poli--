import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; // Import Reactive Forms elements
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as L from 'leaflet'; // Import Leaflet
import SignaturePad from 'signature_pad'; // Import SignaturePad
import Swal from 'sweetalert2';
import { catchError, finalize, forkJoin, Observable, of, Subscription } from 'rxjs';

 // Import ApiService
import { MatStepper } from '@angular/material/stepper'; // Import MatStepper
import { ApiService } from 'src/app/services/api.service';

// Fix Leaflet's default icon path issue
const iconRetinaUrl = 'assets/marker-icon-2x.png'; const iconUrl = 'assets/marker-icon.png'; const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({ iconRetinaUrl, iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41] });
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss']
})
export class IncidentFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLDivElement>;
  @ViewChild('sigPadCanvas') sigPadCanvas!: ElementRef<HTMLCanvasElement>;

  informacionBasicaForm: FormGroup;
  ubicacionForm: FormGroup;
  detallesCondicionesForm: FormGroup;
  involucradosForm: FormGroup;
  firmaForm: FormGroup;

  isLoading = false;
  isLoadingDropdowns = false;
  isLinear = true; // Empezar lineal, cambiar a false si editamos
  isEditing = false;
  editingIncidentId: number | null = null;

  private map!: L.Map;
  private marker: L.Marker | null = null;
  private signaturePad!: SignaturePad;
  private subscriptions: Subscription = new Subscription();

  // Data for dropdowns
  tiposSiniestro: string[] = ['Colisión Simple', 'Colisión Múltiple', 'Atropello', 'Vuelco', 'Incendio Vehicular', 'Otro'];
  peritos: any[] = [];
  fotografos: any[] = [];
  vias: any[] = [];
  condicionesClimaticas: string[] = ['Despejado', 'Nublado', 'Lluvia Leve', 'Lluvia Intensa', 'Niebla', 'Viento'];
  iluminaciones: string[] = ['Natural Diurna', 'Natural Crepuscular', 'Nocturna Artificial', 'Nocturna Sin Iluminación'];
  visibilidades: string[] = ['Buena', 'Regular', 'Mala', 'Reducida (Niebla/Lluvia)'];
  tiposUsuario: string[] = ['Conductor', 'Acompañante', 'Peatón', 'Testigo'];
  estados: any[] = [];


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize Forms
    this.informacionBasicaForm = this.fb.group({
        fecha: [this.formatDate(new Date()), Validators.required], hora: [this.formatTime(new Date())], tipo: ['', Validators.required],
        escribiente: [''], peritoId: [null], fotografoId: [null]
    });
    this.ubicacionForm = this.fb.group({
        lugar: ['', Validators.required], id_via: [null],
        latitude: [{ value: null, disabled: true }], longitude: [{ value: null, disabled: true }]
    });
    this.detallesCondicionesForm = this.fb.group({
        descripcion: [''], cond_climaticas: ['Despejado'], iluminacion: ['Natural Diurna'], visibilidad: ['Buena'],
        nro_expediente: [''], comunicacion: [''], tramita: [''],
        estadoExpte: [null] // Control para estado
    });
    this.involucradosForm = this.fb.group({
        personas: this.fb.array([]) // Empezar vacío
    });
    this.firmaForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadDropdownData(); // Cargar dropdowns

    // Leer ID de la ruta usando el Observable paramMap
    const routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
        const idFromRoute = params.get('id'); // Lee el parámetro 'id'
        if (idFromRoute) {
            this.editingIncidentId = +idFromRoute;
            this.isEditing = true;
            this.isLinear = false; // Permitir navegar libremente al editar
            console.log(`Modo Edición - Cargando datos para Siniestro ID: ${this.editingIncidentId}`);
            this.loadIncidentData(this.editingIncidentId);
        } else {
            this.isEditing = false;
            this.isLinear = true;
            // Limpiar y añadir un partícipe vacío solo si no estamos editando
            this.personasArray.clear();
            this.personasArray.push(this.crearPersonaGroup());
            console.log('Modo Creación - Formulario inicializado.');
        }
    });
    this.subscriptions.add(routeSub);
  }

  loadDropdownData(): void {
    this.isLoadingDropdowns = true;
    const requests = [
      this.apiService.getPeritos().pipe(catchError(() => of([]))),
      this.apiService.getFotografos().pipe(catchError(() => of([]))),
      this.apiService.getVias().pipe(catchError(() => of([]))),
      this.apiService.getEstados().pipe(catchError(() => of([])))
    ];

    const combinedSub = forkJoin(requests).subscribe({
        next: ([peritosData, fotografosData, viasData, estadosData]) => {
            this.peritos = peritosData; this.fotografos = fotografosData;
            this.vias = viasData; this.estados = estadosData;
            this.isLoadingDropdowns = false;
        },
        error: (err) => {
            this.isLoadingDropdowns = false;
            console.error("Error loading dropdown data:", err);
            Swal.fire('Error', `No se pudieron cargar algunos datos necesarios: ${err.message}`, 'error');
        }
    });
    this.subscriptions.add(combinedSub);
  }

  loadIncidentData(id: number): void {
    this.isLoading = true;
    const sub = this.apiService.getSiniestroById(id).subscribe({
      next: (data) => {
        if (!data || !data.id_expediente) {
           this.isLoading = false;
           Swal.fire('Error', `No se encontraron datos para el siniestro ID ${id}.`, 'error');
           this.router.navigate(['/siniestros']);
           return;
        }
        console.log("Datos recibidos para editar:", data);
        // Poblar formularios
        this.informacionBasicaForm.patchValue({
            fecha: this.formatDate(data.fechaHecho || data.fechaCreacion),
            hora: data.horaHecho ? data.horaHecho.substring(0, 5) : null,
            tipo: data.tipoHecho, escribiente: data.escribienteHecho,
            peritoId: data.idPeritoHecho, fotografoId: data.idFotografoHecho
        });
        this.ubicacionForm.patchValue({ lugar: data.lugarHecho, id_via: data.id_via });
        this.detallesCondicionesForm.patchValue({
            descripcion: data.descripcion || '', cond_climaticas: data.cond_climaticas,
            iluminacion: data.iluminacion, visibilidad: data.visibilidad,
            nro_expediente: data.nro_expediente, comunicacion: data.comJudicial,
            tramita: data.tramitaJudicial, estadoExpte: data.estadoExpte
        });
        // Poblar FormArray de personas
        this.personasArray.clear();
        if (data.participes && data.participes.length > 0) {
            data.participes.forEach((p: any) => this.personasArray.push(this.createPersonaGroupFromData(p)));
        } else {
             this.personasArray.push(this.crearPersonaGroup()); // Añadir uno vacío si no hay
        }
        // Manejar coordenadas
        if (data.coordHecho) {
            try {
                const [latStr, lngStr] = data.coordHecho.split(',');
                const lat = parseFloat(latStr); const lng = parseFloat(lngStr);
                if (!isNaN(lat) && !isNaN(lng)) {
                     this.ubicacionForm.patchValue({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
                     this.updateMapMarker(lat, lng); // Actualizar mapa (se llamará después de init)
                }
            } catch (e) { console.error("Error parseando coordenadas:", e); }
        }
        if (data.firma) { console.log("Firma existente detectada."); }
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar detección
      },
      error: (err) => { /* ... (manejo de error) ... */ }
    });
    this.subscriptions.add(sub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
      this.initializeSignaturePad();
      // Poner marcador si estamos editando y ya tenemos coords
      if (this.isEditing && this.ubicacionForm.value.latitude && this.ubicacionForm.value.longitude) {
          this.updateMapMarker(this.ubicacionForm.value.latitude, this.ubicacionForm.value.longitude);
      }
      this.cdr.detectChanges();
    }, 150);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.map) { this.map.remove(); }
  }

  // --- FormArray Helpers ---
  get personasArray(): FormArray { return this.involucradosForm.get('personas') as FormArray; }
  crearPersonaGroup(): FormGroup {
    return this.fb.group({
      id_participes: [null], tipoUsuario: ['Conductor', Validators.required],
      dni: ['', Validators.required], fechaDeNacimiento: [null],
      nombre: ['', Validators.required], apellido: ['', Validators.required],
      domicilio: [''] });
  }
  // Helper para crear grupo desde datos existentes
  createPersonaGroupFromData(p: any): FormGroup {
     return this.fb.group({
        id_participes: [p.id_participes], // Guardar ID existente
        tipoUsuario: [p.tipoUsuario, Validators.required],
        dni: [p.dni, Validators.required],
        fechaDeNacimiento: [p.fechaDeNacimiento ? this.formatDate(p.fechaDeNacimiento) : null],
        nombre: [p.nombre, Validators.required],
        apellido: [p.apellido, Validators.required],
        domicilio: [p.domicilio]
     });
  }
  agregarPersona(): void { this.personasArray.push(this.crearPersonaGroup()); }
  quitarPersona(index: number): void {
    if (this.personasArray.length > 1) { this.personasArray.removeAt(index); }
    else { Swal.fire('Acción no permitida', 'Debe haber al menos un involucrado.', 'warning'); }
  }

  // --- Map ---
  private initializeMap(): void {
    if (!this.mapCanvas?.nativeElement) { console.error('Map container not found!'); return; }
    if (this.map) { this.map.invalidateSize(); return; }
    try {
      this.map = L.map(this.mapCanvas.nativeElement, { center: [-27.454, -58.984], zoom: 13 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 5, attribution: '&copy; OSM' }).addTo(this.map);
      this.map.on('click', (e: L.LeafletMouseEvent) => this.updateMapMarker(e.latlng.lat, e.latlng.lng));
      console.log("Mapa inicializado.");
    } catch (error) { console.error("Error inicializando mapa:", error); }
  }
  private updateMapMarker(lat: number, lng: number): void {
    if (!this.map) return;
    const coords = L.latLng(lat, lng);
    this.ubicacionForm.patchValue({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    if (this.marker) { this.marker.setLatLng(coords); }
    else { this.marker = L.marker(coords).addTo(this.map); }
    this.map.panTo(coords);
  }

  // --- Signature Pad ---
   private initializeSignaturePad(): void {
     if (!this.sigPadCanvas?.nativeElement) { console.error('SigPad canvas not found!'); return; }
     if (this.signaturePad) { return; }
     try {
        const canvas = this.sigPadCanvas.nativeElement;
        this.signaturePad = new SignaturePad(canvas, { backgroundColor: 'rgb(255, 255, 255)', penColor: 'rgb(0, 0, 0)' });
        this.resizeCanvas(); // Ajustar tamaño inicial
        console.log("SignaturePad inicializado.");
     } catch (error) { console.error("Error inicializando SignaturePad:", error); }
  }
  resizeCanvas(): void {
     if (!this.signaturePad || !this.sigPadCanvas?.nativeElement) return;
     const canvas = this.sigPadCanvas.nativeElement;
     const ratio = Math.max(window.devicePixelRatio || 1, 1);
     // Guardar estado antes de redimensionar
     const data = this.signaturePad.toData();
     canvas.width = canvas.offsetWidth * ratio; canvas.height = canvas.offsetHeight * ratio;
     canvas.getContext('2d')?.scale(ratio, ratio);
     // Restaurar estado después de redimensionar
     this.signaturePad.fromData(data);
  }
  clearSignature(): void { if (this.signaturePad) { this.signaturePad.clear(); } }

  // --- Form Submission ---
  async submitForm(): Promise<void> {
    const firmaRequerida = !this.isEditing && this.signaturePad.isEmpty();
    if (firmaRequerida) {
        Swal.fire('Firma Requerida', 'Firma requerida para crear.', 'warning');
        this.stepper.selectedIndex = 4; return;
    }
    this.markAllAsTouched();
    if (this.informacionBasicaForm.invalid || this.ubicacionForm.invalid || this.involucradosForm.invalid) {
        Swal.fire('Formulario Incompleto', 'Revise los pasos (*).', 'error');
        if (this.informacionBasicaForm.invalid) this.stepper.selectedIndex = 0;
        else if (this.ubicacionForm.invalid) this.stepper.selectedIndex = 1;
        else if (this.involucradosForm.invalid) this.stepper.selectedIndex = 3;
        return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    let apiCall: Observable<any>;
    if (this.isEditing && this.editingIncidentId) {
        console.log(`Enviando ACTUALIZACIÓN ID: ${this.editingIncidentId}`);
        if(this.signaturePad.isEmpty()){ delete formData.firma; }
        apiCall = this.apiService.updateSiniestro(this.editingIncidentId, formData);
    } else {
        console.log('Enviando CREACIÓN');
        apiCall = this.apiService.createSiniestro(formData);
    }

    const submitSub = apiCall.pipe(finalize(() => this.isLoading = false)).subscribe({
        next: (response) => {
            const message = this.isEditing ? 'Siniestro actualizado.' : `Siniestro registrado #${response.id_expediente}`;
            Swal.fire('¡Éxito!', message, 'success');
            this.router.navigate(['/siniestros']); // Volver a la lista
        },
        error: (err) => {
            console.error(`Error al ${this.isEditing ? 'actualizar' : 'crear'} siniestro:`, err);
            Swal.fire('Error', `No se pudo guardar: ${err.message}`, 'error');
        }
    });
    this.subscriptions.add(submitSub);
  }

  prepareFormData(): any {
       const formData = {
          ...this.informacionBasicaForm.value, ...this.ubicacionForm.getRawValue(),
          ...this.detallesCondicionesForm.value, ...this.involucradosForm.value,
          firma: this.signaturePad.isEmpty() ? null : this.signaturePad.toDataURL(),
          usuarioModifica: this.isEditing ? 'UsuarioAngular' : undefined, // TODO: User real
          usuarioCrea: this.isEditing ? undefined : 'UsuarioAngular' // TODO: User real
       };
       formData.coord = (formData.latitude && formData.longitude) ? `${formData.latitude},${formData.longitude}` : null;
       delete formData.latitude; delete formData.longitude;
       formData.peritoId = formData.peritoId || null; formData.fotografoId = formData.fotografoId || null;
       formData.id_via = formData.id_via || null; formData.estadoExpte = formData.estadoExpte || null;

       formData.personas.forEach((p: any) => {
           if (p.fechaDeNacimiento && p.fechaDeNacimiento instanceof Date) {
               p.fechaDeNacimiento = this.formatDate(p.fechaDeNacimiento);
           } else if (!(typeof p.fechaDeNacimiento === 'string' && p.fechaDeNacimiento.match(/^\d{4}-\d{2}-\d{2}/) )){
               p.fechaDeNacimiento = null;
           }
           // Incluir id_participes si existe (para update en backend)
           p.id_participes = p.id_participes || null;
       });

       if(this.isEditing) delete formData.usuarioCrea; else delete formData.usuarioModifica;
       if (!this.isEditing) delete formData.estadoExpte;

       return formData;
   }

   resetForm(): void { // Llamado al cancelar o después de guardar
        this.informacionBasicaForm.reset({ fecha: this.formatDate(new Date()), hora: this.formatTime(new Date()) });
        this.ubicacionForm.reset();
        this.detallesCondicionesForm.reset({ cond_climaticas: 'Despejado', iluminacion: 'Natural Diurna', visibilidad: 'Buena', estadoExpte: null });
        this.involucradosForm.reset({ personas: [] }); this.personasArray.clear();
        this.firmaForm.reset();
        if (this.marker && this.map) { this.map.removeLayer(this.marker); this.marker = null; }
        if (this.signaturePad) { this.signaturePad.clear(); }
        if(this.stepper) { this.stepper.reset(); }
        this.isEditing = false; this.editingIncidentId = null; this.isLinear = true;
        this.agregarPersona(); // Añadir uno vacío para empezar
        console.log("Formulario reseteado a modo creación.");
    }

   // --- Helpers ---
    private markAllAsTouched(): void {
        const forms = [this.informacionBasicaForm, this.ubicacionForm, this.detallesCondicionesForm, this.involucradosForm, this.firmaForm];
        forms.forEach(fg => { Object.values(fg.controls).forEach(c => {
            if (c instanceof FormGroup) Object.values(c.controls).forEach(ic => ic.markAsTouched());
            else if (c instanceof FormArray) c.controls.forEach(g => { if (g instanceof FormGroup) Object.values(g.controls).forEach(ic => ic.markAsTouched()); });
            else c.markAsTouched(); });
        });
    }
    private formatDate(date: Date | string | null): string | null {
        if (!date) return null;
        try { const d = (date instanceof Date) ? date : new Date(date); if (isNaN(d.getTime())) return null; return d.toISOString().split('T')[0]; }
        catch (e) { return null; }
    }
    private formatTime(date: Date): string { const d = new Date(date); return d.toTimeString().split(' ')[0].substring(0,5); }

   onStepChange(event: any): void {
     console.log('Step changed to index:', event.selectedIndex);
     if (event.selectedIndex === 1 && this.map) { setTimeout(() => this.map.invalidateSize(), 150); }
     if (event.selectedIndex === 4 && this.signaturePad) { setTimeout(() => this.resizeCanvas(), 150); }
   }
}

