import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConcxionApi } from 'src/app/utils/concxion-api';


@Injectable({
  providedIn: 'root'
})
export class RolService {

  api: string;

  constructor(private http: HttpClient) {
    this.api = ConcxionApi.URL + 'roles';
  }

  getList() {
    return this.http.get(this.api);
  }

  getFindId(id: number) {
    return this.http.get(this.api + '/' + id);
  }

  insert(evento: any) {
    return this.http.post(this.api, evento);
  }

  update(id: number, evento: any) {
    return this.http.put(this.api + '/' + id, evento);
  }

  delete(id: number) {
    return this.http.delete(this.api + '/' + id);
  }

  filter(criterio: any) {
    const ruta = this.api + '/' + 'filterRol/';
    return this.http.get(ruta + criterio);
  }
}
