import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SiniestrosComponent } from './components/siniestros/siniestros.component';
import { ListaSiniestrosComponent } from './components/lst/lista-siniestros/lista-siniestros.component';

import { AbmConsultaUsuarioComponent } from './components/abm-consulta-usuario/abm-consulta-usuario.component';
import { LstUsuarioComponent } from './components/lst/lst-usuario/lst-usuario.component';
import { AbmPeritoComponent } from './components/abm-perito/abm-perito.component';
import { LstPeritosComponent } from './components/lst/lst-peritos/lst-peritos.component';
import { IndexSiniestroComponent } from './components/index-siniestro/index-siniestro.component';
import { IncidentFormComponent } from './components/incident-form/incident-form.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { IncidentListComponent } from './components/lst/incident-list/incident-list.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,

    children: [
      {
        path: 'Dashboard',
        component: DashboardComponent,
      },
      {
        path: 'nuevo-siniestro',
        component: IncidentFormComponent,
      },
      {
        path: 'lista-siniestros',
        component: IncidentListComponent,
      },
      {
        path: 'nuevo-siniestro/:id',
        component: SiniestrosComponent,
      },
      {
        path: 'lst-estados',
        children: [
          {
            path: 'abm/:id',
            component: SiniestrosComponent,
          },
          {
            path: '',
            component: ListaSiniestrosComponent,
          },
        ],
      },
      {
        path: 'mapa',
        children: [
          {
            path: '',
            component: MapViewComponent,
          },

        ],
      },
      {
        path: 'busqueda-usuario',
        children: [
          {
            path: 'abm',
            component: AbmConsultaUsuarioComponent,
            //canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'lst-usuarios',
        children: [
          // {
          //   //path: 'abm/:id',
          //    //component: AbmRegistroCivilComponent,
          //    //canActivate: [AuthGuard],
          // },
          {
          path: '',
            component: LstUsuarioComponent,
             //canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'lst-peritos',
        children: [
          {
            path: 'abm/:id',
            component: AbmPeritoComponent,
          },
          {
            path: '',
            component: LstPeritosComponent,
          },
        ],
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
