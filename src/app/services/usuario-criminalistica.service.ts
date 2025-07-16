import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
getList(page: any, cantidad: any, unidad:any) {
    this.other_header = this.other_header;
    return this.http
    .get(this.api +"/paginate/"+ page+"," +cantidad + ","+ unidad)
    .toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
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
