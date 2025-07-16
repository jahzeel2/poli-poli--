// siniestro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiniestroService {
  private apiUrl = 'https://api.policia.com/siniestros';

  constructor(private http: HttpClient) {}

  createSiniestro(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post(`${this.apiUrl}/crear`, data, { headers });
  }
}
