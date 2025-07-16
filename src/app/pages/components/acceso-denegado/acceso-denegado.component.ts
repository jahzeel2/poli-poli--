import { Component } from '@angular/core';

@Component({
  selector: 'app-acceso-denegado',
  template: `
    <div class="container">
      <h1>Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button routerLink="/login">Volver al Login</button>
    </div>
  `,
  styles: [`
    .container {
      text-align: center;
      margin-top: 50px;
    }
  `]
})
export class AccesoDenegadoComponent { }
