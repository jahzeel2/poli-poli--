import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// --- ROUTING Y COMPONENTES PRINCIPALES DE LA SECCIÓN "PAGES" ---
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

// --- COMPONENTES PERSONALIZADOS ---
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { AbmConsultaUsuarioComponent } from './components/abm-consulta-usuario/abm-consulta-usuario.component';
import { AbmPeritoComponent } from './components/abm-perito/abm-perito.component';
import { AgregarParticipesComponent } from './components/agregar-participes/agregar-participes.component';
import { CondicionesClimaticasComponent } from './components/siniestrosglobal/condiciones-climaticas/condiciones-climaticas.component';
import { DetallesViaComponent } from './components/siniestrosglobal/detalles-via/detalles-via.component';
import { IncidentDetailDialogComponent } from './components/incident-detail-dialog/incident-detail-dialog.component';
import { IncidentFormComponent } from './components/incident-form/incident-form.component';
import { IncidentListComponent } from './components/lst/incident-list/incident-list.component';
import { IndexSiniestroComponent } from './components/index-siniestro/index-siniestro.component';
import { InformesComponent } from './components/informes/informes.component';
import { ListaSiniestrosComponent } from './components/lst/lista-siniestros/lista-siniestros.component';
import { LstPeritosComponent } from './components/lst/lst-peritos/lst-peritos.component';
import { LstUsuarioComponent } from './components/lst/lst-usuario/lst-usuario.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SiniestrosComponent } from './components/siniestros/siniestros.component';
import { UploadEvidenceDialogComponent } from './components/upload-evidence-dialog/upload-evidence-dialog.component';
import { UploadPhotosComponent } from './components/upload-photos/upload-photos.component';

// --- FILTROS Y WIDGETS ---
import { FilUsuarioComponent } from './components/filtros/fil-usuario/fil-usuario.component';
import { FilUsuariosCriminalisticaComponent } from './components/filtros/fil-usuarios-criminalistica/fil-usuarios-criminalistica.component';
 // ¡AHORA SÍ ESTÁ IMPORTADO!

import { MapViewComponent } from './components/map-view/map-view.component';

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
import { FliPeritosCrimComponent } from './components/filtros/fli-peritos-crim/fli-peritos-crim.component';
import { WgCargandooComponent } from './widgets/wg-cargandoo/wg-cargandoo.component';
import { WgPaginateeComponent } from './widgets/wg-paginatee/wg-paginatee.component';


@NgModule({
  declarations: [
    // Declaramos TODOS los componentes que pertenecen a este módulo
    PagesComponent,
    LayoutComponent,
    DashboardComponent,
    AccesoDenegadoComponent,
    AbmConsultaUsuarioComponent,
    AbmPeritoComponent,
    AgregarParticipesComponent,
    CondicionesClimaticasComponent,
    DetallesViaComponent,
    IncidentDetailDialogComponent,
    IncidentFormComponent,
    IncidentListComponent,
    IndexSiniestroComponent,
    InformesComponent,
    ListaSiniestrosComponent,
FliPeritosCrimComponent,
    LstUsuarioComponent,
    MapViewComponent,
    NavbarComponent,
    SidebarComponent,
    SiniestrosComponent,
    UploadEvidenceDialogComponent,
    UploadPhotosComponent,

    FilUsuariosCriminalisticaComponent,
    WgCargandooComponent,
    WgPaginateeComponent,
  ],
  imports: [
    // Aquí importas todos los módulos que tus componentes van a usar
    CommonModule,
    PagesRoutingModule, // Importante para las rutas de esta sección
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Módulos de Angular Material
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Agregado para mayor flexibilidad con componentes web
  ]
})
export class PagesModule { }
