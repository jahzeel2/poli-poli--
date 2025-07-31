import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ConcxionApi } from 'src/app/utils/concxion-api';
import { Utils } from 'src/app/utils/utils';


@Injectable({
providedIn: 'root'
})
export class UsuarioCriminalisticaService {
other_header: any;
api: any;

constructor(private http: HttpClient) {
    this.api = ConcxionApi.URL + "usuarios";
}

getFindId(id:any){
    this.other_header = this.other_header;
    return this.http
    .get(this.api +"/login/"+ id, { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}

doLoginId(cifrado: any) {
    this.other_header = Utils.getHeader();
    return this.http
    .get(this.api + '/find/idUserOci/' + cifrado, { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}
getList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/usuarios`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error del lado del cliente: ${error.error.message}`;
        } else {
          errorMessage = `Error del servidor: ${error.status} - ${error.error?.message || error.statusText}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }



doInsert(evento: object){
this.other_header = this.other_header;
    return this.http
    .post(this.api, evento,
    { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        console.log("ERROR",err);
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
    };
    });
}

doUpdate(id: any, evento: any) {
    this.other_header = this.other_header;

    return this.http
    .put(this.api +'/'+ id, evento,
    { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        console.log(err);
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}

doUpdateBaja(id: any, evento: any) {
    this.other_header = this.other_header;

    return this.http
    .put(this.api +'/bajaUsuario/'+ id, evento,
    { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        console.log(err);
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}


doDelete(id: number) {
    this.other_header = this.other_header;
    return this.http.delete(this.api +'/'+ id,
    { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}

doFilter(criterio: any,unidad:any){
this.other_header = this.other_header;
    const ruta = this.api+'/'+'filterUsuario/';
    return this.http
    .get(ruta + criterio+","+ unidad).toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}
}


