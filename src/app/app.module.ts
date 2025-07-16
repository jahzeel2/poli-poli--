// src/app/app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// Importa el módulo que contiene todas tus páginas y componentes
import { PagesModule } from './pages/pages.module';

// Importa solo los módulos de Material que se usan en el Login
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // NO declares aquí los componentes de 'pages', ya lo hace PagesModule
  ],
  imports: [
    // Módulos esenciales para que la app funcione
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // El módulo que contiene todas tus páginas y componentes
    PagesModule,

    // Módulos de Material solo para el Login
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [],
   schemas: [
      CUSTOM_ELEMENTS_SCHEMA // Agregado para mayor flexibilidad con componentes web
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
