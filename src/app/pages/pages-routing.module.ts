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
      // {
      //   path: 'mapa',
      //   children: [
      //     {
      //       path: 'abm/:id',
      //       component: MapViewComponent,
      //     },

      //   ],
      // },
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
