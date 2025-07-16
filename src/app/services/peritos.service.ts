import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConcxionApi } from 'src/app/utils/concxion-api';
import { Utils } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class PeritosService {
  api: string;

  constructor(private http: HttpClient) {
    this.api = ConcxionApi.URL + 'peritos';
  }

  getList(Page: any, Limit: any, unidadCreacion:any) {
    return this.http.get(this.api + '/paginate/'+ Page + ',' + Limit + ','+ unidadCreacion);
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

  //para borrar//
  doDetele(id: any, usuario:any) {
    return this.http.delete(`${this.api}/${id},${usuario}`);
  }


  filter(criterio: any,unidad: number) {
    const ruta = this.api + '/' + 'filterperitos/';
    return this.http.get(ruta + criterio);
  }
  create (evento:any){
    return this.http.post(this.api,evento)
  }
}
