import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConcxionApi } from 'src/app/utils/concxion-api';
import { Utils } from 'src/app/utils/utils';

@Injectable({
providedIn: 'root'
})
export class HabilitarperitosService {

other_header: any;
api: any;

constructor(private http: HttpClient) {   
    this.api = ConcxionApi.URLRegBus + "usuario/";
}

getFindId(id:any){
    this.other_header = this.other_header;
    return this.http
    .get(this.api +"/"+ id, { headers: this.other_header })
    .toPromise()
    .catch((err) => {
        return {
        code: 500,
        data: err.message,
        msg: 'Error en el servicio',
        };
    });
}
getList(Page: any, Limit: any, unidadCreacion:any) {
    return this.http.get(this.api + '/paginate/'+ Page + ',' + Limit + ','+ unidadCreacion);
}
doFindDni(dni: any) {
    this.other_header = Utils.getHeader();
    return this.http
    .post(this.api + 'find/usuarioSistema/' + dni, {
        headers: this.other_header,
    })
    .toPromise()
    .catch((err) => {
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
    .put(this.api +'/bajaPerito/'+ id, evento, 
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
}
