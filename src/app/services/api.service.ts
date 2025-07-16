import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = 'http://127.0.0.1:5000';
   // O 127.0.0.1:5000;

  constructor(private http: HttpClient) { }

  // --- Health Check ---
  checkBackendHealth(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/health`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Siniestros CRUD ---
  getSiniestros(limit?: number): Observable<any[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<any[]>(`${this.API_BASE_URL}/siniestros`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getSiniestroById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/siniestros/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createSiniestro(siniestroData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/siniestros`, siniestroData).pipe(
      catchError(this.handleError)
    );
  }

  updateSiniestro(id: number, siniestroData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/siniestros/${id}`, siniestroData).pipe(
      catchError(this.handleError)
    );
  }

  deleteSiniestro(id: number, usuarioBaja: string): Observable<any> {
    let params = new HttpParams().set('usuarioBaja', usuarioBaja);
    return this.http.delete<any>(`${this.API_BASE_URL}/siniestros/${id}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // --- Siniestros Mapa ---
  getSiniestroHotspots(fechaInicio: string, fechaFin: string): Observable<any[]> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<any[]>(`${this.API_BASE_URL}/siniestros/hotspots`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // --- Usuarios (Perfiles Locales) CRUD ---
   getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/usuarios`).pipe(
      catchError(this.handleError)
    );
  }

   getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/usuarios/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUsuario(userData: any): Observable<any> {

    return this.http.post<any>(`${this.API_BASE_URL}/usuarios`, userData).pipe(
      catchError(this.handleError)
    );
  }

  updateUsuario(id: number, userData: any): Observable<any> {

    return this.http.put<any>(`${this.API_BASE_URL}/usuarios/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  deleteUsuario(id: number, adminUserId: number): Observable<any> {
     let params = new HttpParams().set('usuarioBajaId', adminUserId.toString());
    return this.http.delete<any>(`${this.API_BASE_URL}/usuarios/${id}`, { params }).pipe(
      catchError(this.handleError)
    );
  }






  // --- Peritos CRUD ---
  getPeritos(tipo?: string): Observable<any[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get<any[]>(`${this.API_BASE_URL}/peritos`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getPeritoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/peritos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createPerito(peritoData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/peritos`, peritoData).pipe(
      catchError(this.handleError)
    );
  }

  updatePerito(id: number, peritoData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/peritos/${id}`, peritoData).pipe(
      catchError(this.handleError)
    );
  }

  deletePerito(id: number, adminUserId: number): Observable<any> {
    let params = new HttpParams().set('usuarioBajaId', adminUserId.toString());
    return this.http.delete<any>(`${this.API_BASE_URL}/peritos/${id}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

   // --- Fotógrafos CRUD ---
   getFotografos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/fotografos`).pipe(
      catchError(this.handleError)
    );
  }

  getFotografoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/fotografos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createFotografo(fotografoData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/fotografos`, fotografoData).pipe(
      catchError(this.handleError)
    );
  }

  updateFotografo(id: number, fotografoData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/fotografos/${id}`, fotografoData).pipe(
      catchError(this.handleError)
    );
  }

  deleteFotografo(id: number, adminUserId: number): Observable<any> {
    let params = new HttpParams().set('usuarioBajaId', adminUserId.toString());
    return this.http.delete<any>(`${this.API_BASE_URL}/fotografos/${id}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // --- Listas para Dropdowns ---
   getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/roles`).pipe(
      catchError(this.handleError)
    );
  }
   getVias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/vias`).pipe(
      catchError(this.handleError)
    );
  }
   getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/estados`).pipe(
      catchError(this.handleError)
    );
  }
//
// --- Guardar Fotos Base64 Siniestro ---
// Acepta un objeto con claves "foto1", "foto2", etc. y valores Base64 Data URL
saveSiniestroFotosBase64(idExpediente: number, payload: { [key: string]: string | null }): Observable<any> {
  // Usar PUT ya que estamos actualizando un siniestro existente
  return this.http.put<any>(`${this.API_BASE_URL}/siniestros/${idExpediente}/fotos`, payload).pipe(
    catchError(this.handleError)
  );
}

getRecentActivity(limit: number = 10): Observable<any[]> {
  let params = new HttpParams().set('limit', limit.toString());
  return this.http.get<any[]>(`${this.API_BASE_URL}/auditoria/recientes`, { params }).pipe(
    catchError(this.handleError)
  );
}




  // --- Generic Error Handler ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error del lado del cliente: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code.
      console.error(
        `Backend retornó código ${error.status}, ` +
        `body era: ${JSON.stringify(error.error)}`);
      // Intentar obtener mensaje de error específico del backend
      errorMessage = `Error del servidor: ${error.status} - ${error.error?.error || error.error?.message || error.statusText || 'Error desconocido'}`;
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }
}

