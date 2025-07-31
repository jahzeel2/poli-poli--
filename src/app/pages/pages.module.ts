/**
 * Archivo: src/app/pages/pages.module.ts
 * Corrección: Se importó FormsModule y ReactiveFormsModule.
 * Se declararon TODOS los componentes que pertenecen a este módulo.
 * Esta es la corrección principal para la mayoría de tus errores.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// --- MÓDULOS Y COMPONENTES ESENCIALES ---
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';

// --- ABM Y FORMULARIOS ---
import { AbmConsultaUsuarioComponent } from './components/abm-consulta-usuario/abm-consulta-usuario.component';
import { AbmPeritoComponent } from './components/abm-perito/abm-perito.component';
import { AgregarParticipesComponent } from './components/agregar-participes/agregar-participes.component';
import { IncidentFormComponent } from './components/incident-form/incident-form.component';
import { SiniestrosComponent } from './components/siniestros/siniestros.component';


// --- LISTAS Y DIÁLOGOS ---
import { IncidentListComponent } from './components/lst/incident-list/incident-list.component';
import { ListaSiniestrosComponent } from './components/lst/lista-siniestros/lista-siniestros.component';
import { LstPeritosComponent } from './components/lst/lst-peritos/lst-peritos.component';
import { LstUsuarioComponent } from './components/lst/lst-usuario/lst-usuario.component';
import { IncidentDetailDialogComponent } from './components/incident-detail-dialog/incident-detail-dialog.component';
import { UploadEvidenceDialogComponent } from './components/upload-evidence-dialog/upload-evidence-dialog.component';

// --- FILTROS, WIDGETS Y OTROS ---
import { FilUsuarioComponent } from './components/filtros/fil-usuario/fil-usuario.component';
import { FilUsuariosCriminalisticaComponent } from './components/filtros/fil-usuarios-criminalistica/fil-usuarios-criminalistica.component';
import { FliPeritosCrimComponent } from './components/filtros/fli-peritos-crim/fli-peritos-crim.component';
import { WgCargandoComponent } from './widgets/wg-cargando/wg-cargando.component';
import { WgPaginateComponent } from './widgets/wg-paginate/wg-paginate.component';
import { MapViewComponent } from './components/map-view/map-view.component';

import { IndexSiniestroComponent } from './components/index-siniestro/index-siniestro.component';
import { UploadPhotosComponent } from './components/upload-photos/upload-photos.component';
import { CondicionesClimaticasComponent } from './components/siniestrosglobal/condiciones-climaticas/condiciones-climaticas.component';
import { DetallesViaComponent } from './components/siniestrosglobal/detalles-via/detalles-via.component';


// --- MÓDULOS DE ANGULAR MATERIAL ---
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComboRolComponent } from './components/combo-rol/combo-rol.component';

@NgModule({
  declarations: [
    PagesComponent, LayoutComponent, DashboardComponent, NavbarComponent, SidebarComponent,
    AccesoDenegadoComponent, AbmConsultaUsuarioComponent, AbmPeritoComponent,
    AgregarParticipesComponent, IncidentFormComponent, SiniestrosComponent,
    IncidentListComponent, ListaSiniestrosComponent, LstPeritosComponent, LstUsuarioComponent,
    IncidentDetailDialogComponent, UploadEvidenceDialogComponent, FilUsuarioComponent,
    FilUsuariosCriminalisticaComponent, FliPeritosCrimComponent, WgCargandoComponent,
    WgPaginateComponent, MapViewComponent,  IndexSiniestroComponent,
    UploadPhotosComponent, CondicionesClimaticasComponent, DetallesViaComponent,ComboRolComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatBadgeModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule,
    MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatGridListModule,
    MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule,
    MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
